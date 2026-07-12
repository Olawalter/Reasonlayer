import { AppShell } from "@/components/layout/AppShell";
import { ValidatorDetailView } from "@/components/layout/ValidatorDetailView";

export default async function ValidatorDetailPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  return (
    <AppShell>
      <ValidatorDetailView address={address} />
    </AppShell>
  );
}
