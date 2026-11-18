import { Note, Split } from "../../../../components/Content";
import { useProgress } from "../../../../player/context";
import { Track } from "../shared/Track";

export function MovingDot() {
  const progress = useProgress();
  const seconds = Math.min(4, Math.floor(progress * 4));
  return (
    <Split
      side={
        <Note title="1초에 3 m씩">
          <p>속력을 바꾸지 않고 곧게 움직입니다.</p>
          <p className="text-2xl font-bold">{seconds}초가 지났어요.</p>
        </Note>
      }
    >
      <Track distance={3 * seconds} />
    </Split>
  );
}
