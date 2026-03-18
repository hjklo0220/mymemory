---
description: 변경사항을 분석하여 Conventional Commits 규칙으로 분할 커밋하고 push한다
---

커밋 규칙: @.claude/rules/commit-rules.md

## 실행 절차

1. **변경사항 파악**
   ```bash
   git status
   git diff
   git diff --cached
   ```

2. **민감 파일 확인**
   `.env`, `.env.local` 등이 스테이징되어 있으면 즉시 제거 후 사용자에게 알린다.

3. **변경사항 그룹화**
   파일 위치 기준으로 논리적 단위로 묶는다:
   - `api/` → `feat(api):` / `fix(api):`
   - `web/` → `feat(web):` / `fix(web):`
   - `api/prisma/` → `chore(db):`
   - `.claude/` → `docs(claude):`
   - `docker-compose.yml`, `.env*` → `chore:`
   - `scripts/` → `feat(scripts):`

4. **그룹별 순차 커밋**
   ```bash
   git add [관련 파일들]
   git diff --cached  # 스테이징 내용 재확인
   git commit -m "type(scope): subject"
   ```

5. **Push 여부 확인**
   커밋 완료 후 사용자에게 push 여부를 묻는다:
   ```bash
   git push origin main
   ```
