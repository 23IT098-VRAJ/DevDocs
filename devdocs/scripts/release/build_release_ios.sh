#!/bin/bash
# LAB 13 - iOS Release Build Script
# Script to automate IPA generation for iOS
# Run from: devdocs directory

set -e

echo "╔════════════════════════════════════════╗"
echo "║  LAB 13 - Release Build Generator      ║"
echo "║  iOS IPA Build Script                  ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Variables
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BUILD_DIR="$PROJECT_ROOT/build"
RELEASE_DIR="$PROJECT_ROOT/release_build"
BUILD_LOG="$RELEASE_DIR/ios_build_log_$(date +%Y%m%d_%H%M%S).txt"

# Create release directory if not exists
mkdir -p "$RELEASE_DIR"
echo "✓ Release build directory ready"

# Step 1: Pre-build checks
echo ""
echo "═══════════════════════════════════════"
echo "STEP 1: Pre-Build Checks"
echo "═══════════════════════════════════════"

# Check Flutter installation
echo -n "Checking Flutter installation... "
if flutter --version > /dev/null 2>&1; then
    echo "✓"
    flutter --version
else
    echo "✗ Flutter not found!"
    exit 1
fi

# Check Xcode
echo -n "Checking Xcode... "
if xcode-select -p > /dev/null 2>&1; then
    echo "✓"
else
    echo "✗ Xcode not found!"
    exit 1
fi

# Get version from pubspec.yaml
version=$(grep "^version:" "$PROJECT_ROOT/pubspec.yaml" | sed 's/version: //g')
echo "App Version: $version"

# Step 2: Get dependencies
echo ""
echo "═══════════════════════════════════════"
echo "STEP 2: Getting Dependencies"
echo "═══════════════════════════════════════"

echo -n "Running: flutter pub get... "
flutter pub get 2>&1 | tee -a "$BUILD_LOG" > /dev/null
echo "✓"

# Step 3: Generate launcher icons (iOS only)
echo ""
echo "═══════════════════════════════════════"
echo "STEP 3: Generating Icon & Splash"
echo "═══════════════════════════════════════"

echo -n "Generating launcher icons... "
flutter pub run flutter_launcher_icons 2>&1 | tee -a "$BUILD_LOG" > /dev/null
echo "✓"

echo -n "Generating splash screen... "
flutter pub run flutter_native_splash:create 2>&1 | tee -a "$BUILD_LOG" > /dev/null
echo "✓"

# Step 4: Build IPA
echo ""
echo "═══════════════════════════════════════"
echo "STEP 4: Building IPA (Release)"
echo "═══════════════════════════════════════"

echo "Running: flutter build ipa --release"
if flutter build ipa --release 2>&1 | tee -a "$BUILD_LOG"; then
    echo "✓ IPA build successful"
    
    IPA_PATH="$BUILD_DIR/ios/ipa/devdocs.ipa"
    if [ -f "$IPA_PATH" ]; then
        IPA_SIZE=$(du -h "$IPA_PATH" | cut -f1)
        echo "IPA Location: $IPA_PATH"
        echo "IPA Size: $IPA_SIZE"
        
        # Copy to release_build
        cp "$IPA_PATH" "$RELEASE_DIR/devdocs_${version}.ipa"
        echo "✓ Copied to release_build/"
    fi
else
    echo "✗ IPA build failed"
    exit 1
fi

# Step 5: Summary
echo ""
echo "═══════════════════════════════════════"
echo "BUILD SUMMARY"
echo "═══════════════════════════════════════"
echo ""
echo "Output Files:"
ls -lh "$RELEASE_DIR"/*.ipa 2>/dev/null || echo "  No IPA files found"

echo ""
echo "Build Log: $BUILD_LOG"
echo ""
echo "✓ iOS build completed successfully!"
echo ""
echo "Next Steps:"
echo "  1. Open Xcode: open ios/Runner.xcworkspace"
echo "  2. Archive and upload to TestFlight"
echo "  3. Or use: xcrun altool --upload-file --username apple_id"
echo ""
