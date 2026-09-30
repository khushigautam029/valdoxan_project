import {
    KeyRound,
    ListOrdered,
    Users
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

import {
    getDashboardStats
} from "../services/dashboardService.js";

import {
    showError
} from "../utils/sweetAlert.js";

const DEFAULT_DATE_RANGE = {
    dateRange: "custom",
    fromDate: "2026-08-01",
    toDate: "2026-08-31"
};

const Dashboard = () => {

    const [dateRange, setDateRange] =
        useState(() => {
            return (
                localStorage.getItem(
                    "dashboardDateRange"
                ) ||
                DEFAULT_DATE_RANGE.dateRange
            );
        });

    const [fromDate, setFromDate] =
        useState(() => {
            return (
                localStorage.getItem(
                    "dashboardFromDate"
                ) ||
                DEFAULT_DATE_RANGE.fromDate
            );
        });

    const [toDate, setToDate] =
        useState(() => {
            return (
                localStorage.getItem(
                    "dashboardToDate"
                ) ||
                DEFAULT_DATE_RANGE.toDate
            );
        });

    const [stats, setStats] = useState({
        totalUsers: 0,
        activeAccessCodes: 0,
        publishedContent: 0,
        draftContent: 0,
        totalNotifications: 0,
        totalDevices: 0,
        iosDevices: 0,
        androidDevices: 0,
        syncedDevices: 0
    });

    const [loading, setLoading] =
        useState(true);

    const loadDashboardStats = async () => {

        try {

            setLoading(true);

            const result =
                await getDashboardStats({
                    from: fromDate,
                    to: toDate
                });

            setStats(
                result.data?.stats || {
                    totalUsers: 0,
                    activeAccessCodes: 0,
                    publishedContent: 0,
                    draftContent: 0,
                    totalNotifications: 0,
                    totalDevices: 0,
                    iosDevices: 0,
                    androidDevices: 0,
                    syncedDevices: 0
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

    const saveDateSettings = (
        selectedRange,
        selectedFromDate,
        selectedToDate
    ) => {

        localStorage.setItem(
            "dashboardDateRange",
            selectedRange
        );

        localStorage.setItem(
            "dashboardFromDate",
            selectedFromDate
        );

        localStorage.setItem(
            "dashboardToDate",
            selectedToDate
        );
    };

    const handleApply = async (e) => {

        e.preventDefault();

        if (!fromDate || !toDate) {

            showError(
                "Please select both From and To dates"
            );

            return;
        }

        if (new Date(fromDate) > new Date(toDate)) {

            showError(
                "From date cannot be later than To date"
            );

            return;
        }

        saveDateSettings(
            dateRange,
            fromDate,
            toDate
        );

        await loadDashboardStats();
    };

    const handleDateRangeChange = (value) => {

        setDateRange(value);

        if (value === "august") {

            const newFromDate = "2026-08-01";
            const newToDate = "2026-08-31";

            setFromDate(newFromDate);
            setToDate(newToDate);

            saveDateSettings(
                value,
                newFromDate,
                newToDate
            );

            return;
        }

        if (value === "july") {

            const newFromDate = "2026-07-01";
            const newToDate = "2026-07-31";

            setFromDate(newFromDate);
            setToDate(newToDate);

            saveDateSettings(
                value,
                newFromDate,
                newToDate
            );

            return;
        }

        if (value === "june") {

            const newFromDate = "2026-06-01";
            const newToDate = "2026-06-30";

            setFromDate(newFromDate);
            setToDate(newToDate);

            saveDateSettings(
                value,
                newFromDate,
                newToDate
            );

            return;
        }

        /*
         * Custom:
         * Keep the currently selected custom dates.
         */
        saveDateSettings(
            "custom",
            fromDate,
            toDate
        );
    };

    return (
        <div className="space-y-6 text-slate-800">

            {/* Filter Control Bar */}
            <form
                onSubmit={handleApply}
                className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >

                {/* Date Range */}
                <div className="flex-1 min-w-[240px]">

                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Date Range
                    </label>

                    <select
                        value={dateRange}
                        onChange={(e) =>
                            handleDateRangeChange(
                                e.target.value
                            )
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                    >

                        <option value="august">
                            1 Aug – 31 Aug 2026
                        </option>

                        <option value="july">
                            1 Jul – 31 Jul 2026
                        </option>

                        <option value="june">
                            1 Jun – 30 Jun 2026
                        </option>

                        <option value="custom">
                            Custom
                        </option>

                    </select>

                </div>

                {/* From */}
                <div className="w-36">

                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        From
                    </label>

                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => {

                            const value =
                                e.target.value;

                            setFromDate(value);
                            setDateRange("custom");

                            saveDateSettings(
                                "custom",
                                value,
                                toDate
                            );
                        }}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                    />

                </div>

                {/* To */}
                <div className="w-36">

                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        To
                    </label>

                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => {

                            const value =
                                e.target.value;

                            setToDate(value);
                            setDateRange("custom");

                            saveDateSettings(
                                "custom",
                                fromDate,
                                value
                            );
                        }}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                    />

                </div>

                {/* Apply */}
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-[#f0bd4f] hover:bg-[#e2af42] disabled:opacity-60 disabled:cursor-not-allowed px-6 py-2 text-sm font-bold text-slate-900 transition shadow-sm"
                >
                    {loading
                        ? "Loading..."
                        : "Apply"}
                </button>

            </form>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Users */}
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
                        Created in selected range
                    </div>

                </div>

                {/* Access Codes */}
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
                        Created in selected range
                    </div>

                </div>

                {/* Content */}
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
                            : `${stats.draftContent.toLocaleString()} drafts in selected range`}

                    </div>

                </div>

            </div>
        </div>
    );
};

export default Dashboard;