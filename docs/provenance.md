# 코드의 출처와 구조

`tailscale-lesson`의 `d751f39` 커밋에서 공용 재생기와 개발 설정을 분리해 만든 템플릿이다. 그 차시는 `gifted_children_lectures`의 단일 차시 설계와 원본 화면을 토대로 작성했다.

| 부분                     | 출처                                                                           |
| ------------------------ | ------------------------------------------------------------------------------ |
| 재생·탐색·발표           | `tailscale-lesson/src/player/`                                                 |
| 배치·퀴즈·코드           | `tailscale-lesson/src/components/`                                             |
| 차시 계약·저장·시간 계산 | `tailscale-lesson/src/domain/` 중 `lesson`, `storage`, `timeline`              |
| Tailwind 테마            | 원본 `web/src/styles/tokens.css`를 옮긴 `tailscale-lesson/src/styles/app.css`  |
| 제작 기준                | 원본 `.agents/skills/slide-principles`, `slide-naming`을 독립 차시에 맞게 정리 |
| 개발 검사·편집기·CI      | `tailscale-lesson`의 TypeScript·Oxlint·Prettier·Vite·GitHub Actions 설정       |

공용 화면과 컴포넌트, 타입·규칙, 스타일은 분리할 때 파일 단위로 동일하게 복사했다. Tailscale 수업 내용·출처·설치 명령·실습 파일·네트워크 모형은 포함하지 않는다. 예제는 ‘시간과 거리’이며 화면 검사도 해당 수업의 제목이나 개수에 의존하지 않도록 새로 작성했다.

`advance`, `phase`, `ease`의 원래 출처는 `gifted_children_lectures/web/src/domain/timeline.ts`다. 발표 화면은 원본 `CanvasFit.tsx`의 1280×720 맞춤 원리를 적용했다. 슬라이드 표현 기준은 원본 `web/docs/slide-design.md`와 `.agents/skills/slide-principles/SKILL.md`의 Mayer·Fiorella 인지 원리를 따랐다.

저장소 간 자동 동기화는 없다. 공용 UI를 고쳤다면 두 저장소의 위 파일을 비교하고, 각 수업에서 검사한 뒤 반영한다. 새 차시의 내용은 `src/lesson/`에 두어 공용 재생기 수정 없이 교체한다. 런타임 플러그인 설치·등록 체계는 현재 범위에 없다.
