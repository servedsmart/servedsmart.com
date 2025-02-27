#!/usr/bin/env bash
###
# File: pull-theme.sh
# Author: Served Smart (servedsmart@gmail.com)
# -----
# Copyright (c) 2025 Served Smart & contributors
# SPDX ID: MIT
# URL: https://opensource.org/licenses/MIT
# -----
###

# Set SCRIPT_DIR
SCRIPT_DIR="$(dirname -- "$(readlink -f -- "$0")")"

# Fail on error
set -e

# Clone and pull PaperMod theme; source: https://github.com/adityatelange/hugo-PaperMod/wiki/Installation#installingupdating-papermod
THEME_REPO="https://github.com/adityatelange/hugo-PaperMod.git"
THEME_NAME="PaperMod"
if [ -d "$SCRIPT_DIR"/themes/"$THEME_NAME" ]; then
    cd "$SCRIPT_DIR"/themes/"$THEME_NAME"
    git submodule update --remote
else
    git submodule add "$THEME_REPO" "$SCRIPT_DIR"/themes/"$THEME_NAME"
fi

# Set theme in hugo.toml
## START sed
FILE="$SCRIPT_DIR"/config/_default/hugo.toml
STRING="theme =.*"
if grep -q "$STRING" "$FILE"; then
    sed -i "s/$STRING/theme = '$THEME_NAME'/" "$FILE"
else
    echo "theme = '$THEME_NAME'" >>"$FILE"
fi
## END sed

