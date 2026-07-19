# Servidor estatico minimo para desarrollo local.
# Util si no tienes Node ni Python: solo necesita Windows PowerShell.
#   powershell -ExecutionPolicy Bypass -File servidor.ps1
# Luego abre http://localhost:5173  (Ctrl+C para detenerlo)
#
# Nota: sin acentos a proposito. PowerShell 5.1 lee los .ps1 como ANSI
# y los caracteres no ASCII se corromperian.

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$prefix = "http://localhost:5173/"

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".md"   = "text/markdown; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".ico"  = "image/x-icon"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Sirviendo $root en $prefix  (Ctrl+C para salir)"

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $rel = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
  if ($rel -eq "") { $rel = "index.html" }
  $path = Join-Path $root ($rel -replace '/', '\')
  if (Test-Path -LiteralPath $path -PathType Container) { $path = Join-Path $path "index.html" }

  if (Test-Path -LiteralPath $path -PathType Leaf) {
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $ext = [System.IO.Path]::GetExtension($path).ToLower()
    $ct = $mime[$ext]
    if (-not $ct) { $ct = "application/octet-stream" }
    $ctx.Response.ContentType = $ct
    $ctx.Response.StatusCode = 200
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $ctx.Response.StatusCode = 404
    $b = [System.Text.Encoding]::UTF8.GetBytes("404 $rel")
    $ctx.Response.OutputStream.Write($b, 0, $b.Length)
  }
  $ctx.Response.Close()
}
