#!/bin/bash

BUILD_DIR="build"

# Clean previous build
rm -rf "$BUILD_DIR"

# Compile TypeScript and bundle
echo "Building..."
npm run build
if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

# Create deployable build folder
echo "Creating build folder..."
mkdir -p "$BUILD_DIR/assets"

cp index.html "$BUILD_DIR/"
cp dist/bundle.js "$BUILD_DIR/"
cp -r assets/blocks "$BUILD_DIR/assets/"
cp -r assets/buttons "$BUILD_DIR/assets/"

# Update script path in build index.html (dist/bundle.js -> bundle.js)
sed -i 's|dist/bundle.js|bundle.js|' "$BUILD_DIR/index.html"

echo "Build folder created: $BUILD_DIR/"
echo "Files:"
find "$BUILD_DIR" -type f | sort
