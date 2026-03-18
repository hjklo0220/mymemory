---
description: NestJS 도메인 모듈을 스캐폴딩한다. domain-scaffolder 에이전트에서 처리한다
context: fork
agent: domain-scaffolder
---

컨벤션: @.claude/rules/conventions.md

## 인자

`$ARGUMENTS` = 도메인 이름 (예: `tags`, `stats`, `auth`)

## 실행 내용

`domain-scaffolder` 에이전트가 아래를 처리한다:

1. `api/src/domains/$ARGUMENTS/` 파일 전체 생성
   - module, controller, service, repository
   - dto/create, dto/update (PartialType), dto/response
2. `api/src/app.module.ts` imports 배열에 모듈 등록

## 완료 후 메인 스레드에서 처리

- CLAUDE.md 도메인 상태 테이블 업데이트 (`🚧 구현 중`)
- Prisma 스키마 추가 필요 → `/add-migration` 스킬 사용 안내
