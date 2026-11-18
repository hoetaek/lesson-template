import { useState } from "react";
import { Note, Split } from "../components/Content";
import { useProgress } from "../player/context";

function Track({ distance }: { distance: number }) {
  return (
    <div className="w-full py-6">
      <div
        className="relative mx-4 h-16 border-b-2 border-line"
        role="img"
        aria-label={`출발점에서 ${distance}미터 이동`}
      >
        <div
          className="absolute bottom-0 left-0 h-1 bg-teal"
          style={{ width: `${(distance / 24) * 100}%` }}
        />
        <div
          className="absolute bottom-0 size-6 -translate-x-1/2 translate-y-1/2 rounded-full border-4 border-surface bg-teal shadow-sm"
          style={{ left: `${(distance / 24) * 100}%` }}
        />
      </div>
      <div className="mx-4 mt-6 flex justify-between text-sm text-muted">
        <span>0 m</span>
        <span>12 m</span>
        <span>24 m</span>
      </div>
      <p className="mt-8 text-center text-3xl font-bold text-teal canvas:text-5xl">{distance} m</p>
    </div>
  );
}

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

export function DistanceLab() {
  const [speed, setSpeed] = useState(2);
  const [seconds, setSeconds] = useState(3);
  return (
    <Split
      side={
        <div className="grid gap-6">
          <label className="grid gap-3">
            속력: {speed} m/s
            <input
              aria-label="속력"
              type="range"
              min="1"
              max="4"
              step="1"
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
            />
          </label>
          <label className="grid gap-3">
            시간: {seconds}초
            <input
              aria-label="시간"
              type="range"
              min="1"
              max="6"
              step="1"
              value={seconds}
              onChange={(event) => setSeconds(Number(event.target.value))}
            />
          </label>
          <output
            className="rounded-lg bg-source p-5 text-xl font-bold text-teal"
            aria-live="polite"
          >
            {speed} m/s × {seconds} s = {speed * seconds} m
          </output>
        </div>
      }
    >
      <Track distance={speed * seconds} />
    </Split>
  );
}
