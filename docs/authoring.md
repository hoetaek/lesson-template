# 차시 작성법

수업 전체를 `src/lesson/lesson.ts`의 `lesson` 객체 한 곳에서 조합한다. 활동별 파일은 `Activity` 타입을 만족하는 객체를 내보낸다. `player/`는 구체적인 수업 파일을 import하지 않는다.

```tsx
import type { Activity } from "../../domain/lesson";

export const introduction = {
  id: "introduction",
  title: "활동 이름",
  slides: [
    {
      id: "overview",
      title: "슬라이드 제목",
      sources: [],
      scenes: [
        {
          id: "problem",
          label: "문제 살펴보기",
          caption: "설명할 내용을 두 문장 안으로 적습니다.",
          content: <div>그림이나 설명</div>,
        },
        {
          id: "try",
          label: "값 바꿔 보기",
          caption: "직접 할 일을 구체적으로 안내합니다.",
          waits: true,
          content: <div>조작 컴포넌트</div>,
        },
      ],
    },
  ],
} satisfies Activity;
```

`Scene`의 `content`에는 React 컴포넌트를 넣는다. `useProgress()`는 현재 장면의 0~1 재생 진행도를 주므로, 그림은 이 값으로 이동·강조를 계산한다. `waits: true`인 장면은 연속 재생에서도 자동으로 넘기지 않는다. 기본 장면 길이는 5.5초이며 `duration`으로 바꾼다.

정적 화면도 장면 하나에 `waits: true`를 주어 사용할 수 있다. 이 첫 구현은 모든 슬라이드에 장면 목록을 사용한다. 별도 `canvas/page` 타입이나 보충 슬라이드 분기는 아직 없다.

슬라이드의 출처 키를 `sources`에 적으면 자료·출처 창에서 해당 공식 문서를 보여 준다. source 키 누락과 ID 중복은 시작 시 명확한 오류로 나타난다.

`Quiz`에는 저장 키용 ID, 문항, 네 선택지, 정답, 해설을 넘긴다. 수업 안에서 문항 ID를 유일하게 쓰고, 문제 의미나 선택지를 고쳤으면 `revision`을 올린다. 답은 브라우저에 남고 다시 풀기로 초기화한다. 이 첫 구현은 객관식을 제공한다.

새 수업을 만들 때 `Player.tsx`를 고칠 필요가 없도록 제목과 수업 메타 정보는 입력받는다. 수업용 도식·모형은 `lesson/`에 두고 공용 재생기로 옮기지 않는다. 재사용이 실제로 반복될 때 공용 부품으로 옮긴다.

## 확장 경계

- 새로운 조작 실습: 수업 컴포넌트를 만든 뒤 장면에 넣는다.
- 새 퀴즈 형식: 입력·채점·저장 형식을 함께 정한 뒤 공용 부품을 추가한다.
- 낭독: 장면 ID에 오디오를 연결하고 재생 시계와 동기화한다. 현재는 자막만 있다.
- PDF: 같은 장면을 정지 화면으로 출력하는 제작 명령을 별도로 만든다. 현재 캡처 도구가 장면별 그림을 생성한다.
- Python 실행: Worker·실행 취소·라이브러리 파일 배포가 필요한 별도 확장이다.

실행 중 임의 플러그인을 설치하거나 원격 코드를 받아 실행하는 기능은 없다.

## 스타일과 검사

배치·상태 스타일은 JSX의 Tailwind 유틸리티로 작성한다. 공용 색은 `src/styles/app.css`의 `@theme`을 사용한다. `canvas:`는 16:9 판, `flowing:`은 좁은 본문, `presenting:`은 발표 상태에만 적용된다. 창 폭만으로 발표 판의 내부 배치를 바꾸지 않는다.

`npm run format`은 Prettier와 Tailwind 플러그인으로 코드를 정리한다. `npm run check`는 엄격한 TypeScript 검사, Oxlint, Prettier 확인, 순수 규칙 테스트를 모두 실행한다. UI를 바꾸면 `npm run capture`와 독립 시각 검토도 필요하다.
