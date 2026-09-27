import { KeyRound, ListOrdered, Users } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
    const [dateRange, setDateRange] = useState("1 Aug – 31 Aug 2026");
    const [platform, setPlatform] = useState("All platforms");
    const [fromDate, setFromDate] = useState("2026-08-01");
    const [toDate, setToDate] = useState("2026-08-31");

    const handleApply = (e) => {
        e.preventDefault();
        // Fetch or filter metric data based on selected range and platform
    };

    return (
        <div className="space-y-6 text-slate-800">
            {/* Filter Control Bar */}
            <form
                onSubmit={handleApply}
                className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >
                {/* Date Range Dropdown */}
                <div className="flex-1 min-w-[240px]">
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Date Range
                    </label>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                    >
                        <option value="1 Aug – 31 Aug 2026">1 Aug – 31 Aug 2026</option>
                        <option value="1 Jul – 31 Jul 2026">1 Jul – 31 Jul 2026</option>
                        <option value="1 Jun – 30 Jun 2026">1 Jun – 30 Jun 2026</option>
                    </select>
                </div>

                {/* Platform Dropdown */}
                <div className="w-44">
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Platform
                    </label>
                    <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                    >
                        <option value="All platforms">All platforms</option>
                        <option value="iOS">iOS</option>
                        <option value="Android">Android</option>
                    </select>
                </div>

                {/* From Date Picker */}
                <div className="w-36">
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        From
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                        />
                    </div>
                </div>

                {/* To Date Picker */}
                <div className="w-36">
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        To
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                        />
                    </div>
                </div>

                {/* Apply Action Button */}
                <button
                    type="submit"
                    className="rounded-lg bg-[#f0bd4f] hover:bg-[#e2af42] px-6 py-2 text-sm font-bold text-slate-900 transition shadow-sm"
                >
                    Apply
                </button>
            </form>

            {/* Metrics Summary Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total App Users Metric */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Total App Users
                        </span>
                        <Users size={18} className="text-slate-400" />
                    </div>
                    <div className="mt-4 text-3xl font-extrabold text-[#193260]">
                        12,480
                    </div>
                    <div className="mt-2 text-xs font-medium text-slate-400">
                        +318 in range
                    </div>
                </div>

                {/* Active Access Codes Metric */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Active Access Codes
                        </span>
                        <KeyRound size={18} className="text-slate-400" />
                    </div>
                    <div className="mt-4 text-3xl font-extrabold text-[#193260]">
                        26
                    </div>
                    <div className="mt-2 text-xs font-medium text-slate-400">
                        2 added in range
                    </div>
                </div>

                {/* Published Content Metric */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Published Content
                        </span>
                        <ListOrdered size={18} className="text-slate-400" />
                    </div>
                    <div className="mt-4 text-3xl font-extrabold text-[#193260]">
                        48
                    </div>
                    <div className="mt-2 text-xs font-medium text-slate-400">
                        5 drafts pending
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;