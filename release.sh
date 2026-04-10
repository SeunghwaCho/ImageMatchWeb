#!/bin/bash

RELEASE_DIR="release"

# Clean previous release
rm -rf "$RELEASE_DIR"

# Build
echo "Building..."
npm run build
if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

# Create release folder
echo "Creating release folder..."
mkdir -p "$RELEASE_DIR/assets"

cp index.html "$RELEASE_DIR/"
cp dist/bundle.js "$RELEASE_DIR/"
cp -r assets/blocks "$RELEASE_DIR/assets/"
cp -r assets/buttons "$RELEASE_DIR/assets/"

# Update script path in release index.html (dist/bundle.js -> bundle.js)
sed -i 's|dist/bundle.js|bundle.js|' "$RELEASE_DIR/index.html"

echo "Release folder created: $RELEASE_DIR/"
echo "Files:"
find "$RELEASE_DIR" -type f | sort
