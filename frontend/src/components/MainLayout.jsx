import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
            <Navbar isCollapsed={isCollapsed} />
            <main
                className={`pt-20 transition-all duration-300 ease-in-out ${isCollapsed ? "ml-20" : "ml-64"
                    }`}
            >
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;