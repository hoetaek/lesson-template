import type { Slide } from "../../../../domain/lesson";
import { Quiz } from "../../../../components/Quiz";

export const slide = {
  id: "check",
  title: "이동 거리 확인",
  sources: [],
  scenes: [
    {
      id: "quiz",
      label: "이동 거리 고르기",
      caption: "속력과 시간을 곱해 이동 거리를 구해 보세요.",
      waits: true,
      content: (
        <Quiz
          id="distance"
          question="3 m/s의 일정한 속력으로 4초 동안 움직였습니다. 이동 거리는 얼마일까요?"
          correct="twelve"
          choices={[
            { id: "three", text: "3 m", feedback: "3 m는 1초 동안 이동한 거리입니다." },
            { id: "seven", text: "7 m", feedback: "속력과 시간은 더하지 않고 곱합니다." },
            { id: "twelve", text: "12 m", feedback: "1초마다 3 m씩, 4초 동안 이동했습니다." },
            {
              id: "twenty-four",
              text: "24 m",
              feedback: "24 m는 같은 속력으로 8초 동안 움직인 거리입니다.",
            },
          ]}
          explanation="3 m/s × 4 s = 12 m입니다."
        />
      ),
    },
  ],
} satisfies Slide;
