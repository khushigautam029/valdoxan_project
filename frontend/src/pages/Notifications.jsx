import { useState } from "react";

const initialHistory = [
    {
        id: 1,
        title: "New resource available",
        message: "Read our new article on sleep and mood in the Resources tab.",
        audience: "All users",
        sent: "02 Sep 2026, 09:14",
    },
    {
        id: 2,
        title: "Reminder settings",
        message: "Set a daily reminder to take your medicine.",
        audience: "Android",
        sent: "26 Aug 2026, 10:00",
    },
    {
        id: 3,
        title: "Mood diary tip",
        message: "Add a note for your next doctor visit.",
        audience: "iOS",
        sent: "19 Aug 2026, 08:30",
    },
    {
        id: 4,
        title: "App update",
        message: "New content has been added to Resources.",
        audience: "All users",
        sent: "11 Aug 2026, 17:45",
    },
    {
        id: 5,
        title: "Staying supported",
        message: "Ideas for talking to family and friends.",
        audience: "All users",
        sent: "04 Aug 2026, 09:00",
    },
    {
        id: 6,
        title: "Welcome",
        message: "Thanks for using the MyValdoxan app.",
        audience: "All users",
        sent: "28 Jul 2026, 12:15",
    },
];

const Notifications = () => {
    const [title, setTitle] = useState("New resource available");
    const [message, setMessage] = useState(
        "Read our new article on sleep and mood in the Resources tab."
    );
    const [audience, setAudience] = useState("All users");
    const [delivery, setDelivery] = useState("Send now");
    const [historyFilter, setHistoryFilter] = useState("All audiences");
    const [history, setHistory] = useState(initialHistory);

    const handleSendNotification = (e) => {
        e.preventDefault();
        if (!title || !message) return;

        const newNotification = {
            id: Date.now(),
            title,
            message,
            audience,
            sent: "Just now",
        };

        setHistory([newNotification, ...history]);
        setTitle("");
        setMessage("");
    };

    const filteredHistory = history.filter((item) => {
        if (historyFilter === "All audiences") return true;
        return item.audience.toLowerCase() === historyFilter.toLowerCase();
    });

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 text-slate-800">
            {/* Left Column: Create Notification Form */}
            <div className="lg:col-span-5">
                <form
                    onSubmit={handleSendNotification}
                    className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between h-full"
                >
                    <div className="space-y-5">
                        <h3 className="text-base font-bold text-slate-900">
                            Create notification
                        </h3>

                        {/* Title Input */}
                        <div>
                            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter notification title"
                                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                            />
                        </div>

                        {/* Message Textarea */}
                        <div>
                            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Message
                            </label>
                            <textarea
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter notification message"
                                className="w-full rounded-lg border border-slate-200 bg-white p-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260] resize-none"
                            />
                        </div>

                        {/* Audience Toggle Segment */}
                        <div>
                            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Audience
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {["All users", "iOS only", "Android only"].map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setAudience(option)}
                                        className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${audience === option
                                                ? "bg-[#193260] text-white"
                                                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Option Segment */}
                        <div>
                            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Delivery
                            </label>
                            <div className="flex gap-2">
                                {["Send now", "Schedule"].map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setDelivery(option)}
                                        className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${delivery === option
                                                ? "bg-[#193260] text-white"
                                                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submit Action & Device Reach Estimate */}
                    <div className="mt-6 pt-2">
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-[#f0bd4f] hover:bg-[#e2af42] py-3 text-sm font-bold text-slate-900 transition shadow-sm"
                        >
                            Send notification
                        </button>
                        <p className="mt-3 text-xs text-slate-400 font-medium">
                            Estimated reach 14,203 devices.
                        </p>
                    </div>
                </form>
            </div>

            {/* Right Column: Notification History */}
            <div className="lg:col-span-7">
                <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
                    {/* Header & Audience Filter */}
                    <div className="flex items-center justify-between border-b border-slate-100 p-6">
                        <h3 className="text-base font-bold text-slate-900">
                            Notification history
                        </h3>
                        <select
                            value={historyFilter}
                            onChange={(e) => setHistoryFilter(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                        >
                            <option value="All audiences">All audiences</option>
                            <option value="All users">All users</option>
                            <option value="iOS">iOS</option>
                            <option value="Android">Android</option>
                        </select>
                    </div>

                    {/* Notification History Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    <th className="py-3 px-6">Message</th>
                                    <th className="py-3 px-6">Audience</th>
                                    <th className="py-3 px-6">Sent</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                                        {/* Message Details */}
                                        <td className="py-4 px-6 max-w-xs sm:max-w-md">
                                            <div className="font-bold text-slate-900">{item.title}</div>
                                            <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                                {item.message}
                                            </div>
                                        </td>

                                        {/* Audience Badge */}
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                                {item.audience}
                                            </span>
                                        </td>

                                        {/* Sent Timestamp */}
                                        <td className="py-4 px-6 text-xs font-medium text-slate-500 whitespace-nowrap">
                                            {item.sent}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;