import {
    KeyRound,
    ListOrdered,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";

import {
    getDashboardStats
} from "../services/dashboardService.js";

import {
    showError
} from "../utils/sweetAlert.js";

const Dashboard = () => {
    const [dateRange, setDateRange] =
        useState("1 Aug – 31 Aug 2026");

    const [platform, setPlatform] =
        useState("All platforms");

    const [fromDate, setFromDate] =
        useState("2026-08-01");

    const [toDate, setToDate] =
        useState("2026-08-31");

    const [stats, setStats] = useState({
        totalUsers: 0,
        activeAccessCodes: 0,
        publishedContent: 0,
        draftContent: 0,
        totalNotifications: 0
    });

    const [loading, setLoading] = useState(true);

    const loadDashboardStats = async () => {
        try {
            setLoading(true);

            const result = await getDashboardStats();

            setStats(
                result.data?.stats || {
                    totalUsers: 0,
                    activeAccessCodes: 0,
                    publishedContent: 0,
                    draftContent: 0,
                    totalNotifications: 0
                }
            );
        } catch (error) {
            console.error(
                "Failed to load dashboard stats:",
                error.response?.data || error
            );

            showError(
                error.response?.data?.message ||
                    "Failed to load dashboard statistics"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const handleApply = (e) => {
        e.preventDefault();

        /*
         * Date range and platform filtering are currently
         * UI-only because the backend dashboard API does
         * not yet accept these filters.
         */
        loadDashboardStats();
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
                        onChange={(e) =>
                            setDateRange(e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                    >
                        <option value="1 Aug – 31 Aug 2026">
                            1 Aug – 31 Aug 2026
                        </option>

                        <option value="1 Jul – 31 Jul 2026">
                            1 Jul – 31 Jul 2026
                        </option>

                        <option value="1 Jun – 30 Jun 2026">
                            1 Jun – 30 Jun 2026
                        </option>
                    </select>
                </div>

                {/* Platform Dropdown */}
                <div className="w-44">
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Platform
                    </label>

                    <select
                        value={platform}
                        onChange={(e) =>
                            setPlatform(e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                    >
                        <option value="All platforms">
                            All platforms
                        </option>

                        <option value="iOS">
                            iOS
                        </option>

                        <option value="Android">
                            Android
                        </option>
                    </select>
                </div>

                {/* From Date Picker */}
                <div className="w-36">
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        From
                    </label>

                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) =>
                            setFromDate(e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                    />
                </div>

                {/* To Date Picker */}
                <div className="w-36">
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        To
                    </label>

                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) =>
                            setToDate(e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                    />
                </div>

                {/* Apply */}
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-[#f0bd4f] hover:bg-[#e2af42] disabled:opacity-60 disabled:cursor-not-allowed px-6 py-2 text-sm font-bold text-slate-900 transition shadow-sm"
                >
                    {loading ? "Loading..." : "Apply"}
                </button>
            </form>

            {/* Metrics Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Total App Users */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Total App Users
                        </span>

                        <Users
                            size={18}
                            className="text-slate-400"
                        />

                    </div>

                    <div className="mt-4 text-3xl font-extrabold text-[#193260]">
                        {loading
                            ? "..."
                            : stats.totalUsers.toLocaleString()}
                    </div>

                    <div className="mt-2 text-xs font-medium text-slate-400">
                        Total registered users
                    </div>

                </div>

                {/* Active Access Codes */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Active Access Codes
                        </span>

                        <KeyRound
                            size={18}
                            className="text-slate-400"
                        />

                    </div>

                    <div className="mt-4 text-3xl font-extrabold text-[#193260]">
                        {loading
                            ? "..."
                            : stats.activeAccessCodes.toLocaleString()}
                    </div>

                    <div className="mt-2 text-xs font-medium text-slate-400">
                        Currently active
                    </div>

                </div>

                {/* Published Content */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Published Content
                        </span>

                        <ListOrdered
                            size={18}
                            className="text-slate-400"
                        />

                    </div>

                    <div className="mt-4 text-3xl font-extrabold text-[#193260]">
                        {loading
                            ? "..."
                            : stats.publishedContent.toLocaleString()}
                    </div>

                    <div className="mt-2 text-xs font-medium text-slate-400">
                        {loading
                            ? "Loading..."
                            : `${stats.draftContent.toLocaleString()} drafts pending`}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Dashboard;