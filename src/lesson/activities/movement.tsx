import type { Activity } from "../../domain/lesson";
import { Cards } from "../../components/Content";
import { Quiz } from "../../components/Quiz";
import { DistanceLab, MovingDot } from "../Movement";

export const movement = {
  id: "movement",
  title: "움직임 살펴보기",
  slides: [
    {
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
    },
    {
      id: "experiment",
      title: "거리의 변화",
      sources: [],
      scenes: [
        {
          id: "adjust",
          label: "속력과 시간 바꾸기",
          caption: "시간을 그대로 두고 속력을 두 배로 바꿔 보세요. 이동 거리는 어떻게 달라지나요?",
          waits: true,
          content: <DistanceLab />,
        },
        {
          id: "compare",
          label: "두 거리 비교하기",
          caption:
            "같은 시간 동안 움직이면 속력이 두 배일 때 거리도 두 배입니다. 속력이 같을 때는 시간이 두 배면 거리도 두 배입니다.",
          content: (
            <Cards
              items={[
                { title: "기준", body: "2 m/s × 3 s = 6 m" },
                { title: "속력이 두 배", body: "4 m/s × 3 s = 12 m" },
                { title: "시간이 두 배", body: "2 m/s × 6 s = 12 m" },
              ]}
            />
          ),
        },
      ],
    },
    {
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
    },
  ],
} satisfies Activity;
