import {
    ArrowLeft,
    Smartphone
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

import {
    getDeviceStats,
    getDevicesByAccessCode
} from "../services/deviceService.js";

import {
    showError
} from "../utils/sweetAlert.js";


const DevicesAndUsers = () => {

    const navigate = useNavigate();

    const [
        searchParams
    ] = useSearchParams();


    /*
        Access Code ID comes from:

        /devices-and-users?accessCodeId=1
    */
    const accessCodeId =
        searchParams.get(
            "accessCodeId"
        );


    // --------------------------------
    // State
    // --------------------------------

    const [devices, setDevices] =
        useState([]);

    const [stats, setStats] =
        useState({
            iosDevices: 0,
            androidDevices: 0,
            syncedInLast7Days: 0,
            totalDevices: 0
        });

    const [loading, setLoading] =
        useState(true);


    // --------------------------------
    // Load Devices + Stats
    // --------------------------------

    const loadDeviceData = async () => {

        if (!accessCodeId) {

            showError(
                "Access code not found",
                "No access code was selected."
            );

            navigate(
                "/access-codes",
                {
                    replace: true
                }
            );

            return;
        }


        try {

            setLoading(true);


            const [
                devicesResult,
                statsResult
            ] = await Promise.all([
                getDevicesByAccessCode(
                    accessCodeId
                ),
                getDeviceStats(
                    accessCodeId
                )
            ]);


            if (
                devicesResult.success
            ) {

                setDevices(
                    devicesResult.data?.devices || []
                );

            }


            if (
                statsResult.success
            ) {

                setStats(
                    statsResult.data?.stats || {
                        iosDevices: 0,
                        androidDevices: 0,
                        syncedInLast7Days: 0,
                        totalDevices: 0
                    }
                );

            }

        } catch (error) {

            console.error(
                "Failed to load device data:",
                error
            );


            showError(
                "Unable to load devices",
                error.response?.data?.message ||
                "Something went wrong while loading device information."
            );

        } finally {

            setLoading(false);

        }
    };


    // --------------------------------
    // Initial Load
    // --------------------------------

    useEffect(() => {

        loadDeviceData();

    }, [accessCodeId]);


    // --------------------------------
    // Format Last Sync
    // --------------------------------

    const formatLastSync = (
        lastSync
    ) => {

        if (!lastSync) {
            return "Never";
        }


        return new Date(
            lastSync
        ).toLocaleString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // --------------------------------
    // Platform Display
    // --------------------------------

    const getPlatformLabel = (
        platform,
        osVersion
    ) => {

        if (
            osVersion
        ) {

            return `${platform} ${osVersion}`;

        }

        return platform || "-";

    };


    // --------------------------------
    // Render
    // --------------------------------

    return (

        <div className="space-y-6 text-slate-800">


            {/* -------------------------------- */}
            {/* Back Button */}
            {/* -------------------------------- */}

            <div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/access-codes"
                        )
                    }
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                >

                    <ArrowLeft
                        size={16}
                    />

                    <span>
                        Back to access codes
                    </span>

                </button>

            </div>


            {/* -------------------------------- */}
            {/* Metrics Cards */}
            {/* -------------------------------- */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


                {/* iOS */}

                <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">

                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">

                        iOS Devices

                    </span>


                    <div className="mt-3 text-3xl font-extrabold text-[#193260]">

                        {loading
                            ? "..."
                            : stats.iosDevices.toLocaleString()
                        }

                    </div>

                </div>


                {/* Android */}

                <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">

                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">

                        Android Devices

                    </span>


                    <div className="mt-3 text-3xl font-extrabold text-[#193260]">

                        {loading
                            ? "..."
                            : stats.androidDevices.toLocaleString()
                        }

                    </div>

                </div>


                {/* Synced */}

                <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">

                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">

                        Synced in Last 7 Days

                    </span>


                    <div className="mt-3 text-3xl font-extrabold text-[#193260]">

                        {loading
                            ? "..."
                            : stats.syncedInLast7Days.toLocaleString()
                        }

                    </div>

                </div>

            </div>


            {/* -------------------------------- */}
            {/* Devices Table */}
            {/* -------------------------------- */}

            <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full text-left border-collapse">


                        {/* Header */}

                        <thead>

                            <tr className="border-b border-slate-200 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-400">

                                <th className="py-4 px-6">
                                    Device
                                </th>

                                <th className="py-4 px-6">
                                    Platform
                                </th>

                                <th className="py-4 px-6">
                                    Access Code
                                </th>

                                <th className="py-4 px-6">
                                    Last Sync
                                </th>

                            </tr>

                        </thead>


                        {/* Body */}

                        <tbody className="divide-y divide-slate-100 text-sm">


                            {/* Loading */}

                            {loading && (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="py-12 text-center text-sm text-slate-400"
                                    >

                                        Loading devices...

                                    </td>

                                </tr>

                            )}


                            {/* Empty */}

                            {!loading &&
                                devices.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="py-12 text-center text-sm text-slate-400"
                                        >

                                            No devices found for this access code.

                                        </td>

                                    </tr>

                                )}


                            {/* Devices */}

                            {!loading &&
                                devices.map(
                                    (item) => {

                                        const isApple =
                                            item.platform ===
                                            "IOS";


                                        return (

                                            <tr
                                                key={item.id}
                                                className="hover:bg-slate-50/60 transition"
                                            >


                                                {/* Device */}

                                                <td className="py-4 px-6 font-semibold text-slate-800">

                                                    {item.deviceId || "-"}

                                                </td>


                                                {/* Platform */}

                                                <td className="py-4 px-6">

                                                    <div className="flex items-center gap-2 text-slate-700 font-medium text-xs">

                                                        {isApple ? (

                                                            <span>
                                                                
                                                            </span>

                                                        ) : (

                                                            <Smartphone
                                                                size={14}
                                                                className="text-slate-500"
                                                            />

                                                        )}


                                                        <span>

                                                            {getPlatformLabel(
                                                                item.platform,
                                                                item.osVersion
                                                            )}

                                                        </span>

                                                    </div>

                                                </td>


                                                {/* Access Code */}

                                                <td className="py-4 px-6 font-bold text-slate-900">

                                                    {item.accessCode?.code ||
                                                        "-"}

                                                </td>


                                                {/* Last Sync */}

                                                <td className="py-4 px-6 text-xs font-medium text-slate-500">

                                                    {formatLastSync(
                                                        item.lastSync
                                                    )}

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

};


export default DevicesAndUsers;