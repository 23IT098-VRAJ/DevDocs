param(
    [string]$PairEndpoint,
    [string]$PairCode,
    [string]$ConnectEndpoint,
    [string]$DeviceId,
    [string]$BackendHost,
    [int]$BackendPort = 8000,
    [switch]$UseApiBaseUrl,
    [switch]$SkipPair,
    [switch]$SkipConnect
)

$ErrorActionPreference = 'Stop'

function Test-CommandAvailable {
    param([Parameter(Mandatory = $true)][string]$Name)

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' is not installed or not in PATH."
    }
}

function Get-PrimaryIPv4 {
    $route = Get-NetRoute -DestinationPrefix '0.0.0.0/0' -ErrorAction SilentlyContinue |
        Sort-Object RouteMetric, InterfaceMetric |
        Select-Object -First 1

    if (-not $route) {
        return $null
    }

    $ip = Get-NetIPAddress -AddressFamily IPv4 -InterfaceIndex $route.InterfaceIndex -ErrorAction SilentlyContinue |
        Where-Object {
            $_.IPAddress -notlike '169.254.*' -and
            $_.IPAddress -ne '127.0.0.1'
        } |
        Select-Object -First 1

    return $ip.IPAddress
}

function Get-AdbOnlineDevices {
    $lines = adb devices
    return $lines |
        Select-Object -Skip 1 |
        Where-Object { $_ -match '\sdevice$' } |
        ForEach-Object { ($_ -split '\s+')[0] }
}

function Get-AdbConnectEndpoint {
    $lines = adb mdns services
    foreach ($line in $lines) {
        if ($line -match '_adb-tls-connect\._tcp\s+([0-9]{1,3}(?:\.[0-9]{1,3}){3}:[0-9]+)') {
            return $matches[1]
        }
    }
    return $null
}

Write-Host '== DevDocs Wireless Run ==' -ForegroundColor Cyan

Test-CommandAvailable -Name 'adb'
Test-CommandAvailable -Name 'flutter'

if (-not $SkipPair) {
    if (-not $PairEndpoint) {
        $PairEndpoint = Read-Host 'Enter wireless pairing endpoint (example: 192.168.137.10:37281)'
    }

    if (-not $PairCode) {
        $PairCode = Read-Host 'Enter 6-digit pairing code from phone'
    }

    Write-Host "Pairing with $PairEndpoint ..." -ForegroundColor Yellow
    & adb pair $PairEndpoint $PairCode
}

if (-not $SkipConnect) {
    if (-not $ConnectEndpoint) {
        $ConnectEndpoint = Get-AdbConnectEndpoint
        if ($ConnectEndpoint) {
            Write-Host "Auto-discovered debug endpoint: $ConnectEndpoint" -ForegroundColor DarkYellow
        } else {
            $ConnectEndpoint = Read-Host 'Enter debug endpoint from phone (example: 192.168.137.10:40665)'
        }
    }

    Write-Host "Connecting to $ConnectEndpoint ..." -ForegroundColor Yellow
    & adb connect $ConnectEndpoint
}

if (-not $DeviceId) {
    $devices = Get-AdbOnlineDevices
    if ((-not $devices -or $devices.Count -eq 0) -and $SkipConnect) {
        $autoEndpoint = Get-AdbConnectEndpoint
        if ($autoEndpoint) {
            Write-Host "No active device found. Auto-connecting to $autoEndpoint ..." -ForegroundColor DarkYellow
            & adb connect $autoEndpoint
            $devices = Get-AdbOnlineDevices
        }
    }

    if (-not $devices -or $devices.Count -eq 0) {
        throw 'No online adb devices found. Ensure wireless debugging is connected.'
    }

    $DeviceId = $devices[0]
}

if (-not $BackendHost) {
    $BackendHost = Get-PrimaryIPv4
}

if (-not $BackendHost) {
    throw 'Could not auto-detect backend host IP. Pass -BackendHost explicitly.'
}

$apiUrl = "http://$BackendHost`:$BackendPort/api"

Write-Host "Using device: $DeviceId" -ForegroundColor Green
Write-Host "Backend host: $BackendHost" -ForegroundColor Green
Write-Host "Backend API : $apiUrl" -ForegroundColor Green
Write-Host 'Tip: Make sure backend is already running on 0.0.0.0:8000 and firewall allows TCP 8000.' -ForegroundColor DarkYellow

$flutterArgs = @('run', '-d', $DeviceId)
if ($UseApiBaseUrl) {
    $flutterArgs += @('--dart-define', "API_BASE_URL=$apiUrl")
} else {
    $flutterArgs += @('--dart-define', "API_LOCAL_HOST=$BackendHost")
}

Write-Host "Running: flutter $($flutterArgs -join ' ')" -ForegroundColor Cyan
& flutter @flutterArgs
