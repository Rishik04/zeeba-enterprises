// DashboardLayout.tsx
import AdminSidebar from "./Sidebar";

export function DashboardLayout({ children, activeKey, onNavigate }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar (fixed on lg inside the component) */}
            <div className="flex">
                <AdminSidebar onNavigate={onNavigate} active={activeKey} />
                {/* Offset the fixed sidebar width on lg screens */}
                <main className="flex-1 lg:ml-72 min-h-screen">
                    {/* Optional admin topbar */}
                    <div className="sticky top-0 z-30 bg-white border-b h-14 flex items-center px-4">
                        <div className="text-sm text-gray-600">
                            Admin &raquo; {activeKey?.replace('admin/', '')}
                        </div>
                    </div>

                    {/* Page content */}
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
