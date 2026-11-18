---
name: slide-create
description: 독립 차시에 슬라이드 한 장과 여러 장면을 만든다. 새 슬라이드나 실습·퀴즈 장면을 추가할 때 쓴다.
---

루트 `AGENTS.md`와 `docs/authoring.md`를 읽는다. 판단은 [slide-principles](../slide-principles/SKILL.md), 제목·장면 이름은 [slide-naming](../slide-naming/SKILL.md)을 따른다. 전용 호출 도구가 없어도 링크된 파일을 직접 읽는다.

1. 한 슬라이드의 학습 목표를 정하고, 필요해지는 문제부터 설명·실습·답까지 장면 순서를 잡는다. 사용자가 이미 정한 목표는 다시 묻지 않는다.
2. `src/lesson/activities/<활동 id>/<슬라이드 id>/slide.tsx`에 `Slide`를 만족하는 `slide` 객체를 만든다. 제목·출처 키·장면 ID·자막을 함께 둔다. 활동의 `index.ts`에서 가져와 `slides` 목록에 배치한다.
3. 전용 그림·조작은 같은 슬라이드 폴더에 둔다. 활동 안에서 반복되는 것은 그 활동의 `shared/`, 여러 활동이 실제로 함께 쓰는 것은 `src/lesson/shared/`에 둔다. 화면 종류를 새 플러그인 규격으로 늘리기 전에 React 컴포넌트로 해결한다.
4. 조작·퀴즈에는 `waits: true`를 준다. 조작 뒤에는 답과 이유를 비교하는 장면을 둔다. 공용 `Quiz`는 제출 후 정답·해설을 같은 장면에 보여 준다.
5. 공식 출처와 확인일을 남기고, 화면의 수치가 실제 계산과 맞는지 확인한다. `npm run check`, `npm run build`를 직접 실행한다.
6. 개발 서버에서 `npm run capture`를 실행하고 새 장면과 제출 후 퀴즈를 실제 그림으로 본다. 자동 캡처는 마지막 정지 상태이므로 움직임은 일반 재생에서도 확인한다. 제작자 외 검토자가 바뀐 장면을 직접 열어 판정한 뒤 사용자에게 결과를 보여 준다.

현재 캡처 CLI에는 `fit`·`at` 하위 명령이 없다. 문서에 없는 명령을 만들어 실행하지 않는다. 낭독은 요청받았을 때 [slide-narration](../slide-narration/SKILL.md)으로 원고를 작성하며, 음성 생성 기능이 있다고 가정하지 않는다.
