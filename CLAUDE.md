# MyMemory

DevOps 학습 카드 복습 앱. 책/실습에서 배운 Linux·Docker·K8s 개념을 기록하고 간격 반복(SM-2)으로 복습 일정을 자동 관리한다.

## 참조

- @.claude/rules/architecture.md
- @.claude/rules/conventions.md
- @.claude/rules/commit-rules.md

## 환경 실행

```bash
cp .env.example .env          # 서버 IP 등 입력
docker compose up -d --build
docker compose exec api npx prisma migrate dev --name init  # 최초 1회
```

## 스킬

| 스킬 | 설명 |
|------|------|
| `/new-domain [name]` | NestJS 도메인 스캐폴딩 (서브에이전트) |
| `/save-concept` | 학습 카드 저장 |
| `/add-migration [desc]` | Prisma 마이그레이션 |
| `/deploy` | 서버 배포 가이드 |
| `/git-flow` | 커밋 · 푸시 워크플로우 |

**커밋은 반드시 `/git-flow` 를 사용한다.**

## 도메인 상태

| 도메인 | 상태 | 설명 |
|--------|------|------|
| cards | ✅ | 카드 CRUD |
| reviews | ✅ | SM-2 복습 세션 |
