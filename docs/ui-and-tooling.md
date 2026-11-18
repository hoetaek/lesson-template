# 원본 UI와 개발 설정

원본 수업 앱의 화면과 조작 방식을 유지하면서 독립 차시로 복사하기 쉽게 만든다. `tailscale-lesson`에서 검증한 공용 화면과 검사 설정을 그대로 가져오고 수업 내용만 작은 예제로 교체했다.

## UI 기준

비교 원본은 `gifted_children_lectures`의 `SlidesFrame`, `PlayStage`, `TimelineBar`와 Supabase 차시 내보내기 화면이다.

- 차례는 데스크톱에서 처음에 접히고, 사용자가 펼치거나 접은 선택을 기억한다. 모바일 차례는 본문 위에서 열린다.
- 전체 보기에서는 스크롤 위치를 차례에 표시한다. 스크롤만으로 주소나 뒤로 가기 기록을 늘리지 않는다.
- 한 장 보기와 발표 보기는 그림 → 가운데 자막 → 재생 조작과 장면 막대를 따른다.
- 이전·다음은 장면부터 이동하고, 경계에서는 앞뒤 슬라이드로 이어진다. 슬라이드 이동일 때는 종이 아이콘으로 구별한다.
- 현재 장면은 밑줄과 굵기로, 실습 장면은 갈색과 마름모로 표시한다. 실습 종류와 현재 위치를 색 하나에 맡기지 않는다.
- 배속 0.25×·0.5×·0.75×·1×·1.25×·1.5×·2×와 연속 재생을 지원한다. 실습·퀴즈는 연속 재생에서도 멈춘다.
- 발표는 1280×720 판을 전체 화면에 맞춘다. 발표 도구는 판 안에 두고 장면 막대에서 도구 폭을 비운다.
- 일반 보기의 실제 본문 폭이 1152px 미만이면 캔버스를 축소하지 않고 세로로 펼친다. 차례를 펼쳤을 때도 글·입력 요소가 지나치게 작아지지 않게 하기 위한 기준이다. 640px 이상에서는 SVG 그림을, 휴대폰에서는 세로 도식을 사용한다.

낭독 음원·보충 슬라이드·PDF 생성은 추가하지 않았다. 이번 범위는 원본에 가까운 공용 화면과 재생 조작, Tailwind 전환, 개발 검사다.

## Tailwind

[Tailwind 공식 Vite 플러그인](https://tailwindcss.com/docs/installation/using-vite)을 사용한다. CSS 진입점은 `src/styles/app.css` 하나다. 원본 색은 `@theme`의 이름으로 유지하며, 컴포넌트별 배치·여백·반응형·상태는 JSX 유틸리티로 표현한다. 기존의 큰 선택자 스타일시트와 별도 토큰 파일은 제거했다.

`canvas:`·`flowing:`·`presenting:` 변형은 창 폭과 실제 슬라이드 판의 폭을 혼동하지 않도록 구분한다. 재생 진행률과 캔버스 배율처럼 런타임에서 계산되는 값만 인라인 스타일로 전달한다.

## 검사 설정

| 명령                   | 역할                                                                        |
| ---------------------- | --------------------------------------------------------------------------- |
| `npm run typecheck`    | `strict`, `noUncheckedIndexedAccess`, 미사용 지역·인자 검사, 타입 출력 없음 |
| `npm run lint`         | Oxlint의 TypeScript·React Hooks·접근성·오류 규칙. 경고도 허용하지 않음      |
| `npm run lint:fix`     | 자동 수정 가능한 린트 수정                                                  |
| `npm run format`       | Prettier 정리와 Tailwind 클래스 정렬                                        |
| `npm run format:check` | 수정하지 않고 포맷 확인                                                     |
| `npm test`             | 순수 규칙 테스트                                                            |
| `npm run check`        | 위 타입·린트·포맷 확인·테스트를 차례로 실행                                 |
| `npm run capture`      | 모든 장면 화면·학습 기능·보기 전환 검사와 캡처                              |

Prettier는 [공식 Tailwind 플러그인](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)의 `tailwindStylesheet`로 테마를 읽는다. `.prettierignore`에서 의존성·생성물·로컬 기록·다운로드 자산을 제외한다.

[Oxlint 설정](https://oxc.rs/docs/guide/usage/linter/config.html)은 `.oxlintrc.json`에 둔다. 복합 도식의 `role="img"`와 동적 알림의 `role="status"`는 의미가 있으므로 태그 이름만으로 바꾸도록 요구하는 `prefer-tag-over-role` 규칙만 제외한다. Hooks 규칙과 의존성 검사, 명시적 `any` 금지는 유지한다.

`.editorconfig`와 `.vscode/`에 저장 시 포맷 및 권장 확장을 넣었다. GitHub Actions는 push·PR에서 `npm ci`, `npm run check`, `npm run build`를 실행한다. 워크플로 실행은 원격 저장소에 올린 뒤 확인해야 한다.

원본 `tailscale-lesson`에서 타입 오류, 조건부 Hook 호출, 포맷 위반을 임시 파일에 각각 넣어 세 검사가 실패하는 것도 확인했다. 이 템플릿은 같은 설정을 사용한다.
