import type { Slide } from "../../../../domain/lesson";
import { Cards } from "../../../../components/Content";
import { DistanceLab } from "./DistanceLab";

export const slide = {
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
} satisfies Slide;
