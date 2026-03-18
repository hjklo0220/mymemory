# MyMemory — DevOps 학습 카드 복습 앱

## 목적
책/실습에서 배운 Linux, Docker, Kubernetes 개념을 기록하고
간격 반복(Spaced Repetition) 알고리즘으로 복습 일정을 자동 관리한다.
PC에서 기록 → 아이폰에서 복습하는 흐름이 핵심.

## 아키텍처

```
web (Next.js PWA :3000)
    ↓ HTTP
api (NestJS :3001)
    ↓
postgres (PostgreSQL :5432)
```

- **api/** : 모든 비즈니스 로직. 외부 클라이언트(web, CLI, 슬래시커맨드)는 전부 api를 통한다
- **web/** : UI만. API 호출만 하는 thin layer
- **scripts/** : CLI 툴 (mem.sh)
- **.claude/commands/** : Claude Code 슬래시 커맨드

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| API | NestJS + TypeScript |
| ORM | Prisma |
| DB | PostgreSQL 16 |
| Web | Next.js 14 (App Router) + Tailwind CSS |
| PWA | next-pwa |
| 배포 | Docker Compose (서버: 182.215.209.235) |

## API 도메인 구조 규칙

새 도메인 추가 시 **반드시** 이 구조를 따른다. `/new-domain [name]` 커맨드 사용.

```
api/src/domains/[name]/
├── [name].module.ts
├── [name].controller.ts   # 라우팅만, 로직 없음
├── [name].service.ts      # 비즈니스 로직
├── [name].repository.ts   # DB 접근만, Prisma 직접 호출
└── dto/
    ├── create-[name].dto.ts
    ├── update-[name].dto.ts
    └── [name]-response.dto.ts
```

규칙:
- Controller는 DTO 변환 + Service 호출만
- Service는 비즈니스 로직 + Repository 호출
- Repository는 Prisma 쿼리만, 비즈니스 로직 없음
- DTO에 class-validator 데코레이터 필수
- 새 도메인은 app.module.ts imports에 추가

## DB 변경 프로세스

```bash
# 1. prisma/schema.prisma 수정
# 2. 마이그레이션 생성
docker compose exec api npx prisma migrate dev --name [설명]
# 3. CLAUDE.md 스키마 변경 이력에 기록
```

## 개발 환경 실행

```bash
# 전체 실행
docker compose up -d

# 로그 확인
docker compose logs -f api
docker compose logs -f web

# DB 마이그레이션
docker compose exec api npx prisma migrate dev

# 재빌드
docker compose up -d --build [service]
```

## 슬래시 커맨드 목록

| 커맨드 | 역할 |
|--------|------|
| `/new-domain [name]` | NestJS 도메인 스캐폴딩 |
| `/save-concept` | 학습 카드 API 저장 |
| `/add-migration [desc]` | Prisma 마이그레이션 |
| `/deploy` | 서버 배포 |

## 현재 도메인 상태

| 도메인 | 상태 | 설명 |
|--------|------|------|
| cards | ✅ 구현됨 | 카드 CRUD |
| reviews | ✅ 구현됨 | SM-2 기반 복습 세션 |

## SM-2 알고리즘 요약

자기평가 3단계:
- `again(0)`: 모름 → interval=1, ease 감소
- `hard(3)`: 애매함 → interval × 1.2
- `good(5)`: 확실 → interval × easeFactor, ease 증가

구현: `api/src/core/algorithms/sm2.ts`

## 포트 정보

| 서비스 | 포트 |
|--------|------|
| web | 3000 |
| api | 3001 |
| postgres | 5432 |

## 작업 이력 / 다음 작업

### 완료
- [x] 프로젝트 skeleton + CLAUDE.md
- [x] docker-compose.yml
- [x] Prisma 스키마
- [x] .claude/commands/ 슬래시 커맨드
- [x] NestJS API (cards, reviews 도메인)
- [x] Next.js PWA (홈, 복습, 등록, 목록)
- [x] CLI (scripts/mem.sh)

### 다음 작업 후보
- [ ] 인증 (auth 도메인) - Bearer Token 방식
- [ ] 통계 (stats 도메인) - 복습 이력, 성취도
- [ ] 태그 관리 (tags 도메인)
- [ ] 실습 로그 연동 (미니PC에서 CLI로 자동 저장)
- [ ] 스트릭 기능
