import Link from "next/link";

export default async function CampaignsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 p-4">
        <nav className="space-y-2">
          <Link href={`/admin/campaigns/${id}`} className="block text-white">
            Details
          </Link>
          <Link
            href={`/admin/campaigns/${id}/analytics`}
            className="block text-white"
          >
            Analytics
          </Link>
          <Link
            href={`/admin/campaigns/${id}/edit`}
            className="block text-white"
          >
            Edit
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}