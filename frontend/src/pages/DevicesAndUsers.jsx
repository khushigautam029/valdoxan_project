import { ArrowLeft, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const devicesData = [
    { id: 1, device: "d8f1-4a20", platform: "iOS 18.2", isApple: true, code: "VDX-2026-NSW", lastSync: "Today, 08:12" },
    { id: 2, device: "b104-9cc7", platform: "Android 15", isApple: false, code: "VDX-2026-VIC", lastSync: "Today, 07:48" },
    { id: 3, device: "4e77-1ab3", platform: "iOS 17.6", isApple: true, code: "VDX-2026-QLD", lastSync: "Yesterday, 21:30" },
    { id: 4, device: "91ca-77de", platform: "Android 14", isApple: false, code: "VDX-2026-NSW", lastSync: "Yesterday, 18:05" },
    { id: 5, device: "2fb0-6e11", platform: "iOS 18.0", isApple: true, code: "VDX-2026-CONF", lastSync: "03 Sep 2026" },
    { id: 6, device: "7cd3-0b58", platform: "Android 15", isApple: false, code: "VDX-2026-WA", lastSync: "01 Sep 2026" },
];

const DevicesAndUsers = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 text-slate-800">
            {/* Back Button Header */}
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/access-codes")}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                >
                    <ArrowLeft size={16} />
                    <span>Back to access codes</span>
                </button>
            </div>

            {/* Metrics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        iOS Devices
                    </span>
                    <div className="mt-3 text-3xl font-extrabold text-[#193260]">
                        7,940
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Android Devices
                    </span>
                    <div className="mt-3 text-3xl font-extrabold text-[#193260]">
                        6,263
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Synced in Last 7 Days
                    </span>
                    <div className="mt-3 text-3xl font-extrabold text-[#193260]">
                        9,118
                    </div>
                </div>
            </div>

            {/* Devices List Table */}
            <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                <th className="py-4 px-6">Device</th>
                                <th className="py-4 px-6">Platform</th>
                                <th className="py-4 px-6">Access Code</th>
                                <th className="py-4 px-6">Last Sync</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {devicesData.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                                    <td className="py-4 px-6 font-semibold text-slate-800">
                                        {item.device}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-slate-700 font-medium text-xs">
                                            {item.isApple ? (
                                                <span></span>
                                            ) : (
                                                <Smartphone size={14} className="text-slate-500" />
                                            )}
                                            <span>{item.platform}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-bold text-slate-900">
                                        {item.code}
                                    </td>
                                    <td className="py-4 px-6 text-xs font-medium text-slate-500">
                                        {item.lastSync}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DevicesAndUsers;