---
paths:
  - "api/**/*.ts"
  - "api/prisma/**"
---

# 코딩 컨벤션

## NestJS 레이어 책임

| 레이어 | 책임 | 금지 |
|--------|------|------|
| Controller | 라우팅, DTO 변환, Service 호출 | 비즈니스 로직 |
| Service | 비즈니스 로직, Repository 호출 | Prisma 직접 호출 |
| Repository | Prisma 쿼리만 | 비즈니스 로직 |

## 도메인 파일 구조

```
domains/[name]/
├── [name].module.ts
├── [name].controller.ts
├── [name].service.ts
├── [name].repository.ts
└── dto/
    ├── create-[name].dto.ts
    ├── update-[name].dto.ts      # PartialType(CreateDto)
    └── [name]-response.dto.ts
```

## 규칙

- DTO는 `class-validator` 데코레이터 필수
- `UpdateDto`는 `PartialType(CreateDto)` 상속
- 새 도메인은 `app.module.ts` imports에 추가
- DB 변경은 `/add-migration` 스킬 사용

## SM-2 알고리즘

위치: `api/src/core/algorithms/sm2.ts`
자기평가: `0=again` / `3=hard` / `5=good`
