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


const DATE_STORAGE_KEY =
    "dashboardDateSettings";


const EMPTY_DATES = {
    fromDate: "",
    toDate: ""
};


const getToday = () => {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


const getCurrentYearStart = () => {

    const year =
        new Date().getFullYear();

    return `${year}-01-01`;
};


const getCurrentYearEnd = () => {

    return getToday();
};


const getStoredDates = () => {

    try {

        const stored =
            localStorage.getItem(
                DATE_STORAGE_KEY
            );

        if (!stored) {
            return EMPTY_DATES;
        }

        const parsed =
            JSON.parse(stored);

        return {
            fromDate:
                parsed?.fromDate || "",
            toDate:
                parsed?.toDate || ""
        };

    } catch (error) {

        console.error(
            "Failed to read dashboard date settings:",
            error
        );

        return EMPTY_DATES;
    }
};


const Dashboard = () => {

    /*
     * IMPORTANT:
     *
     * Empty dates mean:
     * "Show all data for the current year."
     *
     * Selected dates are restored from localStorage
     * when the admin returns to Dashboard.
     */

    const storedDates =
        getStoredDates();


    const [fromDate, setFromDate] =
        useState(
            storedDates.fromDate
        );


    const [toDate, setToDate] =
        useState(
            storedDates.toDate
        );


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


    /*
     * Today's date is used as the
     * maximum selectable date.
     *
     * Example:
     * Today = 30 Sep 2026
     *
     * Admin cannot select:
     * 1 Oct 2026
     * 5 Oct 2026
     * etc.
     */

    const today =
        getToday();


    /*
     * Save selected dates.
     *
     * Empty dates are also saved.
     *
     * That means if the admin clears the
     * calendar fields, Dashboard will remember
     * that state.
     */

    const saveDateSettings = (
        selectedFromDate,
        selectedToDate
    ) => {

        localStorage.setItem(
            DATE_STORAGE_KEY,
            JSON.stringify({
                fromDate:
                    selectedFromDate || "",
                toDate:
                    selectedToDate || ""
            })
        );
    };


    /*
     * Load dashboard statistics.
     *
     * If dates are selected:
     *
     *     use selected From/To
     *
     * If dates are empty:
     *
     *     automatically use the current year
     *
     * Example:
     *
     * From = ""
     * To   = ""
     *
     * API receives:
     *
     * From = 2026-01-01
     * To   = 2026-09-30
     */

    const loadDashboardStats = async () => {

        try {

            setLoading(true);


            const apiFromDate =
                fromDate ||
                getCurrentYearStart();


            const apiToDate =
                toDate ||
                getCurrentYearEnd();


            const result =
                await getDashboardStats({
                    from: apiFromDate,
                    to: apiToDate
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


    /*
     * Load dashboard when page opens.
     *
     * If localStorage has dates:
     *     use those dates.
     *
     * If localStorage is empty:
     *     load current year's data.
     */

    useEffect(() => {

        loadDashboardStats();

    }, []);


    /*
     * Apply selected date range.
     */

    const handleApply = async (e) => {

        e.preventDefault();


        /*
         * If only one date is selected,
         * do not allow the request.
         */

        if (
            (fromDate && !toDate) ||
            (!fromDate && toDate)
        ) {

            showError(
                "Please select both From and To dates"
            );

            return;
        }


        /*
         * From date cannot be later than To date.
         */

        if (
            fromDate &&
            toDate &&
            new Date(fromDate) >
                new Date(toDate)
        ) {

            showError(
                "From date cannot be later than To date"
            );

            return;
        }


        /*
         * Future date protection.
         */

        if (
            fromDate &&
            fromDate > today
        ) {

            showError(
                "From date cannot be a future date"
            );

            return;
        }


        if (
            toDate &&
            toDate > today
        ) {

            showError(
                "To date cannot be a future date"
            );

            return;
        }


        /*
         * Save dates before loading data.
         */

        saveDateSettings(
            fromDate,
            toDate
        );


        /*
         * Load data.
         *
         * Empty dates automatically mean
         * current-year data.
         */

        await loadDashboardStats();
    };


    /*
     * From date changed.
     */

    const handleFromDateChange = (e) => {

        const value =
            e.target.value;


        if (value > today) {

            showError(
                "From date cannot be a future date"
            );

            return;
        }


        setFromDate(value);
    };


    /*
     * To date changed.
     */

    const handleToDateChange = (e) => {

        const value =
            e.target.value;


        if (value > today) {

            showError(
                "To date cannot be a future date"
            );

            return;
        }


        setToDate(value);
    };


    /*
     * Clear selected dates.
     *
     * After clicking this button:
     *
     * From = empty
     * To   = empty
     *
     * Dashboard then shows all current-year data.
     */

    const handleClearDates = async () => {

        setFromDate("");
        setToDate("");


        saveDateSettings(
            "",
            ""
        );


        try {

            setLoading(true);


            const result =
                await getDashboardStats({
                    from:
                        getCurrentYearStart(),
                    to:
                        getCurrentYearEnd()
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


    return (
        <div className="space-y-6 text-slate-800">


            {/* Filter Control Bar */}

            <form
                onSubmit={handleApply}
                className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >


                {/* From */}

                <div className="w-40">

                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        From
                    </label>


                    <input
                        type="date"
                        value={fromDate}
                        max={today}
                        onChange={
                            handleFromDateChange
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                    />

                </div>


                {/* To */}

                <div className="w-40">

                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        To
                    </label>


                    <input
                        type="date"
                        value={toDate}
                        max={today}
                        onChange={
                            handleToDateChange
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                    />

                </div>


                {/* Apply */}

                <button
                    type="submit"
                    disabled={
                        loading ||
                        (!fromDate && !toDate)
                    }
                    className="rounded-lg bg-[#f0bd4f] px-6 py-2 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-[#e2af42] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading
                        ? "Loading..."
                        : "Apply"}
                </button>


                {/* Clear */}

                {(fromDate || toDate) && (
                    <button
                        type="button"
                        onClick={
                            handleClearDates
                        }
                        disabled={loading}
                        className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Clear
                    </button>
                )}


                {/* Current data explanation */}

                {!fromDate && !toDate && (
                    <div className="w-full text-xs font-medium text-slate-400">
                        Showing all dashboard data for{" "}
                        {new Date().getFullYear()}.
                    </div>
                )}

            </form>


            {/* Metrics */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">


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

                        {!fromDate && !toDate
                            ? `All users created in ${new Date().getFullYear()}`
                            : "Created in selected range"}

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

                        {!fromDate && !toDate
                            ? `All active codes created in ${new Date().getFullYear()}`
                            : "Created in selected range"}

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
                            : !fromDate && !toDate
                                ? `${stats.draftContent.toLocaleString()} drafts in ${new Date().getFullYear()}`
                                : `${stats.draftContent.toLocaleString()} drafts in selected range`}

                    </div>

                </div>

            </div>

        </div>
    );
};


export default Dashboard;