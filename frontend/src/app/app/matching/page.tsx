import type { Metadata } from "next";

import { MatchingWorkspace } from "@/components/matching-workspace";

export const metadata: Metadata = {
  title: "Escort matching | KakiMETch",
  description: "Internal escort matching for Loving Heart administrators.",
};

export default function MatchingPage() {
  return <MatchingWorkspace />;
}
