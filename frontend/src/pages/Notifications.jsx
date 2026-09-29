import { useEffect, useState } from "react";

import {
    createNotification,
    getNotifications,
    sendNotification
} from "../services/notificationService.js";

import {
    closeAlert,
    showError,
    showLoading,
    showSuccess
} from "../utils/sweetAlert.js";

const audienceOptions = [
    {
        label: "All users",
        value: "ALL"
    },
    {
        label: "iOS only",
        value: "IOS"
    },
    {
        label: "Android only",
        value: "ANDROID"
    }
];

const deliveryOptions = [
    {
        label: "Send now",
        value: "NOW"
    },
    {
        label: "Schedule",
        value: "SCHEDULED"
    }
];

const Notifications = () => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    // Backend values: ALL, IOS, ANDROID
    const [audience, setAudience] = useState("ALL");

    // Backend values: NOW, SCHEDULED
    const [delivery, setDelivery] = useState("NOW");

    const [scheduledAt, setScheduledAt] = useState("");

    const [historyFilter, setHistoryFilter] =
        useState("All audiences");

    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadNotifications = async () => {
        try {
            setLoading(true);

            const result = await getNotifications();

            setHistory(result.data || []);
        } catch (error) {
            console.error(
                "Failed to load notifications:",
                error.response?.data || error
            );

            showError(
                error.response?.data?.message ||
                    "Failed to load notifications"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleSendNotification = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            showError("Notification title is required");
            return;
        }

        if (!message.trim()) {
            showError("Notification message is required");
            return;
        }

        if (delivery === "SCHEDULED" && !scheduledAt) {
            showError(
                "Please select a scheduled date and time"
            );
            return;
        }

        try {
            setSaving(true);

            showLoading(
                delivery === "SCHEDULED"
                    ? "Scheduling notification..."
                    : "Sending notification..."
            );

            const payload = {
                title: title.trim(),
                message: message.trim(),
                audience,
                deliveryType: delivery,
                scheduledAt:
                    delivery === "SCHEDULED"
                        ? scheduledAt
                        : null,
                status:
                    delivery === "SCHEDULED"
                        ? "SCHEDULED"
                        : "DRAFT"
            };

            const result =
                await createNotification(payload);

            const notification = result.data;

            /*
             * The backend creates NOW notifications
             * with DRAFT status.
             *
             * Therefore we call /:id/send after creation
             * when the admin chooses "Send now".
             */
            if (delivery === "NOW") {
                await sendNotification(notification.id);
            }

            closeAlert();

            showSuccess(
                delivery === "SCHEDULED"
                    ? "Notification scheduled successfully"
                    : "Notification sent successfully"
            );

            // Reset form
            setTitle("");
            setMessage("");
            setAudience("ALL");
            setDelivery("NOW");
            setScheduledAt("");

            await loadNotifications();
        } catch (error) {
            console.error(
                "Failed to process notification:",
                error.response?.data || error
            );

            closeAlert();

            showError(
                error.response?.data?.message ||
                    "Failed to process notification"
            );
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getAudienceLabel = (value) => {
        switch (value) {
            case "IOS":
                return "iOS only";

            case "ANDROID":
                return "Android only";

            case "ALL":
                return "All users";

            default:
                return value || "-";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "DRAFT":
                return "Draft";

            case "SCHEDULED":
                return "Scheduled";

            case "SENT":
                return "Sent";

            case "CANCELLED":
                return "Cancelled";

            default:
                return status || "-";
        }
    };

    const filteredHistory = history.filter((item) => {
        if (historyFilter === "All audiences") {
            return true;
        }

        return (
            getAudienceLabel(item.audience) ===
            historyFilter
        );
    });

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 text-slate-800">

            {/* ================================
                CREATE NOTIFICATION
            ================================= */}
            <div className="lg:col-span-5">
                <form
                    onSubmit={handleSendNotification}
                    className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between h-full"
                >
                    <div className="space-y-5">

                        <h3 className="text-base font-bold text-slate-900">
                            Create notification
                        </h3>

                        {/* Title */}
                        <div>
                            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                placeholder="Enter notification title"
                                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Message
                            </label>

                            <textarea
                                rows={4}
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                placeholder="Enter notification message"
                                className="w-full rounded-lg border border-slate-200 bg-white p-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260] resize-none"
                            />
                        </div>

                        {/* Audience */}
                        <div>
                            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Audience
                            </label>

                            <div className="flex flex-wrap gap-2">
                                {audienceOptions.map(
                                    (option) => (
                                        <button
                                            key={
                                                option.value
                                            }
                                            type="button"
                                            onClick={() =>
                                                setAudience(
                                                    option.value
                                                )
                                            }
                                            className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                                                audience ===
                                                option.value
                                                    ? "bg-[#193260] text-white"
                                                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Delivery */}
                        <div>
                            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Delivery
                            </label>

                            <div className="flex gap-2">
                                {deliveryOptions.map(
                                    (option) => (
                                        <button
                                            key={
                                                option.value
                                            }
                                            type="button"
                                            onClick={() =>
                                                setDelivery(
                                                    option.value
                                                )
                                            }
                                            className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                                                delivery ===
                                                option.value
                                                    ? "bg-[#193260] text-white"
                                                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Scheduled Date */}
                        {delivery === "SCHEDULED" && (
                            <div>
                                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Scheduled date & time
                                </label>

                                <input
                                    type="datetime-local"
                                    value={scheduledAt}
                                    onChange={(e) =>
                                        setScheduledAt(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="mt-6 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full rounded-lg bg-[#f0bd4f] hover:bg-[#e2af42] disabled:opacity-60 disabled:cursor-not-allowed py-3 text-sm font-bold text-slate-900 transition shadow-sm"
                        >
                            {saving
                                ? "Processing..."
                                : delivery ===
                                  "SCHEDULED"
                                ? "Schedule notification"
                                : "Send notification"}
                        </button>
                    </div>
                </form>
            </div>

            {/* ================================
                NOTIFICATION HISTORY
            ================================= */}
            <div className="lg:col-span-7">
                <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 p-6">
                        <h3 className="text-base font-bold text-slate-900">
                            Notification history
                        </h3>

                        <select
                            value={historyFilter}
                            onChange={(e) =>
                                setHistoryFilter(
                                    e.target.value
                                )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                        >
                            <option value="All audiences">
                                All audiences
                            </option>

                            <option value="All users">
                                All users
                            </option>

                            <option value="iOS only">
                                iOS
                            </option>

                            <option value="Android only">
                                Android
                            </option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">

                            <thead>
                                <tr className="border-b border-slate-100 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    <th className="py-3 px-6">
                                        Message
                                    </th>

                                    <th className="py-3 px-6">
                                        Audience
                                    </th>

                                    <th className="py-3 px-6">
                                        Status
                                    </th>

                                    <th className="py-3 px-6">
                                        Sent
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 text-sm">

                                {/* Loading */}
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="py-10 text-center text-sm text-slate-400"
                                        >
                                            Loading
                                            notifications...
                                        </td>
                                    </tr>
                                ) : filteredHistory.length ===
                                  0 ? (
                                    /* Empty */
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="py-10 text-center text-sm text-slate-400"
                                        >
                                            No notifications
                                            found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredHistory.map(
                                        (item) => (
                                            <tr
                                                key={
                                                    item.id
                                                }
                                                className="hover:bg-slate-50/60 transition"
                                            >
                                                {/* Message */}
                                                <td className="py-4 px-6 max-w-xs sm:max-w-md">
                                                    <div className="font-bold text-slate-900">
                                                        {
                                                            item.title
                                                        }
                                                    </div>

                                                    <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                                        {
                                                            item.message
                                                        }
                                                    </div>
                                                </td>

                                                {/* Audience */}
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                                        {getAudienceLabel(
                                                            item.audience
                                                        )}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                                        {getStatusLabel(
                                                            item.status
                                                        )}
                                                    </span>
                                                </td>

                                                {/* Sent / Scheduled */}
                                                <td className="py-4 px-6 text-xs font-medium text-slate-500 whitespace-nowrap">
                                                    {item.status ===
                                                    "SCHEDULED"
                                                        ? formatDate(
                                                              item.scheduledAt
                                                          )
                                                        : formatDate(
                                                              item.sentAt
                                                          )}
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;