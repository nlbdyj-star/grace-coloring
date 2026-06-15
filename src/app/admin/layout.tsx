import { AdminProvider } from "@/lib/admin-context";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#FAF8F4]">
        <AdminSidebar />
        <div className="transition-all duration-300" style={{ marginLeft: 260 }}>
          <AdminHeader />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminProvider>
  );
}
