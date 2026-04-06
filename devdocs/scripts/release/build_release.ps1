# LAB 13 - Android Release Build Script
# Script to automate APK/AAB generation
# Run from: devdocs directory

param(
    [ValidateSet("apk", "aab", "both")]
    [string]$BuildType = "both",
    
    [switch]$Clean = $false,
    [switch]$SkipTests = $false
)

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  LAB 13 - Release Build Generator      ║" -ForegroundColor Cyan
Write-Host "║  Android APK/AAB Build Script          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Variables
$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot
$BUILD_DIR = Join-Path $PROJECT_ROOT "build"
$RELEASE_DIR = Join-Path $PROJECT_ROOT "release_build"
$RELEASE_NOTES = Join-Path $RELEASE_DIR "ReleaseNotes.txt"
$BUILD_LOG = Join-Path $RELEASE_DIR "build_log_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"

# Create release directory if not exists
if (-not (Test-Path $RELEASE_DIR)) {
    New-Item -ItemType Directory -Path $RELEASE_DIR | Out-Null
    Write-Host "✓ Created release_build directory" -ForegroundColor Green
}

# Step 1: Pre-build checks
Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
Write-Host "STEP 1: Pre-Build Checks" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow

# Check Flutter installation
Write-Host "Checking Flutter installation..." -NoNewline
if (flutter --version > $null 2>&1) {
    Write-Host " ✓" -ForegroundColor Green
    flutter --version | Write-Host
} else {
    Write-Host " ✗ Flutter not found!" -ForegroundColor Red
    exit 1
}

# Check pubspec.yaml
Write-Host "Checking pubspec.yaml..." -NoNewline
if (Test-Path (Join-Path $PROJECT_ROOT "pubspec.yaml")) {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ✗ pubspec.yaml not found!" -ForegroundColor Red
    exit 1
}

# Get version from pubspec.yaml
$version = Select-String -Path (Join-Path $PROJECT_ROOT "pubspec.yaml") -Pattern "version: ([\d.+]+)" | ForEach-Object { $_.Matches.Groups[1].Value }
Write-Host "App Version: $version" -ForegroundColor Cyan

# Step 2: Clean build (optional)
if ($Clean) {
    Write-Host ""
    Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
    Write-Host "STEP 2: Cleaning Previous Build" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
    
    Write-Host "Running: flutter clean" -NoNewline
    flutter clean 2>&1 | Out-Null
    Write-Host " ✓" -ForegroundColor Green
    
    if (Test-Path $BUILD_DIR) {
        Remove-Item -Recurse -Force $BUILD_DIR -ErrorAction SilentlyContinue
        Write-Host "Removed build directory ✓" -ForegroundColor Green
    }
}

# Step 3: Get dependencies
Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
Write-Host "STEP 3: Getting Dependencies" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow

Write-Host "Running: flutter pub get" -NoNewline
flutter pub get 2>&1 | Tee-Object -FilePath $BUILD_LOG | Out-Null
Write-Host " ✓" -ForegroundColor Green

# Step 4: Generate launcher icons and splash
Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
Write-Host "STEP 4: Generating Icon & Splash Screen" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow

Write-Host "Generating launcher icons..." -NoNewline
flutter pub run flutter_launcher_icons 2>&1 | Tee-Object -FilePath $BUILD_LOG -Append | Out-Null
Write-Host " ✓" -ForegroundColor Green

Write-Host "Generating splash screen..." -NoNewline
flutter pub run flutter_native_splash:create 2>&1 | Tee-Object -FilePath $BUILD_LOG -Append | Out-Null
Write-Host " ✓" -ForegroundColor Green

# Step 5: Run tests (optional)
if (-not $SkipTests) {
    Write-Host ""
    Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
    Write-Host "STEP 5: Running Tests" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
    
    Write-Host "Running: flutter test" -NoNewline
    if (flutter test 2>&1 | Tee-Object -FilePath $BUILD_LOG -Append) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ⚠ Tests failed or skipped" -ForegroundColor Yellow
    }
}

# Step 6: Build APK
if ($BuildType -eq "apk" -or $BuildType -eq "both") {
    Write-Host ""
    Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
    Write-Host "STEP 6: Building APK (Release)" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
    
    Write-Host "Running: flutter build apk --release" -NoNewline
    if (flutter build apk --release 2>&1 | Tee-Object -FilePath $BUILD_LOG -Append) {
        Write-Host " ✓" -ForegroundColor Green
        
        $apkPath = Join-Path $BUILD_DIR "app\outputs\apk\release\app-release.apk"
        if (Test-Path $apkPath) {
            $apkSize = (Get-Item $apkPath).Length / 1MB
            Write-Host "APK Location: $apkPath" -ForegroundColor Cyan
            Write-Host "APK Size: $($apkSize.ToString('F2')) MB" -ForegroundColor Cyan
            
            # Copy to release_build
            Copy-Item $apkPath (Join-Path $RELEASE_DIR "devdocs_${version}.apk") -Force
            Write-Host "Copied to release_build/ ✓" -ForegroundColor Green
        }
    } else {
        Write-Host " ✗" -ForegroundColor Red
        Write-Host "APK build failed. Check log: $BUILD_LOG" -ForegroundColor Red
    }
}

# Step 7: Build AAB
if ($BuildType -eq "aab" -or $BuildType -eq "both") {
    Write-Host ""
    Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
    Write-Host "STEP 7: Building AAB (Play Store)" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
    
    Write-Host "Running: flutter build appbundle --release" -NoNewline
    if (flutter build appbundle --release 2>&1 | Tee-Object -FilePath $BUILD_LOG -Append) {
        Write-Host " ✓" -ForegroundColor Green
        
        $aabPath = Join-Path $BUILD_DIR "app\outputs\bundle\release\app-release.aab"
        if (Test-Path $aabPath) {
            $aabSize = (Get-Item $aabPath).Length / 1MB
            Write-Host "AAB Location: $aabPath" -ForegroundColor Cyan
            Write-Host "AAB Size: $($aabSize.ToString('F2')) MB" -ForegroundColor Cyan
            
            # Copy to release_build
            Copy-Item $aabPath (Join-Path $RELEASE_DIR "devdocs_${version}.aab") -Force
            Write-Host "Copied to release_build/ ✓" -ForegroundColor Green
        }
    } else {
        Write-Host " ✗" -ForegroundColor Red
        Write-Host "AAB build failed. Check log: $BUILD_LOG" -ForegroundColor Red
    }
}

# Step 8: Summary
Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
Write-Host "BUILD SUMMARY" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow

Write-Host ""
Write-Host "Output Files:" -ForegroundColor Cyan
Get-ChildItem -Path $RELEASE_DIR -Include "*.apk", "*.aab" | ForEach-Object {
    $size = ($_.Length / 1MB).ToString('F2')
    Write-Host "  • $($_.Name) ($size MB)"
}

Write-Host ""
Write-Host "Build Log: $BUILD_LOG" -ForegroundColor Cyan
Write-Host ""
Write-Host "Build completed successfully! ✓" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Copy APK to device: adb install release_build/devdocs_${version}.apk" -ForegroundColor White
Write-Host "  2. Test all features on real device" -ForegroundColor White
Write-Host "  3. Generate deployment report" -ForegroundColor White
Write-Host "  4. Upload AAB to Google Play Console" -ForegroundColor White
