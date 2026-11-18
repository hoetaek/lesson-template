# 단일 차시 템플릿

슬라이드·실습·퀴즈를 담은 차시 하나를 만드는 React + TypeScript 템플릿이다. 로그인이나 백엔드 없이 정적 사이트로 실행한다. 워크스페이스·강좌·반 모델은 없다.

원본 수업 앱에 맞춘 접히는 차례, 전체·한 장·발표 보기, 가운데 자막, 장면 막대와 배속 조작을 포함한다. Tailwind CSS로 스타일을 작성하며 TypeScript·Oxlint·Prettier 검사를 갖췄다.

## 실행

Node.js 22.18 이상과 npm을 사용한다.

```sh
npm ci
npm run dev
```

개발 화면은 `http://127.0.0.1:5196/`이다. `npm run build`는 정적 사이트를 `dist/`에 만들고, `npm run preview`는 `http://127.0.0.1:5197/`에서 빌드 결과를 연다. `index.html`을 파일로 직접 여는 방식은 지원하지 않는다.

## 새 차시 만들기

이 템플릿에는 교체할 수 있는 ‘시간과 거리’ 예제가 있다. 움직이는 그림, 값을 바꾸는 실습, 답을 기억하는 퀴즈를 살펴볼 수 있다.

로컬에서 복사하려면 부모 폴더에서 실행한다. 목적지는 아직 없는 폴더 이름으로 정한다.

```sh
git clone lesson-template my-lesson
cd my-lesson
git remote remove origin
npm ci
npm pkg set name=my-lesson
```

1. `src/lesson/lesson.ts`의 ID·제목·설명·확인일·활동 목록을 바꾼다. 차시 ID는 브라우저 저장을 구분하므로 새 수업마다 새 ID를 쓴다.
2. `src/lesson/activities/`에서 활동 → 슬라이드 → 장면을 작성한다. 한 슬라이드에 여러 장면을 넣을 수 있다.
3. 그림과 조작은 `src/lesson/`에 React 컴포넌트로 만든다. 예제의 `Movement.tsx`는 교체하거나 지운다.
4. 출처가 있으면 `lesson.sources`에 등록하고 슬라이드의 `sources`에 키를 적는다. 예제는 자체 제작한 그림과 계산으로 구성되어 외부 출처가 비어 있다.
5. `index.html`의 제목·설명과 필요하면 `public/`의 자료를 바꾼다. 동시에 여러 개발 서버를 띄우면 `npm run dev -- --port 5200`처럼 포트를 지정한다.
6. 아래 검사와 화면 검토를 마친다. 배포는 별도로 진행한다.

공용 UI는 `src/player/`, 퀴즈·코드·배치 부품은 `src/components/`, 타입과 순수 규칙은 `src/domain/`에 있다. 수업 내용을 바꿀 때 이 파일들을 수정할 필요가 없다. 별도 플러그인 설치기는 없으며 React 컴포넌트를 장면에 넣어 확장한다. [작성법](docs/authoring.md)에 예제와 계약이 있다.

## 검사

```sh
npm run format       # Prettier와 Tailwind 클래스 정렬
npm run check        # 타입·린트·포맷·순수 규칙 테스트
npm run build
# 개발 서버와 로컬 Google Chrome이 실행 가능한 환경에서
npm run capture      # 화면 검사와 이미지 저장
```

`npm run typecheck`, `npm run lint`, `npm run lint:fix`, `npm run format:check`도 각각 사용할 수 있다. VS Code 저장 시 포맷과 권장 확장, GitHub Actions의 검사·빌드 설정을 포함한다. 원격 저장소는 생성하거나 공개하지 않았다.

화면 검사는 차례에서 슬라이드·장면을 자동으로 찾는다. 390·1024·1440px와 발표 화면의 넘침, 퀴즈 답 복원·초기화, 보기 전환, 차례·배속 기억, 모바일 탐색을 확인한다. `npm run test:e2e`는 이미지 저장 없이 같은 검사를 실행한다. 결과와 캡처는 `.local/captures/`에 저장한다. `LESSON_URL`로 서버 주소를 바꿀 수 있다. 새 실습의 수업 고유 동작은 별도로 확인한다.

## 범위와 출처

답과 이어보기 위치는 해당 브라우저에만 저장한다. 학생 응답 수집·성적 관리·원격 제어는 없다. 낭독 생성·PDF 내보내기·Python 실행기도 포함하지 않는다.

[UI와 개발 설정](docs/ui-and-tooling.md), [코드 출처](docs/provenance.md), [검증 기록](docs/verification.md)을 참고한다. Tailscale 차시와 공용 코드는 분리 시점에 같지만, 서로 독립된 저장소이므로 이후 변경이 자동으로 동기화되지는 않는다.
