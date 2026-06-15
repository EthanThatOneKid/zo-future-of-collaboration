#!/usr/bin/env bash
# Pulls the latest future-of-collaboration.zopack.md from the remote,
# extracts the /future-of-collaboration route code, and prints it
# ready to paste into the zo.space route editor (or pipe to the
# zopack import CLI).
#
# Usage:
#   ./scripts/sync-space.sh             # pull + extract, print to stdout
#   ./scripts/sync-space.sh --path      # print the path to the extracted .tsx
#
# The extraction is intentionally tiny (awk + sed) so it has zero deps
# and is safe to run from any sandbox that has the clone on disk.

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACK="$REPO_DIR/future-of-collaboration.zopack.md"
OUT="$(mktemp -t pack-route.XXXXXX.tsx)"

cd "$REPO_DIR"
# Keep git's chatter on stderr so stdout contains only the route code (or path).
git pull --ff-only >&2

# Extract the single route block from the `### \`/future-of-collaboration\`` header
# through EOF, stripping the surrounding ```tsx fence markers.
awk '/^### `\/future-of-collaboration`/,0' "$PACK" \
  | sed '1d;$d' \
  | sed '1d;$d' \
  | sed -e '1{/^```tsx$/d}' -e '${/^```$/d}' \
  > "$OUT"

LINES=$(wc -l < "$OUT")
BYTES=$(wc -c < "$OUT")

echo "# Extracted $LINES lines / $BYTES bytes from $PACK" >&2
echo "# Saved to: $OUT" >&2

if [[ "${1:-}" == "--path" ]]; then
  echo "$OUT"
else
  cat "$OUT"
fi
