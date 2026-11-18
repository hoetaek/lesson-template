import "./styles/app.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Player from "./player/Player";
import { lesson } from "./lesson/lesson";
import { validateLesson } from "./domain/lesson";
const errors = validateLesson(lesson);
if (errors.length) throw new Error(errors.join("\n"));
const router = createHashRouter([
  { path: "/:activityId?/:slideId?", element: <Player lesson={lesson} /> },
  { path: "*", element: <Player lesson={lesson} /> },
]);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
