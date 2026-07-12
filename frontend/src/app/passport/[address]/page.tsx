import { AppShell } from "@/components/layout/AppShell";
import { TrustPassportView } from "@/components/layout/TrustPassportView";

export default async function PassportPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  return (
    <AppShell>
      <TrustPassportView address={address} />
    </AppShell>
  );
}
