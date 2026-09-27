import {
    Bell,
    Gauge,
    KeyRound,
    ListOrdered,
    LogOut
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: Gauge,
    },
    {
        name: "Access codes",
        path: "/access-codes",
        icon: KeyRound,
    },
    {
        name: "Content",
        path: "/content",
        icon: ListOrdered,
    },
    {
        name: "Push notifications",
        path: "/notifications",
        icon: Bell,
    },
];

const Sidebar = () => {
    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col justify-between bg-[#193260] text-white">
            {/* Top Section: Logo & Nav */}
            <div>
                {/* Logo Area */}
                <div className="flex flex-col justify-center border-b border-white/10 px-6 py-6">
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Valdoxan<span className="text-xs font-normal">®</span>
                    </h1>
                    <p className="text-xs font-medium text-slate-300">agomelatine</p>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 rounded-lg px-4 py-3 text-sm font-semibold transition ${isActive
                                        ? "bg-[#334b79] text-white"
                                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={18} className="shrink-0" />
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section: Admin Profile & Logout */}
            <div className="border-t border-white/10 p-4 space-y-3">
                {/* User Info */}
                <div className="flex items-center gap-3 px-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3b5380] text-xs font-bold text-white border border-white/10">
                        AD
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold leading-tight text-white truncate">
                            Admin
                        </p>
                        <p className="text-xs text-slate-300 truncate">
                            admin@dotsquares.com
                        </p>
                    </div>
                </div>

                {/* Log Out Button */}
                <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg bg-[#334b79]/60 px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#334b79] transition"
                >
                    <LogOut size={18} />
                    <span>Log out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;