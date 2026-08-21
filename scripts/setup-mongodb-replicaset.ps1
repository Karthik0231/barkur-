# Run as Administrator:  powershell -ExecutionPolicy Bypass -File scripts\setup-mongodb-replicaset.ps1
# Converts local standalone MongoDB into a single-node replica set (required by Prisma).

$ErrorActionPreference = "Stop"
$cfgPath = "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg"

if (-not (Test-Path $cfgPath)) { throw "mongod.cfg not found at $cfgPath" }

# 1. Backup config
Copy-Item $cfgPath "$cfgPath.bak" -Force
Write-Host "Backed up $cfgPath -> $cfgPath.bak"

# 2. Add replSetName block
$content = Get-Content $cfgPath -Raw
if ($content -notmatch 'replSetName') {
  $content = $content -replace '(?m)^#replication:.*$', ''
  $content = $content.TrimEnd() + "`n`nreplication:`n  replSetName: rs0`n"
  [System.IO.File]::WriteAllText($cfgPath, $content, (New-Object System.Text.UTF8Encoding($false)))
  Write-Host "Added replication.replSetName = rs0 to $cfgPath"
} else {
  Write-Host "replSetName already present, skipping config edit"
}

# 3. Restart MongoDB service
Restart-Service -Name MongoDB -Force
Write-Host "Restarted MongoDB service"

# 4. Wait for mongod to come up, then initiate replica set
Start-Sleep -Seconds 3
& "C:\Program Files\MongoDB\Server\8.2\bin\mongosh.exe" --quiet --eval 'try { rs.initiate() } catch (e) { if (e.codeName === "AlreadyInitialized") { print("already initialized") } else { throw e } }'
Start-Sleep -Seconds 2
& "C:\Program Files\MongoDB\Server\8.2\bin\mongosh.exe" --quiet --eval 'db.hello().isWritablePrimary'
Write-Host "Done. Replica set should now be PRIMARY."
