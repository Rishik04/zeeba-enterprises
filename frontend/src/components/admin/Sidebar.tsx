import {
    Briefcase,
    Building2,
    Gavel,
    HomeIcon,
    LayoutGrid,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface SidebarProps {
    onNavigate: (page: string) => void;
    active?: string; // e.g. 'dashboard', 'admin/careers', 'admin/tenders'
}

const NAV = [
    { key: "home", label: "Home", icon: HomeIcon },
    { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { key: "admin/careers", label: "Careers", icon: Briefcase },
    { key: "admin/tenders", label: "Tenders", icon: Gavel },
];

export default function AdminSidebar({ onNavigate, active = "dashboard" }: SidebarProps) {
    const cn = (...classes: (string | false | null | undefined)[]) =>
        classes.filter(Boolean).join(" ");
    const [open, setOpen] = useState(false);

    const LinkItem = ({ k, label, Icon }: any) => (
        <button
            onClick={() => {
                onNavigate(k);
                setOpen(false);
            }}
            className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition text-left",
                active === k
                    ? "bg-cyan-50 text-cyan-700 border border-cyan-100"
                    : "hover:bg-gray-100 text-gray-700"
            )}
        >
            <Icon className={cn("w-5 h-5", active === k ? "text-cyan-700" : "text-gray-500")} />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <>
            {/* Mobile top bar */}
            <div className="lg:hidden sticky top-0 z-40 bg-white border-b">
                <div className="px-4 h-14 flex items-center justify-between">
                    {/* <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-cyan-600" />
                        <span className="font-semibold">Zeba Admin</span>
                    </div> */}
                    <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)}>
                        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r lg:translate-x-0 transition-transform",
                    open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="h-14 px-4 hidden lg:flex items-center gap-2 border-b">
                    <Building2 className="w-5 h-5 text-cyan-600" />
                    <span className="font-semibold">Zeba Admin</span>
                </div>

                <div className="p-3 space-y-1">
                    {NAV.map((n) => (
                        <LinkItem key={n.key} k={n.key} label={n.label} Icon={n.icon} />
                    ))}
                </div>

                <div className="mt-auto p-3 border-t hidden lg:block">
                    <button
                        onClick={() => onNavigate("logout")}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 text-gray-700"
                    >
                        <LogOut className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">Log out</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    );
}
