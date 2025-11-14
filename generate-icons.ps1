Add-Type -AssemblyName System.Drawing

$sourcePath = "public\icons\icon-512x512.png"
$img = [System.Drawing.Image]::FromFile($sourcePath)

# Generate 144x144 icon
$newImg144 = New-Object System.Drawing.Bitmap(144, 144)
$graphics144 = [System.Drawing.Graphics]::FromImage($newImg144)
$graphics144.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics144.DrawImage($img, 0, 0, 144, 144)
$newImg144.Save("public\icons\icon-144x144.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics144.Dispose()
$newImg144.Dispose()

# Generate 384x384 icon
$newImg384 = New-Object System.Drawing.Bitmap(384, 384)
$graphics384 = [System.Drawing.Graphics]::FromImage($newImg384)
$graphics384.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics384.DrawImage($img, 0, 0, 384, 384)
$newImg384.Save("public\icons\icon-384x384.png", [System.Drawing.Imaging.ImageFormat]::Png)
$graphics384.Dispose()
$newImg384.Dispose()

$img.Dispose()

Write-Host "Icons generated successfully: icon-144x144.png and icon-384x384.png"
