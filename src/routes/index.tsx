import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NayePankh Foundation — Giving Wings to Dreams" },
      { name: "description", content: "NayePankh Foundation empowers underprivileged youth across India through education, mentorship and opportunity." },
      { property: "og:title", content: "NayePankh Foundation — Giving Wings to Dreams" },
      { property: "og:description", content: "NayePankh Foundation empowers underprivileged youth across India through education, mentorship and opportunity." },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/ngo/index.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "Inter, system-ui, sans-serif", color: "#1565c0" }}>
      <p>Loading NayePankh Foundation…</p>
    </div>
  );
}
