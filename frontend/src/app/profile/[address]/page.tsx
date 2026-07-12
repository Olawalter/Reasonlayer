import { AppShell } from "@/components/layout/AppShell";
import { PublicProfileView } from "@/components/layout/PublicProfileView";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = await params;
  return (
    <AppShell>
      <PublicProfileView address={address} />
    </AppShell>
  );
}
