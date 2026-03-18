---
description: Prisma 스키마를 변경하고 마이그레이션을 안내한다. db-migrator 에이전트에서 처리한다
context: fork
agent: db-migrator
---

## 인자

`$ARGUMENTS` = 마이그레이션 설명 (snake_case, 예: `add_source_to_cards`)

## 실행 내용

`db-migrator` 에이전트가 아래를 처리한다:

1. `api/prisma/schema.prisma` 분석
2. 요청된 스키마 변경 적용
3. Breaking change 여부 확인 및 보고
4. 실행할 migrate 명령어 안내

## 마이그레이션 실행 (사용자가 직접)

에이전트 완료 후 사용자가 실행:
```bash
docker compose exec api npx prisma migrate dev --name $ARGUMENTS
```

## 프로덕션 배포 시

```bash
docker compose exec api npx prisma migrate deploy
```
