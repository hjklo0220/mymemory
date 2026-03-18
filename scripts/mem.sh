#!/usr/bin/env bash
# 설치: sudo cp mem.sh /usr/local/bin/mem && sudo chmod +x /usr/local/bin/mem

set -euo pipefail

API_URL="${MEM_API_URL:-http://localhost:3001}"

# ── 색상 ───────────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# ── 도움말 ─────────────────────────────────────────────────────────────────────
usage() {
  cat <<EOF
사용법:
  mem "제목"
  mem "제목" [옵션]
  mem --today
  mem --help

옵션:
  -b, --body TEXT     카드 내용 (기본값: 빈 문자열)
  -t, --tag TAG       태그: linux|docker|k8s|general (기본값: general)
  -s, --source TEXT   출처
      --today         오늘 복습할 카드 수 표시
  -h, --help          도움말

예시:
  mem "kubectl rollout undo란?"
  mem "제목" -b "내용 설명" -t k8s -s "책 p.123"
  mem --today
EOF
}

# ── --today ────────────────────────────────────────────────────────────────────
cmd_today() {
  local response http_code body

  response=$(curl -s -w "\n%{http_code}" \
    -H "Content-Type: application/json" \
    "${API_URL}/cards/review/today" 2>&1) || {
    echo -e "${RED}✗ 서버 연결 실패: ${API_URL}${NC}" >&2
    exit 1
  }

  http_code=$(printf '%s' "$response" | tail -n1)
  body=$(printf '%s' "$response" | head -n -1)

  if [[ "$http_code" != "200" ]]; then
    echo -e "${RED}✗ 서버 오류 (HTTP ${http_code})${NC}" >&2
    echo "$body" >&2
    exit 1
  fi

  if command -v jq &>/dev/null; then
    local count
    count=$(printf '%s' "$body" | jq -r '.count // (.data | length) // . // "?"' 2>/dev/null || echo "?")
    echo -e "${YELLOW}오늘 복습할 카드: ${count}장${NC}"
  else
    echo "오늘 복습할 카드:"
    echo "$body"
  fi
}

# ── 카드 저장 ──────────────────────────────────────────────────────────────────
cmd_save() {
  local title="$1"
  local body=""
  local tag="general"
  local source=""

  shift
  while [[ $# -gt 0 ]]; do
    case "$1" in
      -b|--body)
        [[ -z "${2:-}" ]] && { echo -e "${RED}✗ --body 값이 없습니다.${NC}" >&2; exit 1; }
        body="$2"; shift 2 ;;
      -t|--tag)
        [[ -z "${2:-}" ]] && { echo -e "${RED}✗ --tag 값이 없습니다.${NC}" >&2; exit 1; }
        tag="$2"; shift 2 ;;
      -s|--source)
        [[ -z "${2:-}" ]] && { echo -e "${RED}✗ --source 값이 없습니다.${NC}" >&2; exit 1; }
        source="$2"; shift 2 ;;
      *)
        echo -e "${RED}✗ 알 수 없는 옵션: $1${NC}" >&2
        usage >&2
        exit 1 ;;
    esac
  done

  # JSON payload 조립 (jq 있으면 안전하게, 없으면 직접 조립)
  local payload
  if command -v jq &>/dev/null; then
    payload=$(jq -n \
      --arg title   "$title"  \
      --arg body    "$body"   \
      --arg tag     "$tag"    \
      --arg source  "$source" \
      '{title: $title, body: $body, tag: $tag, source: $source}')
  else
    # 수동 이스케이프 (작은따옴표·백슬래시 처리)
    _esc() { printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'; }
    payload="{\"title\":\"$(_esc "$title")\",\"body\":\"$(_esc "$body")\",\"tag\":\"$(_esc "$tag")\",\"source\":\"$(_esc "$source")\"}"
  fi

  local response http_code resp_body

  response=$(curl -s -w "\n%{http_code}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d "$payload" \
    "${API_URL}/cards" 2>&1) || {
    echo -e "${RED}✗ 서버 연결 실패: ${API_URL}${NC}" >&2
    exit 1
  }

  http_code=$(printf '%s' "$response" | tail -n1)
  resp_body=$(printf '%s' "$response" | head -n -1)

  if [[ "$http_code" != "200" && "$http_code" != "201" ]]; then
    echo -e "${RED}✗ 저장 실패 (HTTP ${http_code})${NC}" >&2
    echo "$resp_body" >&2
    exit 1
  fi

  if command -v jq &>/dev/null; then
    local next_review
    next_review=$(printf '%s' "$resp_body" | \
      jq -r '.nextReview // .next_review // .data.nextReview // .data.next_review // ""' 2>/dev/null || echo "")
    if [[ -n "$next_review" ]]; then
      echo -e "${GREEN}✓ 저장됨: ${title} (다음 복습: ${next_review})${NC}"
    else
      echo -e "${GREEN}✓ 저장됨: ${title}${NC}"
    fi
  else
    echo -e "${GREEN}✓ 저장됨: ${title}${NC}"
    echo "$resp_body"
  fi
}

# ── 진입점 ─────────────────────────────────────────────────────────────────────
main() {
  if [[ $# -eq 0 ]]; then
    usage
    exit 0
  fi

  case "$1" in
    --today)
      cmd_today ;;
    -h|--help)
      usage ;;
    -*)
      echo -e "${RED}✗ 알 수 없는 옵션: $1${NC}" >&2
      usage >&2
      exit 1 ;;
    *)
      cmd_save "$@" ;;
  esac
}

main "$@"
