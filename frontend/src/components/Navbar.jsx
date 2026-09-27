import { Bell, UserCircle } from "lucide-react";

const Navbar = () => {
    return (
        <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-slate-200 bg-white">

            <div className="flex h-full items-center justify-between px-8">

                {/* Page area */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-800">
                        Admin Portal
                    </h2>

                    <p className="text-sm text-slate-500">
                        Manage your application
                    </p>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-5">

                    <button
                        className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
                        type="button"
                    >
                        <Bell size={20} />

                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                    </button>

                    <div className="flex items-center gap-3 border-l border-slate-200 pl-5">

                        <UserCircle
                            size={34}
                            className="text-slate-400"
                        />

                        <div>
                            <p className="text-sm font-semibold text-slate-700">
                                Admin
                            </p>

                            <p className="text-xs text-slate-500">
                                Administrator
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </header>
    );
};

export default Navbar;