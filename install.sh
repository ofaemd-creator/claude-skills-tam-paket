#!/usr/bin/env bash
# Claude Skills — Tam Paket kurulumu
# Kullanım:
#   ./install.sh            # pakette gelen 25 skill'i kurar
#   ./install.sh --tam      # + Imbad0202/academic-research-skills (sabit commit) bağlantıları
#   ./install.sh --liste    # kurulacakları gösterir, hiçbir şey yazmaz
#   ./install.sh --force    # aynı adla kurulu skill'in üzerine yazar
# Hedef klasör: CLAUDE_SKILLS_DIR (varsayılan ~/.claude/skills).
# Bu betik hiçbir dış script, npm/pip kurulumu ya da Claude Code kancası (hook) çalıştırmaz:
# yalnızca dosya kopyalar, sabit bir git commit'i indirir ve bağlantı oluşturur.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
DEST="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
SRC_DIR="${CLAUDE_SKILL_SOURCES:-$HOME/.claude/skill-sources}"
IMBAD_REPO="https://github.com/Imbad0202/academic-research-skills.git"
IMBAD_SHA="00315dfea67cba974583debae32b77bdce659301"
IMBAD_SKILLS=(academic-paper academic-paper-reviewer academic-pipeline)

TAM=0; LISTE=0; FORCE=0
for a in "$@"; do
  case "$a" in
    --tam) TAM=1 ;; --liste) LISTE=1 ;; --force) FORCE=1 ;;
    -h|--help) sed -n '2,10p' "$0"; exit 0 ;;
    *) echo "Bilinmeyen seçenek: $a" >&2; exit 2 ;;
  esac
done

if [ "$LISTE" = 1 ]; then
  echo "Pakette gelen skill'ler → $DEST"; ls "$HERE/skills"
  echo; echo "--tam ile ayrıca (kaynak: $IMBAD_REPO @ ${IMBAD_SHA:0:7}):"; printf '%s\n' "${IMBAD_SKILLS[@]}"
  exit 0
fi

mkdir -p "$DEST"
kur=0; atla=0
for d in "$HERE"/skills/*/; do
  name="$(basename "$d")"
  [ -f "$d/SKILL.md" ] || continue
  if [ -e "$DEST/$name" ] && [ "$FORCE" = 0 ]; then
    echo "atlandı (zaten var): $name  — üzerine yazmak için --force"; atla=$((atla + 1)); continue
  fi
  rm -rf "${DEST:?}/$name"; cp -R "$d" "$DEST/$name"; kur=$((kur + 1))
done
echo "Pakettekiler: $kur kuruldu, $atla atlandı → $DEST"

if [ "$TAM" = 1 ]; then
  command -v git >/dev/null || { echo "git bulunamadı" >&2; exit 1; }
  repo="$SRC_DIR/academic-research-skills"
  if [ ! -d "$repo/.git" ]; then
    mkdir -p "$repo"; git -C "$repo" init -q; git -C "$repo" remote add origin "$IMBAD_REPO"
  fi
  # yalnızca sabitlenmiş commit indirilir; depo güncellenmişse bile aynı içerik kurulur
  git -C "$repo" fetch -q --depth 1 origin "$IMBAD_SHA"
  git -C "$repo" -c advice.detachedHead=false checkout -q "$IMBAD_SHA"
  for s in "${IMBAD_SKILLS[@]}"; do
    if [ -e "$DEST/$s" ] && [ "$FORCE" = 0 ]; then echo "atlandı (zaten var): $s"; continue; fi
    rm -rf "${DEST:?}/$s"; ln -s "$repo/$s" "$DEST/$s"; echo "bağlandı: $s"
  done
  echo "Not: bu deponun hooks/hooks.json kancaları bilerek ETKİNLEŞTİRİLMEDİ (eklenti olarak kurulmadı)."
fi

echo "Bitti. Claude Code'u yeniden başlatınca skill'ler görünür."
