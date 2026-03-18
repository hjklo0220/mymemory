---
description: 지금 공부한 개념을 학습 카드로 저장한다
---

## 사용 방법

자유롭게 개념을 설명한다. 형식이 없어도 된다.

## 실행 절차

1. 사용자 입력을 카드 형식으로 정리한다:
   - `title`: 복습 시 "이게 뭐였지?" 하고 떠올릴 **질문 형태** (예: "kubectl rollout undo는 무엇인가?")
   - `body`: 마크다운, 명령어는 코드블록
   - `tag`: `linux` / `docker` / `k8s` / `general` 중 하나
   - `source`: 출처 (선택)

2. 정리된 내용을 사용자에게 확인받는다

3. API에 저장한다:
   ```bash
   curl -s -X POST "${API_URL:-http://localhost:3001}/cards" \
     -H "Content-Type: application/json" \
     -d '{"title":"...","body":"...","tag":"...","source":"..."}'
   ```

4. 저장 성공 시 카드 ID와 다음 복습일을 알린다

## 원칙

- 한 번에 **한 개념만** 저장 (마이크로러닝)
- 너무 긴 body는 핵심만 추려서 정리
