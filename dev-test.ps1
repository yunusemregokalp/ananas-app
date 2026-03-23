$job = Start-Job { Set-Location C:\Users\90531\Desktop\PROGRAMLAR\ANANAS\ananas-app; npm.cmd run dev > next-logs.txt 2>&1 }
Start-Sleep -Seconds 10
try {
  Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing
} catch {
  Write-Host "Error hitting localhost"
}
Start-Sleep -Seconds 5
Stop-Job $job
Remove-Job $job
