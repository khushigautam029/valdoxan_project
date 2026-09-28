import {
    Bell,
    ChevronLeft,
    ChevronRight,
    Gauge,
    KeyRound,
    ListOrdered,
    LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

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

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform any auth token cleanup here if needed (e.g. localStorage.clear())
        navigate("/login");
    };

    return (
        <aside
            className={`fixed left-0 top-0 z-40 flex h-screen flex-col justify-between bg-[#193260] text-white transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"
                }`}
        >
            {/* Top Section: Logo & Toggle Header */}
            <div>
                {/* Header Area with Brand Name and Chevron Toggle */}
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-5 h-20">
                    {!isCollapsed && (
                        <div className="flex flex-col justify-center overflow-hidden">
                            <h1 className="text-2xl font-bold tracking-tight text-white whitespace-nowrap">
                                Valdoxan<span className="text-xs font-normal">®</span>
                            </h1>
                            <p className="text-xs font-medium text-slate-300 whitespace-nowrap">
                                agomelatine
                            </p>
                        </div>
                    )}

                    {/* Toggle Button with Chevron Icons (< and >) */}
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        className={`rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer ${isCollapsed ? "mx-auto" : ""
                            }`}
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-3 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                title={isCollapsed ? item.name : undefined}
                                className={({ isActive }) =>
                                    `flex items-center gap-3.5 rounded-lg py-3 text-sm font-semibold transition ${isCollapsed ? "justify-center px-0" : "px-4"
                                    } ${isActive
                                        ? "bg-[#334b79] text-white"
                                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={20} className="shrink-0" />
                                {!isCollapsed && (
                                    <span className="truncate">{item.name}</span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section: Admin Profile & Logout */}
            <div className="border-t border-white/10 p-3 space-y-3">
                {/* User Info */}
                <div
                    className={`flex items-center gap-3 ${isCollapsed ? "justify-center px-0" : "px-2"
                        }`}
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3b5380] text-xs font-bold text-white border border-white/10">
                        AD
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold leading-tight text-white truncate">
                                Admin
                            </p>
                            <p className="text-xs text-slate-300 truncate">
                                admin@dotsquares.com
                            </p>
                        </div>
                    )}
                </div>

                {/* Log Out Button */}
                <button
                    type="button"
                    onClick={handleLogout}
                    title={isCollapsed ? "Log out" : undefined}
                    className={`flex w-full items-center rounded-lg bg-[#334b79]/60 py-2.5 text-sm font-semibold text-white hover:bg-[#334b79] transition cursor-pointer ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"
                        }`}
                >
                    <LogOut size={18} className="shrink-0" />
                    {!isCollapsed && <span>Log out</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;