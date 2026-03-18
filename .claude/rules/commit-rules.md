# 커밋 컨벤션

Conventional Commits 규격을 따른다. 커밋은 반드시 `/git-flow` 스킬을 사용한다.

## 형식

```
<type>(<scope>): <subject>
```

## Type

| type | 사용 시점 |
|------|-----------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 기능 변경 없는 코드 개선 |
| `docs` | 문서, 주석 |
| `chore` | 빌드, 설정, 의존성 |
| `test` | 테스트 |
| `style` | 포맷 등 로직 무관 |

## Scope

`api` · `web` · `db` · `scripts` · `ci` · `claude`

## 규칙

- 명령형 현재 시제: `add`, `fix`, `update`
- subject 50자 이내, 마침표 없음
- 논리적 단위로 분리 커밋 (한 커밋 = 한 변경 이유)
- Breaking change는 body에 `BREAKING CHANGE:` 명시
- `.env`, `.env.local` 절대 커밋 금지
