#!/usr/bin/env bash
set -euo pipefail

REPO="moru-ai/sdks"
INSTALL_DIR=""
VERSION=""

usage() {
  cat <<'EOF'
Usage: install.sh [--version vX.Y.Z] [--install-dir PATH]

Defaults:
  --version     latest release
  --install-dir ~/.local/bin (macOS/Linux)
                %LOCALAPPDATA%/moru/bin (Windows Git Bash)
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --version)
      VERSION="$2"
      shift 2
      ;;
    --install-dir)
      INSTALL_DIR="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$VERSION" ]]; then
  VERSION="$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
    | grep -E '"tag_name":' \
    | head -n 1 \
    | sed -E 's/.*"([^"]+)".*/\1/')"
fi

VERSION="${VERSION#v}"
TAG="v${VERSION}"

UNAME_S="$(uname -s)"
case "$UNAME_S" in
  Darwin) OS="darwin" ;;
  Linux) OS="linux" ;;
  MINGW*|MSYS*|CYGWIN*) OS="win" ;;
  *)
    echo "Unsupported OS: $UNAME_S" >&2
    exit 1
    ;;
esac

UNAME_M="$(uname -m)"
case "$UNAME_M" in
  x86_64|amd64) ARCH="x64" ;;
  arm64|aarch64) ARCH="arm64" ;;
  *)
    echo "Unsupported architecture: $UNAME_M" >&2
    exit 1
    ;;
esac

TARGET="${OS}-${ARCH}"
FILENAME="moru-${TAG}-${TARGET}"
if [[ "$OS" == "win" ]]; then
  FILENAME="${FILENAME}.exe"
fi

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

ASSET_URL="https://github.com/${REPO}/releases/download/${TAG}/${FILENAME}"
SUMS_URL="https://github.com/${REPO}/releases/download/${TAG}/SHA256SUMS"

curl -fsSL "$ASSET_URL" -o "$TMP_DIR/$FILENAME"
curl -fsSL "$SUMS_URL" -o "$TMP_DIR/SHA256SUMS"

EXPECTED_SUM="$(grep " ${FILENAME}$" "$TMP_DIR/SHA256SUMS" | awk '{print $1}')"
if [[ -z "$EXPECTED_SUM" ]]; then
  echo "Checksum not found for ${FILENAME}" >&2
  exit 1
fi

if command -v sha256sum >/dev/null 2>&1; then
  ACTUAL_SUM="$(sha256sum "$TMP_DIR/$FILENAME" | awk '{print $1}')"
elif command -v shasum >/dev/null 2>&1; then
  ACTUAL_SUM="$(shasum -a 256 "$TMP_DIR/$FILENAME" | awk '{print $1}')"
else
  echo "sha256sum or shasum is required to verify downloads." >&2
  exit 1
fi

if [[ "$EXPECTED_SUM" != "$ACTUAL_SUM" ]]; then
  echo "Checksum verification failed." >&2
  exit 1
fi

if [[ -z "$INSTALL_DIR" ]]; then
  if [[ "$OS" == "win" ]]; then
    INSTALL_DIR="${LOCALAPPDATA:-$HOME/AppData/Local}/moru/bin"
  else
    INSTALL_DIR="$HOME/.local/bin"
  fi
fi

mkdir -p "$INSTALL_DIR"
DEST="$INSTALL_DIR/moru"
if [[ "$OS" == "win" ]]; then
  DEST="$INSTALL_DIR/moru.exe"
fi

mv "$TMP_DIR/$FILENAME" "$DEST"
chmod +x "$DEST" || true

if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
  echo "moru installed to $DEST"
  echo "Add $INSTALL_DIR to your PATH to use it globally."
else
  echo "moru installed to $DEST"
fi
