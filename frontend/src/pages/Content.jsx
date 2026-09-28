import { GripVertical, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialArticles = [
    {
        id: 1,
        order: 1,
        title: "What is depression & anxiety?",
        category: "Understanding depression & anxiety",
        status: "Published",
        updated: "12 Aug 2026",
    },
    {
        id: 2,
        order: 2,
        title: "What are the symptoms?",
        category: "Understanding depression & anxiety",
        status: "Published",
        updated: "12 Aug 2026",
    },
    {
        id: 3,
        order: 3,
        title: "Tips to improve your sleep",
        category: "Understanding depression & anxiety",
        status: "Draft",
        updated: "02 Sep 2026",
    },
    {
        id: 4,
        order: 1,
        title: "How does it work?",
        category: "Get to know Valdoxan®",
        status: "Published",
        updated: "30 Jul 2026",
    },
    {
        id: 5,
        order: 2,
        title: "How do I take it & what should I expect?",
        category: "Get to know Valdoxan®",
        status: "Published",
        updated: "30 Jul 2026",
    },
    {
        id: 6,
        order: 3,
        title: "How long will I take it for?",
        category: "Get to know Valdoxan®",
        status: "Unpublished",
        updated: "14 Jun 2026",
    },
    {
        id: 7,
        order: 1,
        title: "Staying supported",
        category: "Resources",
        status: "Published",
        updated: "21 Aug 2026",
    },
];

const Content = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All categories");
    const [articles, setArticles] = useState(initialArticles);

    const handleToggleStatus = (id) => {
        setArticles(
            articles.map((item) => {
                if (item.id === id) {
                    const nextStatus =
                        item.status === "Published" ? "Unpublished" : "Published";
                    return { ...item, status: nextStatus };
                }
                return item;
            })
        );
    };

    const filteredArticles = articles.filter((item) => {
        const matchesTab =
            activeTab === "All"
                ? true
                : activeTab === "Drafts"
                    ? item.status === "Draft"
                    : item.status === activeTab;

        const matchesCategory =
            selectedCategory === "All categories"
                ? true
                : item.category === selectedCategory;

        return matchesTab && matchesCategory;
    });

    return (
        <div className="space-y-6 text-slate-800">
            {/* Controls Bar: Tabs, Category Select, and New Content Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Filter Tabs */}
                <div className="flex items-center rounded-lg bg-slate-200/60 p-1">
                    {["All", "Published", "Drafts"].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${activeTab === tab
                                    ? "bg-white text-slate-800 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Category Dropdown Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full sm:w-auto rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                    >
                        <option value="All categories">All categories</option>
                        <option value="Understanding depression & anxiety">
                            Understanding depression & anxiety
                        </option>
                        <option value="Get to know Valdoxan®">Get to know Valdoxan®</option>
                        <option value="Resources">Resources</option>
                    </select>

                    {/* Create New Content Button */}
                    <button
                        type="button"
                        onClick={() => navigate("/content/edit")}
                        className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-[#f0bd4f] hover:bg-[#e2af42] px-5 py-2.5 text-sm font-bold text-slate-900 transition shadow-sm whitespace-nowrap cursor-pointer"
                    >
                        <Plus size={18} />
                        <span>New content</span>
                    </button>
                </div>
            </div>

            {/* Content Table Container */}
            <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                <th className="py-4 px-6 w-20">Order</th>
                                <th className="py-4 px-6">Title</th>
                                <th className="py-4 px-6">Category</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6">Updated</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredArticles.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-slate-50/60 transition"
                                >
                                    {/* Order Column with Grip Handle */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <GripVertical size={16} className="cursor-grab text-slate-400" />
                                            <span className="font-semibold text-slate-600">
                                                {item.order}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Title Column */}
                                    <td className="py-4 px-6 font-bold text-slate-900">
                                        {item.title}
                                    </td>

                                    {/* Category Column */}
                                    <td className="py-4 px-6 text-sm font-medium text-slate-600">
                                        {item.category}
                                    </td>

                                    {/* Status Badge */}
                                    <td className="py-4 px-6">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${item.status === "Published"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : item.status === "Draft"
                                                        ? "bg-amber-100 text-amber-800"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    {/* Updated Date */}
                                    <td className="py-4 px-6 text-sm font-medium text-slate-600">
                                        {item.updated}
                                    </td>

                                    {/* Actions Column */}
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => navigate("/content/edit")}
                                                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleToggleStatus(item.id)}
                                                className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                            >
                                                {item.status === "Published" ? "Unpublish" : "Publish"}
                                            </button>
                                        </div>
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

export default Content;