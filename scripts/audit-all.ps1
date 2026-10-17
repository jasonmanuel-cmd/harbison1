param([string]$BaseUrl = 'http://127.0.0.1:4322', [int]$ChromePort = 0)
# Build first, then run python scripts/preview-production.py in another terminal.
$ErrorActionPreference = 'Stop'
$env:CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
New-Item -ItemType Directory -Force -Path audits | Out-Null
$rows = @()
$failed = $false
foreach ($profile in @('mobile', 'desktop')) {
  foreach ($route in @('/', '/about/')) {
    $slug = if ($route -eq '/') { 'home' } else { 'bio' }
    $out = "audits/$slug-$profile.json"
    $arguments = @("$BaseUrl$route", '--chrome-flags=--headless --no-sandbox',
      '--only-categories=performance,accessibility,best-practices,seo',
      '--output=json', "--output-path=$out", '--quiet')
    if ($profile -eq 'desktop') { $arguments += '--preset=desktop' }
    if ($ChromePort -gt 0) { $arguments += "--port=$ChromePort" }
    & npx --yes lighthouse @arguments
    # Chrome may report a Windows cleanup error after successfully saving a report.
    if (-not (Test-Path $out)) { throw "Missing Lighthouse report: $out" }
    $report = Get-Content $out -Raw | ConvertFrom-Json
    if ($report.runtimeError) { throw $report.runtimeError.message }
    $result = [ordered]@{ Page = $slug; Profile = $profile }
    foreach ($category in @('performance', 'accessibility', 'best-practices', 'seo')) {
      $score = $report.categories.$category.score
      if ($null -eq $score) { throw "Missing score: $category" }
      $result[$category] = [math]::Round($score * 100)
      if ($result[$category] -lt 90) { $failed = $true }
    }
    $rows += [pscustomobject]$result
  }
}
$rows | Format-Table -AutoSize
if ($failed) { throw 'One or more Lighthouse categories scored below 90.' }
