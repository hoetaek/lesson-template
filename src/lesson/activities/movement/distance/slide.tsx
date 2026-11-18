import type { Slide } from "../../../../domain/lesson";
import { Cards } from "../../../../components/Content";
import { MovingDot } from "./MovingDot";

export const slide = {
  id: "distance",
  title: "일정한 속력",
  sources: [],
  scenes: [
    {
      id: "move",
      label: "점의 이동 보기",
      caption: "1초에 3 m씩 움직이는 점입니다. 4초 동안 얼마나 이동할까요?",
      content: <MovingDot />,
      duration: 5000,
    },
    {
      id: "multiply",
      label: "이동 거리 구하기",
      caption:
        "3 m를 네 번 더하면 12 m입니다. 속력이 일정할 때 이동 거리는 속력과 시간을 곱해 구합니다.",
      content: (
        <Cards
          items={[
            { title: "속력", body: "1초마다 이동하는 거리: 3 m/s" },
            { title: "시간", body: "움직인 시간: 4 s" },
            { title: "거리", body: "3 m/s × 4 s = 12 m" },
          ]}
        />
      ),
    },
  ],
} satisfies Slide;
