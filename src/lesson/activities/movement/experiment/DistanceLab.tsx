import { useState } from "react";
import { Split } from "../../../../components/Content";
import { Track } from "../shared/Track";

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
