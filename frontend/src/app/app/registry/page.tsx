import type { Metadata } from "next";

import { PatientRegistry } from "@/components/patient-registry";

export const metadata: Metadata = {
  title: "Patient registry | KakiMETch",
  description: "Manage the Loving Heart elderly client registry.",
};

export default function RegistryPage() {
  return <PatientRegistry />;
}
