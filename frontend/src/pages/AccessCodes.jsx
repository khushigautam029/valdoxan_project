import { Eye, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialCodes = [
    { id: 1, code: "VDX-2026-NSW", desc: "NSW clinics", devices: "4,128", created: "02 Aug 2026" },
    { id: 2, code: "VDX-2026-VIC", desc: "VIC clinics", devices: "3,097", created: "02 Aug 2026" },
    { id: 3, code: "VDX-2026-QLD", desc: "QLD clinics", devices: "1,842", created: "28 Aug 2026" },
    { id: 4, code: "VDX-2026-WA", desc: "WA clinics", devices: "903", created: "05 Aug 2026" },
    { id: 5, code: "VDX-2026-CONF", desc: "Conference handout", devices: "214", created: "18 Aug 2026" },
    { id: 6, code: "VDX-2025-TRIAL", desc: "Pilot programme", devices: "0", created: "11 Mar 2025" },
];

const AccessCodes = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [codes, setCodes] = useState(initialCodes);

    // Modal State & Form Inputs
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCode, setNewCode] = useState("");
    const [newLabel, setNewLabel] = useState("");

    const handleRemove = (id) => {
        setCodes(codes.filter((item) => item.id !== id));
    };

    const handleSaveCode = (e) => {
        e.preventDefault();
        if (!newCode) return;

        const createdItem = {
            id: Date.now(),
            code: newCode,
            desc: newLabel || "Custom Access Code",
            devices: "0",
            created: "Just now",
        };

        setCodes([createdItem, ...codes]);
        setNewCode("");
        setNewLabel("");
        setIsModalOpen(false);
    };

    const handleViewDevices = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevents click bubbling up to parent containers or rows
        navigate("/devices-and-users");
    };

    const filteredCodes = codes.filter(
        (item) =>
            item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 text-slate-800 relative">
            {/* Search and Add Code Top Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full max-w-2xl">
                    <Search
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        placeholder="Search access codes"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260] placeholder:text-slate-400"
                    />
                </div>

                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-[#f0bd4f] hover:bg-[#e2af42] px-5 py-2.5 text-sm font-bold text-slate-900 transition shadow-sm whitespace-nowrap"
                >
                    <Plus size={18} />
                    <span>Add access code</span>
                </button>
            </div>

            {/* Access Codes Table Container */}
            <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                <th className="py-4 px-6">Access Code</th>
                                <th className="py-4 px-6">Devices</th>
                                <th className="py-4 px-6">Created</th>
                                <th className="py-4 px-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredCodes.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-slate-900">{item.code}</div>
                                        <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                                    </td>

                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-800">{item.devices}</span>
                                            <button
                                                type="button"
                                                onClick={handleViewDevices}
                                                className="rounded border border-slate-200 p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                                title="View Devices & Users"
                                            >
                                                <Eye size={14} />
                                            </button>
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 font-medium text-slate-600">
                                        {item.created}
                                    </td>

                                    <td className="py-4 px-6 text-right">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemove(item.id);
                                            }}
                                            className="rounded-lg border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 border-t border-slate-100 bg-white px-6 py-4 text-xs font-medium text-slate-400">
                    <span>Removed codes lose access at the next connectivity check.</span>
                    <span>Showing {filteredCodes.length} of 26</span>
                </div>
            </div>

            {/* Modal Dialog Popup for Adding New Access Code */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-4">
                            <h3 className="text-base font-bold text-slate-900">
                                New access code
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveCode} className="space-y-4 pt-2">
                            <div>
                                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Code
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. VDX-2026-NSW"
                                    value={newCode}
                                    onChange={(e) => setNewCode(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Label
                                </label>
                                <input
                                    type="text"
                                    placeholder="Distribution note"
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-lg border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-[#f0bd4f] hover:bg-[#e2af42] px-5 py-2 text-xs font-bold text-slate-900 transition shadow-sm"
                                >
                                    Save code
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccessCodes;