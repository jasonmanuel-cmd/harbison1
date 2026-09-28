# Removes raster originals that have a WebP replacement and are no longer
# referenced by any source file. WebP has been in universal browser support
# since 2020, so no fallback <picture> is needed.
$root = 'C:\Users\blunt\Desktop\herbison1'
$public = Join-Path $root 'public'

# Collect every asset path referenced in source.
$refs = New-Object 'System.Collections.Generic.HashSet[string]'
$sourceFiles = @()
$sourceFiles += Get-ChildItem -Recurse -Include *.tsx, *.ts -Path (Join-Path $root 'components'), (Join-Path $root 'app'), (Join-Path $root 'lib') -ErrorAction SilentlyContinue
# The [slug] folder breaks -Include globbing, so pull it in explicitly.
$sourceFiles += Get-Item -LiteralPath (Join-Path $root 'app\property\[slug]\page.tsx') -ErrorAction SilentlyContinue

foreach ($f in $sourceFiles) {
  if ($null -eq $f) { continue }
  $text = [System.IO.File]::ReadAllText($f.FullName)
  foreach ($m in [regex]::Matches($text, '/(?:images|video)/[A-Za-z0-9/_.-]+\.(?:jpg|jpeg|png|webp|mp4)')) {
    [void]$refs.Add($m.Value)
  }
}

Write-Output "referenced assets: $($refs.Count)"

$removed = 0
$freed = 0L
$candidates = @()
$candidates += Get-ChildItem (Join-Path $public 'images') -Recurse -File -Include *.jpg, *.jpeg, *.png -ErrorAction SilentlyContinue
$candidates += Get-ChildItem (Join-Path $public 'video') -Recurse -File -Include *.jpg, *.jpeg, *.png -ErrorAction SilentlyContinue

foreach ($f in $candidates) {
  $rel = $f.FullName.Substring($public.Length).Replace('\', '/')
  $webpRel = $rel -replace '\.(jpg|jpeg|png)$', '.webp'
  $webpPath = Join-Path $public ($webpRel -replace '/', '\')

  if (-not (Test-Path -LiteralPath $webpPath)) { continue }
  if ($refs.Contains($rel)) { continue }

  $freed += $f.Length
  $removed++
  Remove-Item -LiteralPath $f.FullName -Force
}

Write-Output "removed $removed unreferenced originals, freed $([math]::Round($freed/1mb,1)) MB"
$total = (Get-ChildItem (Join-Path $public 'images') -Recurse -File | Measure-Object Length -Sum).Sum
Write-Output "public/images now: $([math]::Round($total/1mb,1)) MB"
