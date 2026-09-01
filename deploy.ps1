# Script de despliegue para OC Orden Creativo en GitHub Pages
# Ejecutar en PowerShell: .\deploy.ps1

Write-Host "🚀 Despliegue de OC Orden Creativo en GitHub Pages" -ForegroundColor Green
Write-Host ""

# Paso 1: Verificar que hay cambios
Write-Host "📋 Verificando cambios..." -ForegroundColor Cyan
git status

# Paso 2: Configurar el remote si no existe
$remote = git remote get-url origin 2>$null
if (-not $remote) {
    Write-Host ""
    Write-Host "🔗 Configurando el repositorio remoto..." -ForegroundColor Cyan
    $repoName = Read-Host "Ingresa el nombre del repositorio de GitHub (ej: oc-orden-creativo)"
    git remote add origin "https://github.com/TU_USUARIO/$repoName.git"
    Write-Host "Remote añadido: origin -> https://github.com/TU_USUARIO/$repoName.git" -ForegroundColor Green
} else {
    Write-Host "✅ Remote ya configurado: $remote" -ForegroundColor Green
}

# Paso 3: Push
Write-Host ""
Write-Host "📤 Subiendo código a GitHub..." -ForegroundColor Cyan
git push -u origin master

Write-Host ""
Write-Host "✅ Código subido exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Para activar GitHub Pages:" -ForegroundColor Yellow
Write-Host "   1. Ve a: https://github.com/TU_USUARIO/NOMBRE_REPO" -ForegroundColor Yellow
Write-Host "   2. Haz clic en Settings > Pages" -ForegroundColor Yellow
Write-Host "   3. Selecciona Source: Deploy from a branch" -ForegroundColor Yellow
Write-Host "   4. Selecciona Branch: master, Folder: / (root)" -ForegroundColor Yellow
Write-Host "   5. Haz clic en Save" -ForegroundColor Yellow
Write-Host "   6. Tu sitio estará en: https://TU_USUARIO.github.io/NOMBRE_REPO" -ForegroundColor Yellow
Write-Host ""
Write-Host "⏳ Espera 1-2 minutos para que el sitio esté disponible." -ForegroundColor Yellow