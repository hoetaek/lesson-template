---
name: slide-edit
description: 기존 슬라이드의 글·그림·장면 순서·조작을 고친다. 자막이나 그림을 바꾸거나 특정 슬라이드를 점검할 때 쓴다.
---

루트 `AGENTS.md`와 `docs/authoring.md`를 읽는다. 판단은 [slide-principles](../slide-principles/SKILL.md), 이름은 [slide-naming](../slide-naming/SKILL.md)을 따른다.

1. 대상 `src/lesson/activities/<활동 id>/<슬라이드 id>/`와 실제 장면을 확인한다. 한 슬라이드를 고칠 때 관련 없는 슬라이드를 함께 재작성하지 않는다. 공용 그림을 고친다면 사용처도 확인한다.
2. 수정 전 장면 그림을 `.local/`에 보관한다. 사용자의 지적을 원리와 연결하고 자막·그림·순서를 고친다. 기존 활동·슬라이드·장면 ID와 퀴즈 ID는 유지한다. 문제 의미를 바꾸면 `Quiz.revision`을 올린다.
3. 계산을 설명하는 그림은 결과뿐 아니라 중간값과 표시 자릿수도 확인한다. 수업 고유 계산·채점 규칙은 독립된 기대값으로 시험한다. 낭독 원고가 있으면 관련 자막 변경도 반영한다.
4. `npm run check`, `npm run build`, 개발 서버에서 `npm run capture`를 실행한다. 고친 전후 그림과 좁은 화면·전체·발표 보기, 제출 후 퀴즈를 확인한다. 움직임은 정지 캡처로 대신하지 않고 일반 재생에서 중간 상태도 본다.
5. 제작자 외 검토자가 바뀐 장면 이미지를 직접 열어 판정한다. 사용자에게 중요한 변화와 판단에 쓴 원리를 짧게 알린다. 커밋은 서로 독립된 수정 단위로 나눈다.

`fit`·`at`·낭독 생성 CLI는 이 저장소에 없다. 낭독 요청은 [slide-narration](../slide-narration/SKILL.md)의 실제 지원 범위를 따른다.
