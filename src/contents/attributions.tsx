import { useEffect, useRef } from "react";

const FORM_ORIGIN = "https://teams.igem.org";

// Judges expect this page to hold the team's standard Project Attributions
// form and nothing else. The form itself is filled in on teams.igem.org.
export function Attributions() {
  const teamID = import.meta.env.VITE_TEAM_ID;
  const frameRef = useRef<HTMLIFrameElement>(null);

  // The form reports its height so the frame can grow to fit it.
  useEffect(() => {
    function listenToFormHeight(event: MessageEvent) {
      if (event.origin !== FORM_ORIGIN || typeof event.data !== "string") {
        return;
      }
      try {
        const { type, data } = JSON.parse(event.data);
        if (type === "igem-attribution-form" && frameRef.current) {
          frameRef.current.style.height = `${data + 100}px`;
        }
      } catch {
        // Not a message from the form.
      }
    }
    window.addEventListener("message", listenToFormHeight);
    return () => window.removeEventListener("message", listenToFormHeight);
  }, []);

  return (
    <iframe
      ref={frameRef}
      id="igem-attribution-form"
      className="attribution-form"
      title="Project Attributions form"
      src={`${FORM_ORIGIN}/wiki/${teamID}/attributions`}
    />
  );
}
