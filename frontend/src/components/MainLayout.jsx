import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50">

            <Sidebar />

            <Navbar />

            <main className="ml-64 pt-20">

                <div className="p-8">
                    <Outlet />
                </div>

            </main>

        </div>
    );
};

export default MainLayout;