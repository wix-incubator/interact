#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

RESULTS_DIR="$SCRIPT_DIR/results"
CATEGORIES=(click hover viewenter viewprogress pointermove integration)
VARIANTS=(with-rules no-context)

BOLD='\033[1m'
DIM='\033[2m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
RESET='\033[0m'

step=0
total_steps=5
step() {
  step=$((step + 1))
  echo ""
  echo -e "${BOLD}[$step/$total_steps] $1${RESET}"
  echo ""
}

# ──────────────────────────────────────────────────────────────────────
step "Installing dependencies"
# ──────────────────────────────────────────────────────────────────────

if ! node -e "require('yaml')" 2>/dev/null; then
  echo -e "${DIM}Running yarn install from repo root...${RESET}"
  (cd "$(git rev-parse --show-toplevel)" && yarn install)
else
  echo -e "${DIM}Dependencies available, skipping install.${RESET}"
fi

# ──────────────────────────────────────────────────────────────────────
step "Generating batch prompt files"
# ──────────────────────────────────────────────────────────────────────

for variant in "${VARIANTS[@]}"; do
  node scripts/cursor-batch.js "$variant"
done

echo ""
echo -e "${GREEN}Generated prompt files in results/${RESET}"

# ──────────────────────────────────────────────────────────────────────
step "Collecting LLM responses via Cursor"
# ──────────────────────────────────────────────────────────────────────

echo -e "For each prompt file below, you need to:"
echo -e "  ${CYAN}1.${RESET} Copy the file content to clipboard"
echo -e "  ${CYAN}2.${RESET} Open a ${BOLD}new Cursor chat${RESET} and paste it"
echo -e "  ${CYAN}3.${RESET} Wait for the full response"
echo -e "  ${CYAN}4.${RESET} Copy the ${BOLD}entire${RESET} response and save it to the response file"
echo ""
echo -e "${DIM}Tip: You can open multiple Cursor chats in parallel to speed this up.${RESET}"
echo ""

pending=()
for variant in "${VARIANTS[@]}"; do
  for category in "${CATEGORIES[@]}"; do
    prompt_file="$RESULTS_DIR/cursor-batch-${variant}-${category}.md"
    response_file="$RESULTS_DIR/cursor-batch-${variant}-${category}-response.md"

    if [ ! -f "$prompt_file" ]; then
      continue
    fi

    if [ -f "$response_file" ] && [ -s "$response_file" ]; then
      echo -e "  ${GREEN}✓${RESET} ${variant}/${category} — response already exists, skipping"
      continue
    fi

    pending+=("${variant}|${category}")
  done
done

if [ ${#pending[@]} -eq 0 ]; then
  echo -e "${GREEN}All responses already collected! Skipping to scoring.${RESET}"
else
  echo -e "${YELLOW}${#pending[@]} prompt(s) still need responses:${RESET}"
  echo ""

  for entry in "${pending[@]}"; do
    IFS='|' read -r variant category <<< "$entry"
    prompt_file="cursor-batch-${variant}-${category}.md"
    response_file="cursor-batch-${variant}-${category}-response.md"
    echo -e "  ${BOLD}${variant}/${category}${RESET}"
    echo -e "    Prompt:   ${CYAN}results/${prompt_file}${RESET}"
    echo -e "    Save to:  ${CYAN}results/${response_file}${RESET}"
    echo ""
  done

  echo -e "${BOLD}How to do this quickly:${RESET}"
  echo ""
  echo "  For each pending prompt above, run in a separate terminal:"
  echo ""
  echo -e "    ${DIM}# Copy prompt to clipboard (macOS)${RESET}"
  echo -e "    cat results/<prompt-file> | pbcopy"
  echo ""
  echo -e "    ${DIM}# Paste into Cursor chat, get response, then save it:${RESET}"
  echo -e "    pbpaste > results/<response-file>"
  echo ""

  echo -e "${YELLOW}Press Enter when all responses are saved...${RESET}"
  read -r

  # Verify all responses exist
  missing=0
  for entry in "${pending[@]}"; do
    IFS='|' read -r variant category <<< "$entry"
    response_file="$RESULTS_DIR/cursor-batch-${variant}-${category}-response.md"
    if [ ! -f "$response_file" ] || [ ! -s "$response_file" ]; then
      echo -e "  ${RED}✗${RESET} Missing: results/cursor-batch-${variant}-${category}-response.md"
      missing=$((missing + 1))
    else
      echo -e "  ${GREEN}✓${RESET} Found: results/cursor-batch-${variant}-${category}-response.md"
    fi
  done

  if [ $missing -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}Warning: $missing response(s) missing. Scoring will be partial.${RESET}"
    echo -e "Press Enter to continue anyway, or Ctrl+C to abort..."
    read -r
  fi
fi

# ──────────────────────────────────────────────────────────────────────
step "Parsing responses into individual outputs"
# ──────────────────────────────────────────────────────────────────────

for variant in "${VARIANTS[@]}"; do
  echo -e "${CYAN}Parsing ${variant}...${RESET}"
  node scripts/parse-cursor-response.js "$variant" || true
done

# ──────────────────────────────────────────────────────────────────────
step "Scoring outputs"
# ──────────────────────────────────────────────────────────────────────

node scripts/score-outputs.js

echo ""
echo -e "${GREEN}${BOLD}Done!${RESET}"
echo -e "Detailed scores: ${CYAN}results/scores.json${RESET}"
