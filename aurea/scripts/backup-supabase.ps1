<#
.SYNOPSIS
  Backup de la base de datos de Áurea (Supabase) con pg_dump.

.DESCRIPTION
  Genera un archivo .dump (formato custom, comprimido) con todas las tablas,
  políticas RLS, funciones y datos del proyecto, y borra los backups más
  antiguos que la retención indicada.

  El plan Free de Supabase no incluye backups automáticos: este script es la
  red de seguridad. Conviene ejecutarlo al menos una vez por semana.

.PARAMETER ConnectionString
  Cadena de conexión de Postgres. Si se omite, se toma de $env:SUPABASE_DB_URL.
  En Supabase: Project Settings → Database → Connection string → "Session pooler"
  (es la que funciona desde redes IPv4). Reemplazá [YOUR-PASSWORD] por la
  contraseña de la base.

.PARAMETER OutDir
  Carpeta destino. Por defecto: <repo>/aurea/backups (ignorada por Git).

.PARAMETER RetentionDays
  Días que se conservan los backups. Por defecto: 30.

.EXAMPLE
  $env:SUPABASE_DB_URL = "postgresql://postgres.xxxx:CLAVE@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"
  .\aurea\scripts\backup-supabase.ps1

.EXAMPLE
  .\aurea\scripts\backup-supabase.ps1 -ConnectionString "postgresql://..." -RetentionDays 90

.NOTES
  Requiere PostgreSQL 15 o superior instalado (pg_dump en el PATH).
  Windows:  winget install PostgreSQL.PostgreSQL.15
  Restaurar un backup:
    pg_restore --clean --if-exists --no-owner --no-privileges -d "$env:SUPABASE_DB_URL" aurea-AAAAMMDD-HHMMSS.dump
#>

[CmdletBinding()]
param(
  [string]$ConnectionString = $env:SUPABASE_DB_URL,
  [string]$OutDir = (Join-Path (Split-Path -Parent $PSScriptRoot) "backups"),
  [int]$RetentionDays = 30
)

$ErrorActionPreference = "Stop"

function Write-Step([string]$Text) { Write-Host "› $Text" -ForegroundColor Cyan }
function Write-Ok([string]$Text) { Write-Host "✔ $Text" -ForegroundColor Green }
function Write-Err([string]$Text) { Write-Host "✖ $Text" -ForegroundColor Red }

Write-Host ""
Write-Host "ÁUREA · Backup de Supabase" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor DarkGray

if (-not $ConnectionString) {
  Write-Err "Falta la cadena de conexión."
  Write-Host ""
  Write-Host "Definila antes de ejecutar:" -ForegroundColor Gray
  Write-Host '  $env:SUPABASE_DB_URL = "postgresql://postgres.PROYECTO:CLAVE@HOST:5432/postgres"' -ForegroundColor Gray
  Write-Host "  (Supabase → Project Settings → Database → Connection string → Session pooler)" -ForegroundColor Gray
  exit 1
}

$pgDump = Get-Command pg_dump -ErrorAction SilentlyContinue
if (-not $pgDump) {
  Write-Err "No se encontró pg_dump en el PATH."
  Write-Host ""
  Write-Host "Instalá PostgreSQL (incluye pg_dump):" -ForegroundColor Gray
  Write-Host "  winget install PostgreSQL.PostgreSQL.15" -ForegroundColor Gray
  Write-Host "Después cerrá y volvé a abrir la terminal." -ForegroundColor Gray
  exit 1
}

if (-not (Test-Path -LiteralPath $OutDir)) {
  New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$file = Join-Path $OutDir "aurea-$stamp.dump"

Write-Step "Exportando la base de datos…"
& $pgDump --dbname=$ConnectionString --no-owner --no-privileges --format=custom --file=$file
if ($LASTEXITCODE -ne 0) {
  Write-Err "pg_dump terminó con código $LASTEXITCODE. El backup no se completó."
  if (Test-Path -LiteralPath $file) { Remove-Item -LiteralPath $file -Force }
  exit $LASTEXITCODE
}

$sizeMb = "{0:N2}" -f ((Get-Item -LiteralPath $file).Length / 1MB)
Write-Ok "Backup creado: $file ($sizeMb MB)"

if ($RetentionDays -gt 0) {
  $limit = (Get-Date).AddDays(-$RetentionDays)
  $old = Get-ChildItem -LiteralPath $OutDir -Filter "aurea-*.dump" -File |
    Where-Object { $_.LastWriteTime -lt $limit }
  if ($old) {
    $old | Remove-Item -Force
    Write-Ok "Backups eliminados por retención ($RetentionDays días): $($old.Count)"
  }
}

$total = (Get-ChildItem -LiteralPath $OutDir -Filter "aurea-*.dump" -File | Measure-Object).Count
Write-Host ""
Write-Ok "Listo. Backups guardados: $total en $OutDir"
Write-Host "Recordá: esta carpeta no se versiona (contiene datos personales)." -ForegroundColor DarkGray
Write-Host ""
