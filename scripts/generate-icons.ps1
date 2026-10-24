Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\BAC_PHAM\.gemini\antigravity-ide\brain\e67bd995-d53c-48f7-b56e-7f2c6972aa59\an_lich_full_icon_1792855626209.jpg"
$assetsDir = "d:\PhamBaBac\lich-van-nien-app\assets"

if (-not (Test-Path $srcPath)) {
    Write-Error "Source image not found: $srcPath"
    exit 1
}

$srcImg = [System.Drawing.Image]::FromFile($srcPath)

# 1. assets/icon.png (1024x1024 Full Bleed)
$iconBmp = New-Object System.Drawing.Bitmap 1024, 1024
$g = [System.Drawing.Graphics]::FromImage($iconBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($srcImg, 0, 0, 1024, 1024)
$g.Dispose()
$iconBmp.Save("$assetsDir\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$iconBmp.Dispose()
Write-Host "Created assets/icon.png"

# 2. assets/android-icon-background.png (1024x1024 Cinnabar Red #8E161C)
$bgBmp = New-Object System.Drawing.Bitmap 1024, 1024
$gBg = [System.Drawing.Graphics]::FromImage($bgBmp)
$redColor = [System.Drawing.ColorTranslator]::FromHtml("#8E161C")
$brush = New-Object System.Drawing.SolidBrush $redColor
$gBg.FillRectangle($brush, 0, 0, 1024, 1024)
$brush.Dispose()
$gBg.Dispose()
$bgBmp.Save("$assetsDir\android-icon-background.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bgBmp.Dispose()
Write-Host "Created assets/android-icon-background.png"

# 3. assets/android-icon-foreground.png (1024x1024 with 70% scale centered to respect Android safe zone)
$fgBmp = New-Object System.Drawing.Bitmap 1024, 1024
$gFg = [System.Drawing.Graphics]::FromImage($fgBmp)
$gFg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gFg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gFg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
# Draw scaled emblem (720x720 centered at (152, 152))
$targetSize = 720
$offset = [int]((1024 - $targetSize) / 2)
$gFg.DrawImage($srcImg, $offset, $offset, $targetSize, $targetSize)
$gFg.Dispose()
$fgBmp.Save("$assetsDir\android-icon-foreground.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fgBmp.Dispose()
Write-Host "Created assets/android-icon-foreground.png"

# 4. assets/favicon.png (48x48)
$favBmp = New-Object System.Drawing.Bitmap 48, 48
$gFav = [System.Drawing.Graphics]::FromImage($favBmp)
$gFav.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gFav.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gFav.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gFav.DrawImage($srcImg, 0, 0, 48, 48)
$gFav.Dispose()
$favBmp.Save("$assetsDir\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$favBmp.Dispose()
Write-Host "Created assets/favicon.png"

# 5. assets/splash-icon.png (512x512)
$splashBmp = New-Object System.Drawing.Bitmap 512, 512
$gSp = [System.Drawing.Graphics]::FromImage($splashBmp)
$gSp.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gSp.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gSp.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gSp.DrawImage($srcImg, 0, 0, 512, 512)
$gSp.Dispose()
$splashBmp.Save("$assetsDir\splash-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$splashBmp.Dispose()
Write-Host "Created assets/splash-icon.png"

$srcImg.Dispose()
Write-Host "Icon generation completed successfully!"
