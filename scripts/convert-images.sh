#!/bin/bash
# Convert product images to WebP for R2 upload
# Requires: cwebp (libwebp) or ImageMagick (convert)
# Usage: bash scripts/convert-images.sh

set -e
SRC="anh"
DST="dist-images"

# Check for cwebp or convert
if command -v cwebp &>/dev/null; then
  CONVERT_CMD="cwebp"
elif command -v convert &>/dev/null; then
  CONVERT_CMD="imagemagick"
else
  echo "Error: install libwebp (cwebp) or ImageMagick (convert)" >&2
  exit 1
fi

webp() {
  local src="$1" dst="$2"
  mkdir -p "$(dirname "$dst")"
  if [ "$CONVERT_CMD" = "cwebp" ]; then
    cwebp -q 85 "$src" -o "$dst"
  else
    convert "$src" -quality 85 "$dst"
  fi
}

mkdir -p "$DST/products/tshirt"

# T-shirt colors
for color in blue black red white; do
  webp "$SRC/tshirt-${color}-front.jpg" "$DST/products/tshirt/${color}-front.webp"
  webp "$SRC/tshirt-${color}-back.jpg"  "$DST/products/tshirt/${color}-back.webp"
done

# Size chart
webp "$SRC/size-chart.jpg" "$DST/products/tshirt/size-chart.webp"

# Other products
webp "$SRC/tenugui.jpg"    "$DST/products/tenugui.webp"
webp "$SRC/secret.jpg"     "$DST/products/secret.webp"

# Hero koinobori
webp "$SRC/koinobori cover facebook.png" "$DST/hero-koinobori.webp"

echo "Done. WebP files in $DST/"
