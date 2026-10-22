$root = $PSScriptRoot
$listener = $null
$port = 8000
while ($port -le 8010) {
  $l = New-Object System.Net.HttpListener
  $l.Prefixes.Add("http://localhost:$port/")
  try { $l.Start(); $listener = $l; break } catch { $port++ }
}
if (-not $listener) { Write-Host "Kein freier Port zwischen 8000 und 8010."; Read-Host "Enter zum Beenden"; exit 1 }
$types = @{ ".html"="text/html; charset=utf-8"; ".jpg"="image/jpeg"; ".png"="image/png"; ".css"="text/css"; ".js"="text/javascript"; ".mp4"="video/mp4"; ".txt"="text/plain; charset=utf-8" }
$url = "http://localhost:$port/"
Write-Host "CleanGate laeuft auf $url"
Write-Host "Dieses Fenster offen lassen. Zum Beenden schliessen."
Start-Process $url
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $rel = [Uri]::UnescapeDataString($ctx.Request.Url.LocalPath).TrimStart('/')
  if ($rel -eq "") { $rel = "index.html" }
  $file = [System.IO.Path]::GetFullPath((Join-Path $root $rel))
  if ($file.StartsWith($root) -and (Test-Path $file -PathType Leaf)) {
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $ext = [System.IO.Path]::GetExtension($file).ToLower()
    $ctx.Response.ContentType = $(if ($types.ContainsKey($ext)) { $types[$ext] } else { "application/octet-stream" })
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $ctx.Response.StatusCode = 404
  }
  $ctx.Response.Close()
}
