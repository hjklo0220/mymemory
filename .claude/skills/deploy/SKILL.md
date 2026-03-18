---
description: 서버에 최신 코드를 배포한다
---

## 실행 절차

1. 미커밋 변경사항 있으면 `/git-flow` 먼저 실행
2. 배포 내용 요약 후 사용자 확인

3. 서버 배포 명령어 안내:

   ```bash
   ssh <user>@<server-ip>
   cd ~/mymemory
   git pull origin main
   docker compose up -d --build

   # 스키마 변경 있을 때만
   docker compose exec api npx prisma migrate deploy

   # 헬스체크
   curl http://localhost:3001/health
   ```

## 사전 체크리스트

- [ ] 서버에 `.env` 파일 존재 (`API_URL`, `DATABASE_URL` 설정됨)
- [ ] 포트 3000, 3001 포트포워딩 확인
- [ ] DB 마이그레이션 필요 여부

## 최초 배포 시

```bash
cp .env.example .env
# API_URL=http://<서버공개IP>:3001 으로 수정
```
