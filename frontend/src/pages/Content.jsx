import {
    ChevronLeft,
    ChevronRight,
    GripVertical,
    Plus
} from "lucide-react";
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

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const ITEMS_PER_PAGE = 10;

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

    const loadContent = async (page = 1) => {
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
                categoryId,
                page,
                ITEMS_PER_PAGE
            );

            setArticles(
                result.data?.content || []
            );

            const pagination =
                result.data?.pagination || {};

            setCurrentPage(
                pagination.currentPage || page
            );

            setTotalPages(
                pagination.totalPages || 1
            );

            setTotalItems(
                pagination.totalItems || 0
            );
        } catch (error) {
            console.error(
                "Failed to load content:",
                error.response?.data || error
            );

            setArticles([]);
            setCurrentPage(1);
            setTotalPages(1);
            setTotalItems(0);

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
        loadContent(1);
    }, [
        activeTab,
        selectedCategory
    ]);

    const handlePageChange = async (page) => {
        if (
            page < 1 ||
            page > totalPages ||
            page === currentPage
        ) {
            return;
        }

        await loadContent(page);
    };

    const handleToggleStatus = async (item) => {
        try {
            setUpdatingId(item.id);

            const nextStatus =
                item.status === "published"
                    ? "draft"
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

            /*
             * If this is the only item on the current page
             * and changing its status removes it from the
             * current filter, move to the previous page.
             */
            const nextPage =
                articles.length === 1 &&
                    currentPage > 1 &&
                    activeTab !== "All"
                    ? currentPage - 1
                    : currentPage;

            await loadContent(nextPage);
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

    const getStartItem = () => {
        if (totalItems === 0) {
            return 0;
        }

        return (
            (currentPage - 1) *
            ITEMS_PER_PAGE +
            1
        );
    };

    const getEndItem = () => {
        return Math.min(
            currentPage * ITEMS_PER_PAGE,
            totalItems
        );
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
                            navigate("/content/add")
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

                {/* Pagination Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 px-6 py-4">

                    {/* Showing Count */}
                    <p className="text-sm text-slate-500">
                        Showing{" "}
                        <span className="font-semibold text-slate-700">
                            {getStartItem()}
                        </span>
                        {" - "}
                        <span className="font-semibold text-slate-700">
                            {getEndItem()}
                        </span>
                        {" of "}
                        <span className="font-semibold text-slate-700">
                            {totalItems}
                        </span>
                        {" content"}
                    </p>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-1">

                        {/* Previous */}
                        <button
                            type="button"
                            onClick={() =>
                                handlePageChange(
                                    currentPage - 1
                                )
                            }
                            disabled={currentPage === 1}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={17} />
                        </button>

                        {/* Page Numbers */}
                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        ).map((page) => (

                            <button
                                key={page}
                                type="button"
                                onClick={() =>
                                    handlePageChange(
                                        page
                                    )
                                }
                                className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold transition ${
                                    currentPage === page
                                        ? "bg-[#193260] text-white"
                                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {page}
                            </button>

                        ))}

                        {/* Next */}
                        <button
                            type="button"
                            onClick={() =>
                                handlePageChange(
                                    currentPage + 1
                                )
                            }
                            disabled={
                                currentPage === totalPages
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Next page"
                        >
                            <ChevronRight size={17} />
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Content;
