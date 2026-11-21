#!/usr/bin/env bash
# Tam Paket v1.1 — 37 skill, ağsız kurulum. Bash 3.2+ / macOS, Linux, WSL.
# ./install.sh [--tam|--hafif] [--target claude|codex|all] [--dest KLASOR] [--liste] [--force]
# --force mevcut dosyayı silmez; .tam-paket-backups altında yedekler.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd -P)"
MODE=tam; TARGET=claude; DEST_OVERRIDE="${CLAUDE_SKILLS_DIR:-}"; LIST=0; FORCE=0
while [ "$#" -gt 0 ]; do
  case "$1" in
    --tam) MODE=tam;;
    --hafif) MODE=hafif;;
    --liste) LIST=1;;
    --force) FORCE=1;;
    --target|--dest)
      [ "$#" -ge 2 ] && [ -n "$2" ] || { echo "Eksik seçenek değeri: $1" >&2; exit 2; }
      if [ "$1" = --target ]; then TARGET="$2"; else DEST_OVERRIDE="$2"; fi
      shift;;
    -h|--help) sed -n '2,4p' "$0"; exit 0;;
    *) echo "Bilinmeyen seçenek: $1" >&2; exit 2;;
  esac
  shift
done
case "$TARGET" in claude|codex|all) ;; *) echo "Hedef claude, codex veya all olmalı" >&2; exit 2;; esac
if [ -n "$DEST_OVERRIDE" ] && [ "$TARGET" != claude ]; then
  echo "--dest / CLAUDE_SKILLS_DIR yalnızca --target claude ile kullanılabilir" >&2; exit 2
fi
SKILLS=()
for folder in "$HERE"/skills/*/; do
  [ -f "$folder/SKILL.md" ] || continue
  name="$(basename "$folder")"
  if [ "$MODE" = hafif ] && ! grep -Fxq "$name" "$HERE/CORE_SKILLS.txt"; then continue; fi
  SKILLS+=("$name")
done
[ "${#SKILLS[@]}" -gt 0 ] || { echo "Paket içinde skill bulunamadı" >&2; exit 1; }
if [ "$LIST" = 1 ]; then
  printf '%s\n' "${SKILLS[@]}"
  echo "Toplam: ${#SKILLS[@]} — hedef: $TARGET — mod: $MODE"
  exit 0
fi
# Hash kontrolü içerik bütünlüğü içindir; güvenlik garantisi değildir.
if command -v shasum >/dev/null 2>&1; then
  (cd "$HERE" && shasum -a 256 -c SHA256SUMS >/dev/null)
elif command -v sha256sum >/dev/null 2>&1; then
  (cd "$HERE" && sha256sum -c SHA256SUMS >/dev/null)
else
  echo "Bütünlük kontrolü için shasum veya sha256sum gerekli" >&2; exit 1
fi
if find "$HERE/skills" -type l -print | grep -q .; then
  echo "Kaynak skill klasöründe beklenmeyen sembolik bağlantı var" >&2; exit 1
fi
install_to() {
  local requested="$1" dest name folder stage backup installed=0 skipped=0
  case "$requested" in ''|/|"$HOME"|"$HERE") echo "Güvensiz hedef klasör" >&2; return 1;; esac
  mkdir -p "$requested"
  dest="$(cd "$requested" && pwd -P)"
  case "$dest" in /|"$HOME"|"$HERE"|"$HERE"/*) echo "Hedef paket/kullanıcı kökü olamaz" >&2; return 1;; esac
  for name in "${SKILLS[@]}"; do
    folder="$HERE/skills/$name"
    if { [ -e "$dest/$name" ] || [ -L "$dest/$name" ]; } && [ "$FORCE" = 0 ]; then
      echo "atlandı (zaten var): $name"; skipped=$((skipped+1)); continue
    fi
    stage="$(mktemp -d "$dest/.tam-paket-stage.XXXXXX")"
    cp -R "$folder" "$stage/skill"
    if [ -e "$dest/$name" ] || [ -L "$dest/$name" ]; then
      mkdir -p "$dest/.tam-paket-backups"
      backup="$(mktemp -d "$dest/.tam-paket-backups/$name.XXXXXX")"
      mv "$dest/$name" "$backup/original"
      echo "yedeklendi: $backup/original"
    fi
    mv "$stage/skill" "$dest/$name"
    rmdir "$stage"
    installed=$((installed+1))
  done
  echo "$installed kuruldu, $skipped korundu → $dest"
}
case "$TARGET" in
  claude) install_to "${DEST_OVERRIDE:-$HOME/.claude/skills}";;
  codex) install_to "${CODEX_HOME:-$HOME/.codex}/skills";;
  all) install_to "$HOME/.claude/skills"; install_to "${CODEX_HOME:-$HOME/.codex}/skills";;
esac
echo "Bitti. Claude Code/Codex yeni oturumda becerileri keşfeder."
echo "Yalnızca skill dosyaları kuruldu; harici uygulama, model, eklenti veya hook kurulmadı."
