#!/usr/bin/env bash
set -euo pipefail

BUILD_DIR="${1:-dist}"

test -d "$BUILD_DIR" || {
  echo "Build directory not found: $BUILD_DIR" >&2
  exit 1
}

echo "Inspecting build output: $BUILD_DIR"

fail=0

matches="$(find "$BUILD_DIR" \( \
    -iname '*docs-dev*' -o \
    -iname '*.env*' -o \
    -iname '*prompt_*_guide*' -o \
    -iname 'AGENTS.md' -o \
    -iname 'CLAUDE.md' \
  \) -print)"
prompt_matches="$(find "$BUILD_DIR" -regextype posix-extended \
    -regex '.*/[0-9]{3}_[^/]+\.md' \
    -print)"
if [[ -n "$matches" || -n "$prompt_matches" ]]; then
  printf 'Potential private files found in build output:\n%s\n%s\n' "$matches" "$prompt_matches" >&2
  fail=1
fi

maps="$(find "$BUILD_DIR" -type f -name '*.map' -print)"
if [[ -n "$maps" ]]; then
  printf 'Source maps found in build output and may leak source:\n%s\n' "$maps" >&2
  fail=1
fi

refs="$(find "$BUILD_DIR" -type f ! -name '*.map' \
    -exec grep -EIl \
      'docs-dev|prompt_authoring_guide|prompt_execution_guide|prompt_iteration_guide' \
      {} + || true)"
if [[ -n "$refs" ]]; then
  printf 'Potential private workflow references inside build files:\n%s\n' "$refs" >&2
  fail=1
fi

if [[ "$fail" -ne 0 ]]; then
  exit 1
fi

echo "Public build check completed."
