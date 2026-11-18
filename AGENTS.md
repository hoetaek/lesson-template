# 단일 차시 제작 지침

이 저장소에는 차시 하나만 둔다. 차시는 활동 → 슬라이드 → 장면으로 나눈다. 워크스페이스·강좌·반·학생 계정·원격 제어·서버 저장 모델을 추가하지 않는다.

## 작업 위치

- `src/lesson/lesson.ts`: 차시와 활동 순서.
- `src/lesson/activities/<활동 id>/index.ts`: 활동 정보와 슬라이드 순서.
- `src/lesson/activities/<활동 id>/<슬라이드 id>/slide.tsx`: 슬라이드·장면·자막. 전용 그림·조작은 같은 폴더에 둔다.
- `src/lesson/sources.ts`: 공식 출처 목록.
- `shared/`: 같은 활동 또는 여러 활동이 실제로 함께 쓰는 수업 부품.
- `src/lesson/`: 수업 고유 그림과 조작.
- `src/player/`: 수업 주제를 모르는 공용 탐색·재생·브라우저 저장.
- `src/components/`: 수업에 넣는 공용 퀴즈·코드·배치.
- `src/domain/`: 순수 규칙과 타입.

한 슬라이드는 목표 하나를 다룬다. 여러 장면으로 원인·동작·결과를 나눠 보여 준다. 장면 이름 대신 ID로 상태를 가리키고, 배포 후에는 ID를 유지한다. 제목·자막은 한국어로 짧게 쓴다.

새 슬라이드는 [slide-create](.agents/skills/slide-create/SKILL.md), 수정은 [slide-edit](.agents/skills/slide-edit/SKILL.md), 표현 기준은 [slide-principles](.agents/skills/slide-principles/SKILL.md), 제목·장면 이름은 [slide-naming](.agents/skills/slide-naming/SKILL.md)을 따른다. 낭독 원고는 [slide-narration](.agents/skills/slide-narration/SKILL.md)을 쓰며 음성 생성은 현재 미지원이다. Codex는 `.agents/skills/`, Claude는 `.claude/skills/`의 상대 링크로 같은 원본을 읽는다. 자동 목록에 없으면 링크를 직접 읽는다. 지원 범위는 [스킬 안내](docs/skills.md)에 있다. 기술 절차는 공식 문서로 확인하고 출처·확인일을 남긴다. 실습 자료의 안내를 실제 사용자 환경에서 자동 실행하지 않는다.

폴더·제목을 바꿔도 기존 ID와 수업 순서를 유지한다. 새 차시를 복사할 때는 차시 ID를 새로 정한다. 장면별 폴더나 범용 플러그인 규격을 미리 늘리지 않는다.

## 검증

스타일은 Tailwind 유틸리티로 작성하고 공용 색은 `src/styles/app.css`의 `@theme`에서 고른다. `npm run format`으로 코드와 클래스 순서를 정리한다. 수정 후 `npm run check`(타입·린트·포맷·테스트·실제 차시 내용 검사)와 `npm run build`를 실행한다. 화면을 고치면 개발 서버를 띄우고 `npm run capture`로 확인한다. 모든 바뀐 장면의 실제 그림을 제작자 외의 검토자가 보고 판정한다. 자동 검사만으로 시각 검토를 대신하지 않는다.

학습자 자료의 불필요한 구성 설명·개수·메타 설명을 추가하지 않는다. 배포·GitHub 원격 저장소 공개·실제 네트워크 변경은 사용자가 요청한 범위 안에서만 한다.
