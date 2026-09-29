import { GripVertical, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getContent,
    updateContentStatus
} from "../services/contentService.js";

import {
    getCategories
} from "../services/categoryService.js";

import {
    showError,
    showSuccess
} from "../utils/sweetAlert.js";

const Content = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("All");
    const [selectedCategory, setSelectedCategory] =
        useState("All categories");

    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] =
        useState(true);

    const [updatingId, setUpdatingId] = useState(null);

    const loadCategories = async () => {
        try {
            setCategoriesLoading(true);

            const result = await getCategories();

            const categoryList = (result.data?.categories || [])
                .filter(
                    (category) =>
                        category.status === "ACTIVE"
                )
                .sort(
                    (a, b) =>
                        (a.sortOrder || 0) -
                        (b.sortOrder || 0)
                );

            setCategories(categoryList);
        } catch (error) {
            console.error(
                "Failed to load categories:",
                error.response?.data || error
            );

            showError(
                error.response?.data?.message ||
                    "Failed to load categories"
            );
        } finally {
            setCategoriesLoading(false);
        }
    };

    const loadContent = async () => {
        try {
            setLoading(true);

            let status = "all";

            if (activeTab === "Published") {
                status = "published";
            }

            if (activeTab === "Drafts") {
                status = "draft";
            }

            const categoryId =
                selectedCategory === "All categories"
                    ? ""
                    : selectedCategory;

            const result = await getContent(
                status,
                categoryId
            );

            setArticles(result.data?.content || []);
        } catch (error) {
            console.error(
                "Failed to load content:",
                error.response?.data || error
            );

            showError(
                error.response?.data?.message ||
                    "Failed to load content"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadContent();
    }, [activeTab, selectedCategory]);

    const handleToggleStatus = async (item) => {
        try {
            setUpdatingId(item.id);

            /*
             * Backend validation accepts:
             * "published" or "unpublished"
             *
             * Backend service converts "unpublished"
             * into DRAFT.
             */
            const nextStatus =
                item.status === "published"
                    ? "unpublished"
                    : "published";

            await updateContentStatus(
                item.id,
                nextStatus
            );

            showSuccess(
                nextStatus === "published"
                    ? "Content published successfully"
                    : "Content moved to draft"
            );

            await loadContent();
        } catch (error) {
            console.error(
                "Failed to update content status:",
                error.response?.data || error
            );

            showError(
                error.response?.data?.message ||
                    "Failed to update content status"
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    const formatStatus = (status) => {
        if (status === "published") {
            return "Published";
        }

        return "Draft";
    };

    return (
        <div className="space-y-6 text-slate-800">

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                {/* Filter Tabs */}
                <div className="flex items-center rounded-lg bg-slate-200/60 p-1">

                    {["All", "Published", "Drafts"].map(
                        (tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() =>
                                    setActiveTab(tab)
                                }
                                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                                    activeTab === tab
                                        ? "bg-white text-slate-800 shadow-sm"
                                        : "text-slate-500 hover:text-slate-800"
                                }`}
                            >
                                {tab}
                            </button>
                        )
                    )}

                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto">

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) =>
                            setSelectedCategory(
                                e.target.value
                            )
                        }
                        disabled={categoriesLoading}
                        className="w-full sm:w-auto rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260] disabled:cursor-not-allowed disabled:bg-slate-50"
                    >
                        <option value="All categories">
                            {categoriesLoading
                                ? "Loading categories..."
                                : "All categories"}
                        </option>

                        {categories.map(
                            (category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            )
                        )}
                    </select>

                    {/* New Content */}
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/content/edit")
                        }
                        className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-[#f0bd4f] hover:bg-[#e2af42] px-5 py-2.5 text-sm font-bold text-slate-900 transition shadow-sm whitespace-nowrap cursor-pointer"
                    >
                        <Plus size={18} />

                        <span>
                            New content
                        </span>
                    </button>

                </div>
            </div>

            {/* Content Table */}
            <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full text-left border-collapse">

                        <thead>
                            <tr className="border-b border-slate-200 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-400">

                                <th className="py-4 px-6 w-20">
                                    Order
                                </th>

                                <th className="py-4 px-6">
                                    Title
                                </th>

                                <th className="py-4 px-6">
                                    Category
                                </th>

                                <th className="py-4 px-6">
                                    Status
                                </th>

                                <th className="py-4 px-6">
                                    Updated
                                </th>

                                <th className="py-4 px-6 text-right">
                                    Actions
                                </th>

                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 text-sm">

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan="6"
                                        className="py-12 text-center text-slate-500"
                                    >
                                        Loading content...
                                    </td>
                                </tr>

                            ) : articles.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="6"
                                        className="py-12 text-center text-slate-500"
                                    >
                                        No content found
                                    </td>
                                </tr>

                            ) : (

                                articles.map((item) => (

                                    <tr
                                        key={item.id}
                                        className="hover:bg-slate-50/60 transition"
                                    >

                                        {/* Order */}
                                        <td className="py-4 px-6">

                                            <div className="flex items-center gap-2 text-slate-400">

                                                <GripVertical
                                                    size={16}
                                                    className="cursor-grab text-slate-400"
                                                />

                                                <span className="font-semibold text-slate-600">
                                                    {item.sort_order}
                                                </span>

                                            </div>

                                        </td>

                                        {/* Title */}
                                        <td className="py-4 px-6 font-bold text-slate-900">
                                            {item.title}
                                        </td>

                                        {/* Category */}
                                        <td className="py-4 px-6 text-sm font-medium text-slate-600">
                                            {item.category_name ||
                                                "-"}
                                        </td>

                                        {/* Status */}
                                        <td className="py-4 px-6">

                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                                    item.status ===
                                                    "published"
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : "bg-amber-100 text-amber-800"
                                                }`}
                                            >
                                                {formatStatus(
                                                    item.status
                                                )}
                                            </span>

                                        </td>

                                        {/* Updated */}
                                        <td className="py-4 px-6 text-sm font-medium text-slate-600">
                                            {formatDate(
                                                item.updated_at
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-6 text-right">

                                            <div className="flex items-center justify-end gap-2">

                                                {/* Edit */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/content/edit/${item.id}`
                                                        )
                                                    }
                                                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                                                >
                                                    Edit
                                                </button>

                                                {/* Publish / Unpublish */}
                                                <button
                                                    type="button"
                                                    disabled={
                                                        updatingId ===
                                                        item.id
                                                    }
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            item
                                                        )
                                                    }
                                                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {updatingId ===
                                                    item.id
                                                        ? "Updating..."
                                                        : item.status ===
                                                            "published"
                                                        ? "Unpublish"
                                                        : "Publish"}
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default Content;