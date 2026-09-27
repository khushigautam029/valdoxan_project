import {
    ArrowLeft,
    Bold,
    Heading2,
    Image as ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditContent = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("Tips to improve your sleep");
    const [category, setCategory] = useState("Understanding depression & anxiety");
    const [displayOrder, setDisplayOrder] = useState("3");
    const [status, setStatus] = useState("Draft");
    const [bodyText, setBodyText] = useState(
        "A regular sleep routine can help your mood. Try to go to bed and wake at the same time each day, keep the bedroom dark and cool, and avoid caffeine after mid-afternoon.\n\nTalk to your doctor if sleep problems continue."
    );
    const [externalLink, setExternalLink] = useState("https://www.beyondblue.org.au");

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
                    <span>Back to content</span>
                </button>
            </div>

            {/* Main Content Card Form */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
                {/* Title Field */}
                <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                    />
                </div>

                {/* Category, Display Order, Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                        >
                            <option value="Understanding depression & anxiety">
                                Understanding depression & anxiety
                            </option>
                            <option value="General Health">General Health</option>
                            <option value="Lifestyle & Wellbeing">Lifestyle & Wellbeing</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Display Order
                        </label>
                        <input
                            type="number"
                            value={displayOrder}
                            onChange={(e) => setDisplayOrder(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                            <option value="Unpublished">Unpublished</option>
                        </select>
                    </div>
                </div>

                {/* Rich Text Editor - Body */}
                <div>
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Body
                    </label>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
                            <button
                                type="button"
                                className="rounded p-1.5 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                                title="Bold"
                            >
                                <Bold size={15} />
                            </button>
                            <button
                                type="button"
                                className="rounded p-1.5 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                                title="Italic"
                            >
                                <Italic size={15} />
                            </button>
                            <button
                                type="button"
                                className="rounded p-1.5 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                                title="Heading 2"
                            >
                                <Heading2 size={15} />
                            </button>
                            <div className="h-4 w-px bg-slate-300 mx-1" />
                            <button
                                type="button"
                                className="rounded p-1.5 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                                title="Unordered List"
                            >
                                <List size={15} />
                            </button>
                            <button
                                type="button"
                                className="rounded p-1.5 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                                title="Ordered List"
                            >
                                <ListOrdered size={15} />
                            </button>
                            <div className="h-4 w-px bg-slate-300 mx-1" />
                            <button
                                type="button"
                                className="rounded p-1.5 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                                title="Link"
                            >
                                <LinkIcon size={15} />
                            </button>
                            <button
                                type="button"
                                className="rounded p-1.5 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                                title="Image"
                            >
                                <ImageIcon size={15} />
                            </button>
                            <button
                                type="button"
                                className="rounded p-1.5 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                                title="Quote"
                            >
                                <Quote size={15} />
                            </button>
                        </div>

                        {/* Textarea Area */}
                        <textarea
                            rows={8}
                            value={bodyText}
                            onChange={(e) => setBodyText(e.target.value)}
                            className="w-full bg-white p-4 text-sm leading-relaxed text-slate-800 outline-none resize-y"
                        />
                    </div>
                </div>

                {/* Image Upload and External Link Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Image Drop Area */}
                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Image
                        </label>
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition hover:bg-slate-100/50 cursor-pointer">
                            <ImageIcon size={28} className="text-slate-400 mb-2" />
                            <p className="text-xs font-medium text-slate-500">
                                drop illustration · 1200×900 png
                            </p>
                        </div>
                    </div>

                    {/* External Link Input */}
                    <div>
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            External Link
                        </label>
                        <input
                            type="url"
                            value={externalLink}
                            onChange={(e) => setExternalLink(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                        />
                        <p className="mt-2 text-xs font-medium text-slate-400">
                            Opens in the device browser from the article footer.
                        </p>
                    </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => navigate("/content")}
                        className="rounded-lg bg-[#f0bd4f] hover:bg-[#e2af42] px-6 py-2.5 text-xs font-bold text-slate-900 transition shadow-xs cursor-pointer"
                    >
                        Publish
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/content")}
                        className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-xs font-semibold text-slate-700 transition shadow-xs cursor-pointer"
                    >
                        Save as draft
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/content")}
                        className="px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditContent;