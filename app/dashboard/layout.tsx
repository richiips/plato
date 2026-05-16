import { getDashboardContext } from "@/lib/actions/dashboard";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { restaurant, restaurants } = await getDashboardContext();

  return (
    <div className="flex min-h-screen bg-[#F7F6F4]">
      <DashboardSidebar restaurant={restaurant} restaurants={restaurants} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
