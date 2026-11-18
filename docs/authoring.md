# 차시 작성법

활동은 순서를 정하고, 슬라이드 폴더는 그 슬라이드의 내용과 그림을 함께 담는다. 공용 재생기를 고치지 않고 수업을 만들 수 있게 경계를 유지한다.

## 파일을 찾는 기준

```text
src/lesson/
  lesson.ts                         차시 정보와 활동 순서
  sources.ts                        출처 목록
  activities/
    <활동 id>/
      index.ts                      활동 정보와 슬라이드 순서
      <슬라이드 id>/
        slide.tsx                   제목·출처·장면·자막
        Figure.tsx                  이 슬라이드의 그림, 필요할 때
        Lab.tsx                     이 슬라이드의 실습, 필요할 때
        figure.svg                  이 슬라이드의 자산, 필요할 때
      shared/                       이 활동 안에서 함께 쓰는 것
  shared/                           여러 활동이 함께 쓰는 것
```

위의 `Figure.tsx`, `Lab.tsx`, `shared/`는 필요할 때만 만든다. `MovingDot.tsx`, `DistanceLab.tsx`처럼 실제 역할로 이름을 짓는다. 장면마다 폴더를 만들지는 않는다. `slide.tsx`가 길어지거나 한 장면의 코드가 독립된 역할을 가질 때만 같은 폴더의 컴포넌트로 나눈다.

수업을 모르는 공용 부품은 `src/components/`, 탐색·재생은 `src/player/`, 순수 규칙과 타입은 `src/domain/`에 둔다. 공용 코드가 `src/lesson/`을 가져오면 검사에서 실패한다. 아직 반복 사용이 없는 실습을 미리 공용화하지 않는다.

## 슬라이드 한 장 추가

먼저 [slide-create](../.agents/skills/slide-create/SKILL.md), [표현 원칙](../.agents/skills/slide-principles/SKILL.md), [제목 규칙](../.agents/skills/slide-naming/SKILL.md)을 적용한다.

`src/lesson/activities/<활동 id>/<새 슬라이드 id>/slide.tsx`를 만든다.

```tsx
import type { Slide } from "../../../../domain/lesson";

export const slide = {
  id: "overview",
  title: "슬라이드 제목",
  sources: [],
  scenes: [
    {
      id: "problem",
      label: "문제 살펴보기",
      caption: "처음 배울 내용이 왜 필요한지 보여 줍니다.",
      content: <div>이곳에 문제 상황을 보여 주는 그림을 넣습니다.</div>,
    },
  ],
} satisfies Slide;
```

활동의 `index.ts`에서 가져와 `slides` 배열의 원하는 위치에 넣는다. 파일 이름순으로 자동 등록하지 않는다. 수업 순서는 작성자가 정한다.

```ts
import type { Activity } from "../../../domain/lesson";
import { slide as overview } from "./overview/slide";

export const introduction = {
  id: "introduction",
  title: "활동 이름",
  slides: [overview],
} satisfies Activity;
```

새 활동은 `lesson.ts`의 `activities` 목록에 넣는다. 기존 슬라이드의 제목이나 폴더를 고칠 때는 활동·슬라이드·장면의 `id`를 유지한다. ID는 주소와 이어보기 기준이다. ID에는 소문자·숫자·하이픈을 쓰고 소문자로 시작한다. 새 차시를 복사했을 때만 차시 ID를 새 값으로 정한다.

## 장면·실습·퀴즈

`Scene.content`에는 React 컴포넌트를 넣는다. `useProgress()`는 현재 장면의 0~1 진행도를 준다. 장면의 기본 길이는 5.5초이고 `duration`은 밀리초다. 움직임을 고쳤으면 정지 이미지뿐 아니라 실제 재생 중간도 확인한다.

조작·퀴즈는 `waits: true`로 자동 넘김을 멈춘다. 조작 뒤에는 답과 이유를 보여 준다. 공용 `Quiz`는 제출 후 같은 장면에서 정답·오답 피드백을 제공한다. 문항 ID는 수업 안에서 유일하게 쓰고, 문제 의미나 선택지를 바꾸면 `revision`을 올려 기존 저장 답과 구분한다.

퀴즈 답·위치·보기 설정은 배포 경로와 차시 ID별로 브라우저에 저장한다. 기기를 바꾸면 이어지지 않는다. 조작 컴포넌트의 임시 값은 자동으로 저장하지 않는다. 저장이 학습에 필요할 때만 명시적으로 추가한다.

## 출처와 자산

- 공식 출처는 `sources.ts` 한 곳에 등록하고 각 슬라이드의 `sources`에 키를 넣는다. 기술 절차를 확인한 날짜는 `lesson.checkedAt`에 적는다. 없는 출처 키는 내용 검사에서 실패한다.
- 그림·이미지는 사용하는 슬라이드 폴더에 두고 import한다. 여러 슬라이드가 함께 쓸 때만 `shared/`로 옮긴다. 이미지의 원본 출처·이용 조건도 제작 기록에 남긴다.
- 내려받을 파일은 `public/downloads/`에 두고 화면의 링크에는 `import.meta.env.BASE_URL`을 사용한다. `/downloads/...`를 고정하면 하위 경로 배포에서 깨질 수 있다. [Vite 자산 처리](https://vite.dev/guide/assets)를 따른다.
- 큰 이미지나 영상은 필요한 표시 크기와 용량을 먼저 확인한다. 설명은 텍스트로 남겨 확대·검색·접근성을 유지하고, 조작에는 이름과 키보드 접근을 제공한다.

## 검사와 실제 화면

```sh
npm run format
npm run check
npm run build
# 개발 서버와 로컬 Chrome에서
npm run capture
```

`check`와 `build`는 실제 `lesson.ts`를 불러 ID 형식·중복·없는 출처·빈 자막·재생 시간을 검사한다. TypeScript만 통과해도 중복 ID나 없는 출처가 남을 수 있어 별도로 확인한다. `npm run check:content`만 실행할 수도 있다. TSX를 읽는 방식은 [Vite의 JavaScript API](https://vite.dev/guide/api-javascript)와 [모듈 로딩](https://vite.dev/guide/ssr)을 사용하며 HTTP 서버는 열지 않는다.

자동 화면 검사는 차례와 장면 목록을 읽어 390·1024·1440px, 발표 보기, 퀴즈 제출 후 상태를 확인한다. `.local/captures/`의 그림은 제작자 외 검토자가 직접 열어 본다. 자동 검사는 그림의 의미나 모든 실습 동작까지 판정하지 못한다. 새 실습의 중요한 동작은 별도로 확인한다. 전체 페이지 캡처가 반복되면 실제 DOM과 새 페이지의 viewport 캡처를 대조해 화면 결함과 촬영 문제를 구분한다.

## 아직 없는 기능

낭독 음성·PDF 출력·Python 실행기·단답형 채점·원격 플러그인 설치기는 없다. 낭독 원고는 [slide-narration](../.agents/skills/slide-narration/SKILL.md)으로 작성할 수 있으나 음성을 생성하거나 재생하지는 않는다. 새 기능은 실제 요구가 생겼을 때 입력·출력·저장·취소 동작을 함께 정하고 추가한다.
