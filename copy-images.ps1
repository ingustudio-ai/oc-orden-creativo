$srcDir = "D:\MET Diseño\Downloads\OC\MAZO OC\OK"
$dstDir = "D:\MET Diseño\Documents\Default Project\assets"

# Copy all PNGs from source to destination
Get-ChildItem $srcDir -Filter "*.png" | ForEach-Object {
    $dst = Join-Path $dstDir $_.Name
    Copy-Item $_.FullName $dst -Force
}

# Now rename the specific files to match the HTML references
# Map source filenames to target filenames
$mapping = @{
    "aurea-heredero.png" = "aurea-heredero.png"
    "0.png" = "1000129956.png"
    "1.png" = "1000129942.png"
    "ChatGPT Image 8 sept 2026, 02_47_15 p.m.png" = "1000129941.png"
    "ChatGPT Image 8 sept 2026, 02_47_33 p.m.png" = "1000129940.png"
    "ChatGPT Image 8 sept 2026, 12_34_59 p.m.png" = "1000129939.png"
    "ChatGPT Image 8 sept 2026, 12_35_20 p.m.png" = "1000129938.png"
    "ChatGPT Image 8 sept 2026, 12_35_41 p.m.png" = "1000129937.png"
    "ChatGPT Image 8 sept 2026, 12_41_22 p.m.png" = "1000129955.png"
    "ChatGPT Image 8 sept 2026, 12_41_33 p.m.png" = "1000129957.png"
    "ChatGPT Image 8 sept 2026, 12_41_51 p.m.png" = "1000129909.png"
    "ChatGPT Image 8 sept 2026, 12_42_13 p.m.png" = "1000129958.png"
    "ChatGPT Image 8 sept 2026, 12_44_56 p.m.png" = "1000129912.png"
    "ChatGPT Image 8 sept 2026, 12_45_11 p.m.png" = "1000129959.png"
    "ChatGPT Image 8 sept 2026, 12_45_17 p.m.png" = "1000129911.png"
    "ChatGPT Image 8 sept 2026, 12_45_25 p.m.png" = "1000129907.png"
    "ChatGPT Image 8 sept 2026, 12_45_51 p.m.png" = "1000129960.png"
    "ChatGPT Image 8 sept 2026, 12_45_55 p.m.png" = "1000129943.png"
}

foreach ($key in $mapping.Keys) {
    $srcFile = Join-Path $dstDir $key
    $targetFile = Join-Path $dstDir $mapping[$key]
    if ((Test-Path $srcFile) -and ($key -ne $mapping[$key])) {
        if (Test-Path $targetFile) { Remove-Item $targetFile }
        Move-Item $srcFile $targetFile -Force
    }
}

# Remove the original short-named files
@("0.png","1.png") | ForEach-Object {
    $f = Join-Path $dstDir $_
    if (Test-Path $f) { Remove-Item $f }
}

# Copy orden-creativo-logo.png if it doesn't exist properly
$logoSrc = "D:\MET Diseño\Documents\Default Project\LOGO_VB.png"
$logoDst = Join-Path $dstDir "orden-creativo-logo.png"
if (Test-Path $logoSrc) { Copy-Item $logoSrc $logoDst -Force }

# Copy orden-creativo-logo.png for brand
$brandLogo = Join-Path $dstDir "orden-creativo-logo.png"
if (-not (Test-Path $brandLogo)) {
    # Copy the favicon as placeholder for the brand logo
    Copy-Item "D:\MET Diseño\Documents\Default Project\favicon.png" $brandLogo -Force
}

Write-Host "All images copied and mapped successfully"
Write-Host "Files in assets:"
Get-ChildItem $dstDir -Filter "*.png" | ForEach-Object { Write-Host "  $($_.Name) ($($_.Length) bytes)" }
