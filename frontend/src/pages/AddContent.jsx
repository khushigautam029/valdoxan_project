import {
    ArrowLeft,
    Image as ImageIcon,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    createContent,
    getContentById,
    updateContent,
    uploadContentImage,
} from "../services/contentService.js";

import {
    getCategories,
} from "../services/categoryService.js";

import {
    showError,
    showSuccess,
} from "../utils/sweetAlert.js";

import TextEditor from "../components/TextEditor.jsx";

const AddContent = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [displayOrder, setDisplayOrder] = useState("");
    const [status, setStatus] = useState("draft");
    const [bodyText, setBodyText] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [externalLink, setExternalLink] = useState("");

    /*
     * Load categories
     */
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setCategoriesLoading(true);

                const result = await getCategories();

                setCategories(
                    result.data?.categories || []
                );
            } catch (error) {
                console.error(
                    "Failed to load categories:",
                    error
                );

                showError(
                    error.response?.data?.message ||
                    "Failed to load categories"
                );
            } finally {
                setCategoriesLoading(false);
            }
        };

        loadCategories();
    }, []);

    /*
     * Load existing content in edit mode
     */
    useEffect(() => {
        if (!isEditMode) {
            setLoading(false);
            return;
        }

        const loadContent = async () => {
            try {
                setLoading(true);

                const result = await getContentById(id);

                const content = result.data?.content;

                if (!content) {
                    throw new Error("Content not found");
                }

                setTitle(content.title || "");

                setCategoryId(
                    content.category_id
                        ? String(content.category_id)
                        : ""
                );

                setDisplayOrder(
                    content.sort_order !== undefined &&
                    content.sort_order !== null
                        ? String(content.sort_order)
                        : ""
                );

                setStatus(
                    content.status === "published"
                        ? "published"
                        : "draft"
                );

                setBodyText(
                    content.body || ""
                );

                setImageUrl(
                    content.image_url || ""
                );

                setExternalLink(
                    content.external_link || ""
                );
            } catch (error) {
                console.error(
                    "Failed to load content:",
                    error
                );

                showError(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load content"
                );

                navigate("/content");
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [id, isEditMode, navigate]);

    /*
     * Image upload
     */
    const handleImageChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setUploadingImage(true);

            const result =
                await uploadContentImage(file);

            const uploadedUrl =
                result.data?.imageUrl ||
                result.data?.image_url ||
                result.data?.url;

            if (!uploadedUrl) {
                throw new Error(
                    "Image uploaded but no image URL was returned"
                );
            }

            setImageUrl(uploadedUrl);

            showSuccess(
                "Image uploaded successfully"
            );
        } catch (error) {
            console.error(
                "Image upload failed:",
                error
            );

            showError(
                error.response?.data?.message ||
                "Failed to upload image"
            );
        } finally {
            setUploadingImage(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    /*
     * Save content
     */
    const handleSave = async (saveStatus) => {
        try {
            if (!title.trim()) {
                showError("Title is required");
                return;
            }

            if (!categoryId) {
                showError("Category is required");
                return;
            }

            if (!displayOrder) {
                showError("Display order is required");
                return;
            }

            const sortOrder = Number(displayOrder);

            if (
                !Number.isInteger(sortOrder) ||
                sortOrder < 0
            ) {
                showError(
                    "Display order must be a valid number"
                );
                return;
            }

            setSaving(true);

            const payload = {
                title: title.trim(),
                categoryId: Number(categoryId),
                sortOrder,
                status: saveStatus,
                body: bodyText,
                imageUrl: imageUrl || null,
                externalLink:
                    externalLink.trim() || null,
            };

            if (isEditMode) {
                await updateContent(
                    id,
                    payload
                );

                showSuccess(
                    saveStatus === "published"
                        ? "Content published successfully"
                        : "Content saved as draft"
                );
            } else {
                await createContent(payload);

                showSuccess(
                    saveStatus === "published"
                        ? "Content published successfully"
                        : "Content saved as draft"
                );
            }

            navigate("/content");
        } catch (error) {
            console.error(
                "Failed to save content:",
                error
            );

            showError(
                error.response?.data?.message ||
                "Failed to save content"
            );
        } finally {
            setSaving(false);
        }
    };

    /*
     * Loading state
     */
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-sm font-medium text-slate-500">
                Loading content...
            </div>
        );
    }

    return (
        <div className="space-y-6 text-slate-800 pb-12">

            {/* Back Button */}
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/content")}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
                >
                    <ArrowLeft size={16} />

                    <span>
                        Back to content
                    </span>
                </button>
            </div>

            {/* Main Form */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">

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
                        placeholder="Enter content title"
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                    />
                </div>

                {/* Category / Display Order / Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Category */}
                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Category
                        </label>

                        <select
                            value={categoryId}
                            onChange={(e) =>
                                setCategoryId(
                                    e.target.value
                                )
                            }
                            disabled={categoriesLoading}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260] disabled:bg-slate-50 disabled:text-slate-400"
                        >
                            <option value="">
                                {categoriesLoading
                                    ? "Loading categories..."
                                    : "Select category"}
                            </option>

                            {categories
                                .filter(
                                    (category) =>
                                        category.status ===
                                        "ACTIVE"
                                )
                                .map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Display Order */}
                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Display Order
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={displayOrder}
                            onChange={(e) =>
                                setDisplayOrder(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                        >
                            <option value="draft">
                                Draft
                            </option>

                            <option value="published">
                                Published
                            </option>
                        </select>
                    </div>

                </div>

                {/* Body Rich Text Editor */}
                <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Body
                    </label>

                    <TextEditor
                        value={bodyText}
                        onChange={(content) => setBodyText(content)}
                    />
                </div>

                {/* Image / External Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

                    {/* Image */}
                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Image
                        </label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".png,.jpg,.jpeg"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        <button
                            type="button"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            disabled={uploadingImage}
                            className="w-full flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition hover:bg-slate-100/50 cursor-pointer disabled:opacity-50"
                        >
                            <ImageIcon
                                size={28}
                                className="text-slate-400 mb-2"
                            />

                            <p className="text-xs font-medium text-slate-500">
                                {uploadingImage
                                    ? "Uploading image..."
                                    : imageUrl
                                        ? "Change image"
                                        : "Upload illustration · PNG, JPG or JPEG"}
                            </p>
                        </button>

                        {imageUrl && (
                            <div className="mt-3">
                                <img
                                    src={imageUrl}
                                    alt="Content"
                                    className="h-32 w-full rounded-lg object-cover border border-slate-200"
                                />
                            </div>
                        )}
                    </div>

                    {/* External Link */}
                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            External Link
                        </label>

                        <input
                            type="url"
                            value={externalLink}
                            onChange={(e) =>
                                setExternalLink(
                                    e.target.value
                                )
                            }
                            placeholder="https://example.com"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                        />

                        <p className="mt-2 text-xs font-medium text-slate-400">
                            Opens in the device browser from the article footer.
                        </p>
                    </div>

                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">

                    <button
                        type="button"
                        disabled={
                            saving ||
                            uploadingImage ||
                            categoriesLoading
                        }
                        onClick={() =>
                            handleSave("published")
                        }
                        className="rounded-lg bg-[#f0bd4f] hover:bg-[#e2af42] px-6 py-2.5 text-xs font-bold text-slate-900 transition shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving
                            ? "Saving..."
                            : "Publish"}
                    </button>

                    <button
                        type="button"
                        disabled={
                            saving ||
                            uploadingImage ||
                            categoriesLoading
                        }
                        onClick={() =>
                            handleSave("draft")
                        }
                        className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-xs font-semibold text-slate-700 transition shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save as draft
                    </button>

                    <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                            navigate("/content")
                        }
                        className="px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                    >
                        Cancel
                    </button>

                </div>

            </div>
        </div>
    );
};

export default AddContent;