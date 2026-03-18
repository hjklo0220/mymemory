# 예시: 딥다이브 UX 플로우

`/ux-flow 딥다이브 카드 진입 흐름` 실행 결과 예시.
실제 리서치 결과는 매번 다를 수 있다.

---

## UX 플로우: 딥다이브 카드 진입 흐름

### 과학적 근거

**Retrieval + Elaboration (Pyc & Rawson, 2010)**
인출에 성공한 직후 "왜?"를 연결하면 두 기억이 함께 강화된다.
→ `good` 평가 직후가 deepdive 제안 최적 타이밍

**Accessibility Principle (Bjork)**
기억이 불안정할 때 심화를 올리면 인지 과부하만 생긴다.
→ `again` 직후 deepdive 제안 금지

**Desirable Difficulty**
`good` 후 "이걸 왜 쓰는가?"를 묻는 것이 딱 적절한 난이도 도전.
→ `interval ≥ 3일` 이후부터 게이팅

---

### 플로우 설계

```
복습 세션 중 카드 평가

  [again]
    → deepdive ❌
    → 카드 재큐 + 현재 카드 하단에 "왜 이게 답인지" 한 줄 표시

  [hard]
    → deepdive 🔶 세션 끝 배너만
    → "이 카드 관련 심화가 있습니다" (비강제)

  [good] + interval < 3일
    → deepdive 🔶 세션 끝 배너
    → 아직 기억 초기 단계

  [good] + interval ≥ 3일 + deepdive 존재
    → deepdive ✅ 인라인 즉각 제안 (Pattern A)
    → 카드 평가 직후 힌트 표시
```

**Pattern A 화면 상세:**
```
┌─────────────────────────────────┐
│  커널이란 무엇인가?    [linux]  │
├─────────────────────────────────┤
│  [본문 내용...]                 │
│                                 │
│  💡 커널은 시스템 콜로          │
│     하드웨어를 추상화합니다     │
│     [시스템 콜이란? →]         │
└─────────────────────────────────┘
[again]  [hard]  [good]
```

---

### 단계별 구현 플랜

**Phase 1 — Pattern A: FlashCard Inline Hint**
- 영향 범위: `web/src/features/review/components/FlashCard.tsx`
- 추가 API: `GET /cards/:id/relations` (이미 존재)
- 완료 조건: good 평가 후 deepdive 있으면 힌트 표시, 탭 시 세션에 삽입

**Phase 2 — Pattern B: Session End Summary**
- 영향 범위: 리뷰 세션 완료 화면 (신규 컴포넌트)
- 추가 API: 없음
- 완료 조건: 세션 완료 시 good 평가 카드의 deepdive 목록 표시

**Phase 3 — Pattern C: Exploration Tab**
- 영향 범위: 신규 `/explore` 페이지
- 추가 API: 필요시 필터링 파라미터 추가
- 완료 조건: interval ≥ 7일 카드들의 관계 트리 시각화

---

### 설계 원칙

1. **아는 것 위에 "왜?"를 쌓는다** — 불안정한 기억에 심화를 올리지 않는다
2. **흐름을 끊지 않는다** — 제안은 선택적, 강제 진입 없음
3. **기억 안정성 기반 게이팅** — SM-2 데이터로 타이밍을 자동 결정한다
