// DashboardLayout.tsx
import AdminSidebar from "./Sidebar";

export function DashboardLayout({ children, activeKey, onNavigate }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar (fixed on lg inside the component) */}
            <div className="flex">
                <AdminSidebar onNavigate={onNavigate} active={activeKey} />
                {/* Offset the fixed sidebar width on lg screens */}
                <main className="flex-1 lg:ml-72 min-h-screen mt-10 lg:mt-0">
                    {/* Page content */}
                    <div className="p-0 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
