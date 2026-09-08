$names = @('1000129956','1000129942','1000129941','1000129940','1000129939','1000129938','1000129937','1000129955','1000129957','1000129909','1000129958','1000129912','1000129959','1000129911','1000129907','1000129960','1000129943','1000129944','1000129993','arcano-14','arcano-15','arcano-17')
$base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
foreach ($n in $names) {
    $path = "D:\MET Diseño\Documents\Default Project\assets\$n.png"
    if (-not (Test-Path $path)) {
        [System.IO.File]::WriteAllBytes($path, [Convert]::FromBase64String($base64))
    }
}
Write-Host "Created placeholder images"
