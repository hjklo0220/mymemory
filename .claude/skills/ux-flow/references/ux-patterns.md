# UX 패턴 카탈로그

이 앱에서 반복적으로 사용하는 학습 UX 패턴을 정의한다.
새 UX 플로우 설계 시 기존 패턴을 먼저 확인하고 재사용한다.

## 패턴 목록

### Pattern A: Inline Hint
**언제**: 복습 세션 중 카드 평가 직후
**조건**: 평가 = good AND deepdive 카드 존재
**동작**: 카드 하단에 작은 힌트 + 진입 버튼 표시
**흐름 끊김**: 최소 (선택적, 강제 아님)
**학습 근거**: Retrieval + Elaboration 조합 — 인출 성공 직후가 연결 학습 최적 시점

```
[good 평가]
     ↓
"💡 [연결 설명 한 줄]"  [카드 제목 →] 버튼
     ↓
탭 → 현재 세션에 카드 삽입
무시 → 다음 카드로
```

---

### Pattern B: Session End Summary
**언제**: 복습 세션 완료 직후
**조건**: 세션 내 good 평가 카드 중 deepdive 카드 있는 것
**동작**: 세션 요약 화면에서 심화 탐색 가능 카드 목록 노출
**흐름 끊김**: 없음 (세션 후 별도 화면)
**학습 근거**: 세션 후 default mode가 개념 통합에 유리 (consolidation window)

```
[세션 완료 화면]
"오늘 학습 완료 ✓"
"심화 탐색 가능: N개"
[지금 탐색] [나중에]
     ↓
good 평가 카드들의 deepdive 목록
```

---

### Pattern C: Exploration Mode
**언제**: 복습 세션 외 별도 탐색
**조건**: good AND interval ≥ 7일 카드 (기억 안정화 완료)
**동작**: 카드 관계 그래프 또는 경로 트리 탐색
**흐름 끊김**: 없음 (별도 모드)
**학습 근거**: Interleaving — 안정화된 개념 간 관계 탐색이 discrimination 강화

```
탐색 탭 →
[커널] → [시스템 콜] → [인터럽트]
            ↘ [컨텍스트 스위치]
```

---

## 게이팅 조건 (공통)

deepdive를 절대 제안하지 않는 상황:
- 평가 = `again` (기본 개념 불안정)
- `interval < 1일` (기억 형성 중)
- deepdive 카드가 없는 경우

deepdive를 소극적으로 제안하는 상황:
- 평가 = `hard`
- `1일 ≤ interval < 3일`

deepdive를 적극적으로 제안하는 상황:
- 평가 = `good`
- `interval ≥ 3일`

## 구현 우선순위

```
Phase 1: Pattern A (FlashCard 컴포넌트)
  → 가장 임팩트 큰 위치, 구현 범위 작음

Phase 2: Pattern B (리뷰 세션 완료 화면)
  → 흐름 방해 없이 심화 유도

Phase 3: Pattern C (별도 탐색 탭/페이지)
  → 고급 사용자 대상, 관계 그래프 시각화
```
