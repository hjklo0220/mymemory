# 아키텍처

## 시스템 구조

```
web (Next.js PWA :3000)
        ↓ HTTP
api (NestJS :3001)
        ↓
postgres (PostgreSQL :5432)
```

- **api/** — 모든 비즈니스 로직. 모든 클라이언트(web, CLI, 스킬)는 API를 통한다
- **web/** — UI만. API 호출만 하는 thin layer
- **scripts/** — CLI 툴(mem.sh), 유틸리티

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| API | NestJS 10 + TypeScript |
| ORM | Prisma 5 |
| DB | PostgreSQL 16 |
| Web | Next.js 14 (App Router) + Tailwind CSS |
| 배포 | Docker Compose |

## API 내부 구조

```
api/src/
├── domains/          # 기능 도메인 (각 도메인은 독립)
├── core/
│   ├── algorithms/   # 순수 함수 (SM-2 등)
│   └── database/     # PrismaService (@Global)
└── app.module.ts
```

## 환경변수

| 변수 | 설명 |
|------|------|
| `API_URL` | 브라우저가 호출하는 공개 API 주소 |
| `DATABASE_URL` | PostgreSQL 연결 문자열 (docker 내부 통신) |
| `MEM_API_URL` | CLI(mem.sh)용 API 주소 |
