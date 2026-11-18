import { useState } from "react";
import { Button } from "./Button";
import { load, save, useStorageKey } from "../player/context";

type Saved = { selected: string; submitted: boolean };
export function Quiz({
  id,
  question,
  choices,
  correct,
  explanation,
  revision = 1,
}: {
  id: string;
  question: string;
  choices: readonly { id: string; text: string; feedback: string }[];
  correct: string;
  explanation: string;
  revision?: number;
}) {
  const key = useStorageKey(`quiz:${id}:${revision}`);
  const [answer, setAnswer] = useState<Saved>(() =>
    load(key, { selected: "", submitted: false }, (v): v is Saved => {
      if (!v || typeof v !== "object") return false;
      const r = v as Partial<Saved>;
      return typeof r.submitted === "boolean" && choices.some((c) => c.id === r.selected);
    }),
  );
  const set = (next: Saved) => {
    setAnswer(next);
    save(key, next);
  };
  const chosen = choices.find((c) => c.id === answer.selected);
  const right = answer.selected === correct;
  return (
    <form
      className="quiz mx-auto w-full max-w-4xl canvas:has-[.feedback]:grid canvas:has-[.feedback]:max-w-none canvas:has-[.feedback]:grid-cols-[1.2fr_1fr] canvas:has-[.feedback]:items-center canvas:has-[.feedback]:gap-7"
      onSubmit={(e) => {
        e.preventDefault();
        if (chosen) set({ ...answer, submitted: true });
      }}
    >
      <fieldset
        className="mb-4 min-w-0 border-0 p-0 canvas:disabled:mb-0"
        disabled={answer.submitted}
      >
        <legend className="mb-5 text-xl font-bold text-navy canvas:text-[22px]">{question}</legend>
        <div className="quiz-choices grid grid-cols-1 gap-3 sm:grid-cols-2 canvas:grid-cols-2">
          {choices.map((choice) => (
            <label
              className={`quiz-choice flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 ${answer.selected === choice.id ? "selected border-accent bg-accent-soft" : "border-line"}`}
              key={choice.id}
            >
              <input
                className="mt-1.5 shrink-0"
                type="radio"
                name={id}
                value={choice.id}
                checked={answer.selected === choice.id}
                onChange={() => set({ selected: choice.id, submitted: false })}
              />
              <span>{choice.text}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {answer.submitted ? (
        <div
          className={`feedback border-l-3 px-5 py-4 text-[15px] [&_p]:mt-2 ${right ? "right border-teal bg-success-soft" : "wrong border-amber bg-amber-soft"}`}
          role="status"
        >
          <strong>{right ? "맞았어요." : "이 차이를 확인해 보세요."}</strong>
          <p>
            {chosen?.feedback} {explanation}
          </p>
          <p>정답: {choices.find((c) => c.id === correct)?.text}</p>
          <Button className="mt-3" onClick={() => set({ selected: "", submitted: false })}>
            다시 풀기
          </Button>
        </div>
      ) : (
        <Button tone="primary" type="submit" disabled={!chosen}>
          답 확인
        </Button>
      )}
    </form>
  );
}
