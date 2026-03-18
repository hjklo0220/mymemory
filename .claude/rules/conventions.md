---
paths:
  - "api/**/*.ts"
  - "api/prisma/**"
---

# 코딩 컨벤션

## Hexagonal Architecture 레이어 구조

```
domains/[name]/
├── application/              # 유스케이스 레이어
│   └── [name].service.ts     # 비즈니스 로직, Port에만 의존
├── domain/                   # 순수 도메인 (외부 의존 없음)
│   ├── entities/
│   │   └── [name].entity.ts  # 도메인 타입 (Prisma 독립)
│   └── ports/
│       └── [name].repository.port.ts  # IRepository 인터페이스 + 토큰
├── infrastructure/           # 기술 구현 레이어
│   └── prisma-[name].repository.ts    # Prisma 구현체
├── presentation/             # 입출력 레이어
│   ├── [name].controller.ts  # 라우팅 + DTO 변환만
│   └── dto/
│       ├── create-[name].dto.ts
│       ├── update-[name].dto.ts   # PartialType(CreateDto)
│       └── [name]-response.dto.ts
└── [name].module.ts          # NestJS 조립, DI 바인딩
```

## 레이어별 책임

| 레이어 | 책임 | 금지 |
|--------|------|------|
| presentation | 라우팅, DTO 변환, Service 호출 | 비즈니스 로직 |
| application | 비즈니스 로직, Port 호출 | Prisma 직접 참조 |
| domain | Entity 타입, Repository Port 정의 | 외부 라이브러리 import |
| infrastructure | Prisma 쿼리 구현 | 비즈니스 로직 |

## 의존성 방향

```
presentation → application → domain (Port)
                                 ↑ implements
                          infrastructure
```

## DI 바인딩 패턴 (module.ts)

```typescript
providers: [
  [Name]Service,
  { provide: [NAME]_REPOSITORY, useClass: Prisma[Name]Repository },
]
```

## 규칙

- DTO는 `class-validator` 데코레이터 필수
- `UpdateDto`는 `PartialType(CreateDto)` 상속
- 새 도메인은 `app.module.ts` imports에 추가
- DB 변경은 `/add-migration` 스킬 사용

## SM-2 알고리즘

위치: `api/src/core/algorithms/sm2.ts`
자기평가: `0=again` / `3=hard` / `5=good`
