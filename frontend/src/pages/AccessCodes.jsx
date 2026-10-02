import {
    ChevronLeft,
    ChevronRight,
    Eye,
    Plus,
    Search,
    X
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    createAccessCode,
    deleteAccessCode,
    getAccessCodes
} from "../services/accessCodeService.js";

import {
    closeAlert,
    showError,
    showLoading,
    showSuccess
} from "../utils/sweetAlert.js";


const AccessCodes = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] =
        useState("");

    const [codes, setCodes] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [newCode, setNewCode] =
        useState("");

    const [newLabel, setNewLabel] =
        useState("");

    const [formErrors, setFormErrors] =
        useState({});

    const [saving, setSaving] =
        useState(false);

    const [currentPage, setCurrentPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalItems, setTotalItems] =
        useState(0);

    const ITEMS_PER_PAGE = 10;

    const accessCodePattern =
        /^[^\s-]{3,15}-[^\s-]{3,15}-[^\s-]{3,15}$/;


    const accessCodeErrorMessage =
        "Access code must have 3 parts separated by hyphens. Each part must be 3-15 characters, with no spaces or hyphens inside the parts.";

    const loadAccessCodes = async (
        search = "",
        page = 1
    ) => {

        try {

            setLoading(true);


            const result =
                await getAccessCodes(
                    search,
                    page,
                    ITEMS_PER_PAGE
                );


            if (result.success) {

                const accessCodes =
                    result.data?.accessCodes || [];


                const pagination =
                    result.data?.pagination || {};


                setCodes(
                    accessCodes
                );


                setCurrentPage(
                    pagination.currentPage || page
                );


                setTotalPages(
                    pagination.totalPages || 1
                );


                setTotalItems(
                    pagination.totalItems || 0
                );

            } else {

                setCodes([]);

                setTotalPages(1);

                setTotalItems(0);

            }

        } catch (error) {

            console.error(
                "Failed to load access codes:",
                error
            );


            setCodes([]);

            setTotalPages(1);

            setTotalItems(0);


            showError(
                "Unable to load access codes",
                error.response?.data?.message ||
                "Something went wrong while loading access codes."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadAccessCodes();

    }, []);

    const handleSearch = async (value) => {

        setSearchTerm(value);

        await loadAccessCodes(
            value,
            1
        );
    };

    const handlePageChange = async (page) => {

        if (
            page < 1 ||
            page > totalPages ||
            page === currentPage
        ) {
            return;
        }


        await loadAccessCodes(
            searchTerm,
            page
        );
    };

    const validateAccessCode = (
        value
    ) => {

        if (!value) {

            return "Access code is required.";

        }


        if (
            !accessCodePattern.test(value)
        ) {

            return accessCodeErrorMessage;

        }


        return "";

    };

    const validateDescription = (
        value
    ) => {

        if (
            value.length > 150
        ) {

            return "Description cannot exceed 150 characters.";

        }


        return "";

    };

    const validateForm = () => {
        const errors = {};
        const codeError =
            validateAccessCode(
                newCode
            );
        const descriptionError =
            validateDescription(
                newLabel
            );

        if (codeError) {
            errors.code =
                codeError;
        }

        if (descriptionError) {

            errors.description =
                descriptionError;

        }


        setFormErrors(
            errors
        );


        return (
            Object.keys(errors).length === 0
        );

    };

    const handleCodeChange = (
        value
    ) => {

        setNewCode(value);


        const error =
            validateAccessCode(
                value
            );


        setFormErrors((prev) => ({
            ...prev,
            code: error
        }));

    };

    const handleLabelChange = (
        value
    ) => {

        setNewLabel(value);


        const error =
            validateDescription(
                value
            );


        setFormErrors((prev) => ({
            ...prev,
            description: error
        }));

    };

    const handleOpenModal = () => {

        setNewCode("");

        setNewLabel("");

        setFormErrors({});

        setIsModalOpen(true);

    };

    const handleCloseModal = () => {

        if (saving) {
            return;
        }


        setNewCode("");

        setNewLabel("");

        setFormErrors({});

        setIsModalOpen(false);

    };

    const handleSaveCode = async (e) => {
        e.preventDefault();
        const isValid =
            validateForm();
        if (!isValid) {
            return;
        }
        const code =
            newCode.toUpperCase();

        const description =
            newLabel.trim();

        try {

            setSaving(true);


            showLoading(
                "Creating access code..."
            );


            const result =
                await createAccessCode({
                    code,
                    description
                });


            closeAlert();


            if (result.success) {

                setNewCode("");

                setNewLabel("");

                setFormErrors({});

                setIsModalOpen(false);


                await loadAccessCodes(
                    searchTerm,
                    currentPage
                );


                await showSuccess(
                    "Access code created",
                    "The access code has been created successfully."
                );

            }

        } catch (error) {

            closeAlert();


            console.error(
                "Failed to create access code:",
                error
            );


            const responseData =
                error.response?.data;

            if (
                Array.isArray(
                    responseData?.errors
                )
            ) {

                const backendErrors = {};


                responseData.errors.forEach(
                    (item) => {

                        if (
                            item.field === "code"
                        ) {

                            backendErrors.code =
                                item.message;

                        }


                        if (
                            item.field ===
                            "description"
                        ) {

                            backendErrors.description =
                                item.message;

                        }

                    }
                );


                if (
                    Object.keys(
                        backendErrors
                    ).length > 0
                ) {
                    setFormErrors(
                        (prev) => ({
                            ...prev,
                            ...backendErrors
                        })
                    );
                    return;
                }
            }
            if (
                error.response?.status === 409
            ) {
                setFormErrors(
                    (prev) => ({
                        ...prev,
                        code:
                            responseData?.message ||
                            "This access code already exists."
                    })
                );
                return;
            }

            const message =
                responseData?.message ||
                "Unable to create access code.";


            showError(
                "Failed to create access code",
                message
            );

        } finally {

            setSaving(false);

        }
    };

    const handleRemove = async (
        id
    ) => {

        try {

            showLoading(
                "Removing access code..."
            );


            const result =
                await deleteAccessCode(id);


            closeAlert();


            if (result.success) {

                const nextTotalItems =
                    Math.max(
                        totalItems - 1,
                        0
                    );


                const nextTotalPages =
                    Math.max(
                        Math.ceil(
                            nextTotalItems /
                            ITEMS_PER_PAGE
                        ),
                        1
                    );


                const nextPage =
                    currentPage >
                        nextTotalPages
                        ? nextTotalPages
                        : currentPage;


                await loadAccessCodes(
                    searchTerm,
                    nextPage
                );


                await showSuccess(
                    "Access code removed",
                    "The access code has been deactivated successfully."
                );

            }

        } catch (error) {

            closeAlert();


            console.error(
                "Failed to remove access code:",
                error
            );


            showError(
                "Failed to remove access code",
                error.response?.data?.message ||
                "Unable to remove access code."
            );

        }
    };

    const handleViewDevices = (
        e,
        id
    ) => {

        e.preventDefault();

        e.stopPropagation();


        navigate(
            `/devices-and-users?accessCodeId=${id}`
        );

    };


    return (

        <div className="space-y-6 text-slate-800 relative">


            {/* Search + Add Access Code */}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">


                {/* Search */}

                <div className="relative w-full max-w-2xl">

                    <Search
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />


                    <input
                        type="text"
                        placeholder="Search access codes"
                        value={searchTerm}
                        onChange={(e) =>
                            handleSearch(
                                e.target.value
                            )
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260] placeholder:text-slate-400"
                    />

                </div>


                {/* Add Button */}

                <button
                    type="button"
                    onClick={
                        handleOpenModal
                    }
                    className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-lg bg-[#f0bd4f] hover:bg-[#e2af42] px-5 py-2.5 text-sm font-bold text-slate-900 transition shadow-sm whitespace-nowrap"
                >

                    <Plus size={18} />

                    <span>
                        Add access code
                    </span>

                </button>

            </div>


            {/* Access Codes Table */}

            <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full text-left border-collapse">


                        {/* Header */}

                        <thead>

                            <tr className="border-b border-slate-200 bg-white text-[11px] font-bold uppercase tracking-wider text-slate-400">

                                <th className="py-4 px-6">
                                    Access Code
                                </th>

                                <th className="py-4 px-6">
                                    Devices
                                </th>

                                <th className="py-4 px-6">
                                    Created
                                </th>

                                <th className="py-4 px-6 text-right">
                                    Action
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
                                        Loading access codes...
                                    </td>

                                </tr>

                            )}


                            {/* Empty */}

                            {!loading &&
                                codes.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="py-12 text-center text-sm text-slate-400"
                                        >
                                            No access codes found.
                                        </td>

                                    </tr>

                                )}


                            {/* Codes */}

                            {!loading &&
                                codes.map((item) => {

                                    const deviceCount =
                                        Array.isArray(
                                            item.devices
                                        )
                                            ? item.devices.length
                                            : 0;


                                    return (

                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/60 transition"
                                        >


                                            {/* Code */}

                                            <td className="py-4 px-6">

                                                <div className="font-bold text-slate-900">
                                                    {item.code}
                                                </div>

                                                <div className="text-xs text-slate-400 mt-0.5">
                                                    {item.description ||
                                                        "No description"}
                                                </div>

                                            </td>


                                            {/* Devices */}

                                            <td className="py-4 px-6">

                                                <div className="flex items-center gap-2">

                                                    <span className="font-bold text-slate-800">
                                                        {deviceCount.toLocaleString()}
                                                    </span>


                                                    <button
                                                        type="button"
                                                        onClick={(e) =>
                                                            handleViewDevices(
                                                                e,
                                                                item.id
                                                            )
                                                        }
                                                        className="rounded border border-slate-200 p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                                                        title="View Devices & Users"
                                                    >

                                                        <Eye size={14} />

                                                    </button>

                                                </div>

                                            </td>


                                            {/* Created */}

                                            <td className="py-4 px-6 font-medium text-slate-600">

                                                {item.createdAt
                                                    ? new Date(
                                                        item.createdAt
                                                    ).toLocaleDateString(
                                                        "en-GB",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric"
                                                        }
                                                    )
                                                    : "-"}

                                            </td>


                                            {/* Action */}

                                            <td className="py-4 px-6 text-right">

                                                {item.status ===
                                                "INACTIVE" ? (

                                                    <button
                                                        type="button"
                                                        disabled
                                                        className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-400 cursor-not-allowed"
                                                    >
                                                        Inactive
                                                    </button>

                                                ) : (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemove(
                                                                item.id
                                                            )
                                                        }
                                                        className="rounded-lg border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                                                    >
                                                        Remove
                                                    </button>

                                                )}

                                            </td>

                                        </tr>

                                    );

                                })}

                        </tbody>

                    </table>

                </div>


                {/* Footer */}

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100 bg-white px-6 py-4">


                    <span className="text-xs font-medium text-slate-400">
                        Removed codes lose access at the next connectivity check.
                    </span>


                    <div className="flex items-center gap-1">


                        <button
                            type="button"
                            onClick={() =>
                                handlePageChange(
                                    currentPage - 1
                                )
                            }
                            disabled={
                                currentPage === 1 ||
                                loading
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-[#193260] disabled:cursor-not-allowed disabled:opacity-40"
                            title="Previous page"
                        >

                            <ChevronLeft size={16} />

                        </button>


                        {Array.from(
                            {
                                length: totalPages
                            },
                            (_, index) =>
                                index + 1
                        ).map((page) => (

                            <button
                                key={page}
                                type="button"
                                onClick={() =>
                                    handlePageChange(
                                        page
                                    )
                                }
                                disabled={loading}
                                className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${
                                    currentPage === page
                                        ? "bg-[#193260] text-white"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-[#193260]"
                                }`}
                            >

                                {page}

                            </button>

                        ))}


                        <button
                            type="button"
                            onClick={() =>
                                handlePageChange(
                                    currentPage + 1
                                )
                            }
                            disabled={
                                currentPage ===
                                totalPages ||
                                loading
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-[#193260] disabled:cursor-not-allowed disabled:opacity-40"
                            title="Next page"
                        >

                            <ChevronRight size={16} />

                        </button>

                    </div>

                </div>

            </div>


            {/* Add Access Code Modal */}

            {isModalOpen && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">


                        {/* Modal Header */}

                        <div className="flex items-center justify-between pb-4">

                            <h3 className="text-base font-bold text-slate-900">
                                New access code
                            </h3>


                            <button
                                type="button"
                                onClick={
                                    handleCloseModal
                                }
                                disabled={saving}
                                className="text-slate-400 hover:text-slate-600 transition disabled:cursor-not-allowed"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* Form */}

                        <form
                            onSubmit={
                                handleSaveCode
                            }
                            className="space-y-4 pt-2"
                        >


                            {/* Code */}

                            <div>

                                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Code
                                </label>


                                <input
                                    type="text"
                                    placeholder="e.g. VDX-2026-NSW"
                                    value={newCode}
                                    onChange={(e) =>
                                        handleCodeChange(
                                            e.target.value
                                        )
                                    }
                                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition ${
                                        formErrors.code
                                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                            : "border-slate-200 focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                                    }`}
                                />


                                {/* Code Error */}

                                {formErrors.code && (

                                    <p className="mt-1.5 text-xs font-medium text-red-500">
                                        {formErrors.code}
                                    </p>

                                )}

                            </div>


                            {/* Description */}

                            <div>

                                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Label
                                </label>


                                <input
                                    type="text"
                                    placeholder="Distribution note"
                                    value={newLabel}
                                    onChange={(e) =>
                                        handleLabelChange(
                                            e.target.value
                                        )
                                    }
                                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none transition ${
                                        formErrors.description
                                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                            : "border-slate-200 focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                                    }`}
                                />


                                {/* Description Error */}

                                {formErrors.description && (

                                    <p className="mt-1.5 text-xs font-medium text-red-500">
                                        {formErrors.description}
                                    </p>

                                )}

                            </div>


                            {/* Buttons */}

                            <div className="flex justify-end gap-3 pt-4">


                                <button
                                    type="button"
                                    onClick={
                                        handleCloseModal
                                    }
                                    disabled={saving}
                                    className="rounded-lg border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="rounded-lg bg-[#f0bd4f] hover:bg-[#e2af42] disabled:opacity-60 disabled:cursor-not-allowed px-5 py-2 text-xs font-bold text-slate-900 transition shadow-sm"
                                >

                                    {saving
                                        ? "Saving..."
                                        : "Save code"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

};


export default AccessCodes;