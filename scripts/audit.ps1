# Runs Lighthouse across mobile, tablet, and desktop for a set of URLs and
# writes a summary. Lighthouse's own temp-dir cleanup fails on Windows, which
# is harmless — the report is still written.
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$tmp = 'C:\Users\blunt\AppData\Local\Temp\opencode\lh'
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
$env:TEMP = $tmp
$env:TMP = $tmp
New-Item -ItemType Directory -Force -Path audits | Out-Null

$targets = $args
if ($targets.Count -eq 0) { $targets = @('https://harbison1.vercel.app/') }

$profiles = @(
  @{ name = 'mobile';  args = @('--form-factor=mobile',  '--screenEmulation.mobile') },
  @{ name = 'tablet';  args = @('--preset=desktop') },
  @{ name = 'desktop'; args = @('--preset=desktop') }
)

$rows = @()
foreach ($url in $targets) {
  $slug = ($url -replace 'https://harbison1.vercel.app', '' -replace '[^a-zA-Z0-9]', '_')
  if (-not $slug) { $slug = 'home' }

  foreach ($p in $profiles) {
    $out = "audits\$slug-$($p.name).json"
    $extra = @()
    if ($p.name -eq 'tablet') {
      # iPad-ish: 834x1112 at 2x. Lighthouse presets do not cover this, so drive
      # the emulation flags directly.
      $extra = @('--screenEmulation.width=834', '--screenEmulation.height=1112',
                 '--screenEmulation.deviceScaleFactor=2', '--screenEmulation.mobile=true')
    } elseif ($p.name -eq 'desktop') {
      $extra = @('--screenEmulation.width=1440', '--screenEmulation.height=900',
                 '--screenEmulation.deviceScaleFactor=1', '--screenEmulation.mobile=false')
    }

    $chromeFlags = "--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --user-data-dir=$tmp\prof-$slug-$($p.name)"
    & npx --yes lighthouse $url @($p.args + $extra) --quiet --output=json --output-path=$out --chrome-flags=$chromeFlags --chrome-path=$chrome 2>&1 | Out-Null

    if (Test-Path $out) {
      $r = Get-Content $out -Raw | ConvertFrom-Json
      $c = $r.categories
      $rows += [pscustomobject]@{
        Page   = $slug
        Device = $p.name
        Perf   = [math]::Round($c.performance.score * 100)
        A11y   = [math]::Round($c.accessibility.score * 100)
        Best   = [math]::Round($c.'best-practices'.score * 100)
        SEO    = [math]::Round($c.seo.score * 100)
        Agent  = if ($c.'agentic-browsing') { [math]::Round($c.'agentic-browsing'.score * 100) } else { '-' }
        LCP    = $r.audits.'largest-contentful-paint'.displayValue
        CLS    = $r.audits.'cumulative-layout-shift'.displayValue
      }
    }
  }
}

$rows | Format-Table -AutoSize
