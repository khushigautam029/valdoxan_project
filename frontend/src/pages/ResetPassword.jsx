import { useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import { resetPassword } from "../services/authService.js";

import {
    closeAlert,
    showError,
    showLoading
} from "../utils/sweetAlert.js";


const ResetPassword = () => {

    const navigate = useNavigate();

    const { token } = useParams();


    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [errors, setErrors] =
        useState({
            newPassword: "",
            confirmPassword: ""
        });

    const [loading, setLoading] =
        useState(false);

    const [success, setSuccess] =
        useState(false);


    // Password validation
    const validatePassword = (value) => {

        if (!value) {
            return "Password is required.";
        }

        if (value.length < 8) {
            return "Password must be at least 8 characters.";
        }

        if (!/[A-Z]/.test(value)) {
            return "Password must contain at least one uppercase letter.";
        }

        if (!/[a-z]/.test(value)) {
            return "Password must contain at least one lowercase letter.";
        }

        if (!/[0-9]/.test(value)) {
            return "Password must contain at least one number.";
        }

        if (!/[^A-Za-z0-9]/.test(value)) {
            return "Password must contain at least one special character.";
        }

        return "";
    };


    // New password change
    const handlePasswordChange = (e) => {

        const value = e.target.value;

        setNewPassword(value);

        setErrors((previous) => ({
            ...previous,
            newPassword:
                validatePassword(value)
        }));
    };

    // Confirm password change
    const handleConfirmPasswordChange = (e) => {

        const value = e.target.value;

        setConfirmPassword(value);

        let confirmError = "";

        if (!value) {

            confirmError =
                "Confirm password is required.";

        } else if (value !== newPassword) {

            confirmError =
                "Confirm password must match new password.";
        }

        setErrors((previous) => ({
            ...previous,
            confirmPassword: confirmError
        }));
    };

    // Submit
    const handleSubmit = async (e) => {

        e.preventDefault();


        const passwordError =
            validatePassword(newPassword);

        let confirmError = "";

        if (!confirmPassword) {

            confirmError =
                "Confirm password is required.";

        } else if (
            confirmPassword !== newPassword
        ) {

            confirmError =
                "Confirm password must match new password.";
        }


        setErrors({
            newPassword: passwordError,
            confirmPassword: confirmError
        });


        if (
            passwordError ||
            confirmError
        ) {
            return;
        }


        if (!token) {

            showError(
                "Invalid reset link",
                "The password reset link is invalid."
            );

            return;
        }


        try {

            setLoading(true);

            showLoading(
                "Resetting password..."
            );


            const result =
                await resetPassword(
                    token,
                    newPassword,
                    confirmPassword
                );


            closeAlert();


            if (result.success) {

                setSuccess(true);
            }

        } catch (error) {

            closeAlert();

            const message =
                error.response?.data?.message ||
                "Unable to reset password. Please try again.";


            showError(
                "Password reset failed",
                message
            );

        } finally {

            setLoading(false);
        }
    };

    // Success screen
    if (success) {

        return (

            <div className="min-h-screen w-full bg-[#f3f5f9] flex flex-col items-center justify-center p-4">


                {/* Brand Logo */}

                <div className="mb-8 text-center">

                    <h1 className="text-3xl font-extrabold tracking-tight text-[#193260] font-serif">

                        Valdoxan

                        <span className="text-xs align-top font-sans font-normal ml-0.5">
                            ®
                        </span>

                    </h1>

                    <p className="text-xs font-semibold text-[#193260]/80 tracking-widest uppercase mt-0.5">
                        agomelatine
                    </p>

                </div>


                {/* Success Card */}

                <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-100">

                    <div className="text-center">


                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">

                            <svg
                                className="h-7 w-7 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />

                            </svg>

                        </div>


                        <h2 className="text-xl font-bold text-slate-900">
                            Password reset successful
                        </h2>


                        <p className="text-sm text-slate-500 mt-3 leading-6">
                            Your password has been updated successfully.
                            You can now sign in with your new password.
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                navigate("/login")
                            }
                            className="w-full rounded-xl bg-[#193260] hover:bg-[#13274d] text-white font-bold py-3 text-sm shadow-md transition cursor-pointer mt-7"
                        >
                            Back to sign in
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    // Reset password form
    return (

        <div className="min-h-screen w-full bg-[#f3f5f9] flex flex-col items-center justify-center p-4">


            {/* Brand Logo */}

            <div className="mb-8 text-center">

                <h1 className="text-3xl font-extrabold tracking-tight text-[#193260] font-serif">

                    Valdoxan

                    <span className="text-xs align-top font-sans font-normal ml-0.5">
                        ®
                    </span>

                </h1>

                <p className="text-xs font-semibold text-[#193260]/80 tracking-widest uppercase mt-0.5">
                    agomelatine
                </p>

            </div>


            {/* Reset Password Card */}

            <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-100">


                <div className="mb-6">

                    <h2 className="text-xl font-bold text-slate-900">
                        Reset password
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                        Create a new password for your admin account.
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >


                    {/* NEW PASSWORD */}

                    <div>

                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            NEW PASSWORD
                        </label>


                        <input
                            type="password"
                            value={newPassword}
                            onChange={handlePasswordChange}
                            disabled={loading}
                            placeholder="Enter new password"
                            className={`
                                w-full rounded-xl bg-white px-4 py-3
                                text-sm font-medium text-slate-800
                                outline-none transition
                                ${errors.newPassword
                                    ? "border-2 border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    : "border border-slate-200 focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                                }
                            `}
                        />


                        {errors.newPassword && (

                            <p className="mt-1.5 text-xs font-medium text-red-500">
                                {errors.newPassword}
                            </p>

                        )}

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div>

                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            CONFIRM PASSWORD
                        </label>


                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            disabled={loading}
                            placeholder="Confirm new password"
                            className={`
                                w-full rounded-xl bg-white px-4 py-3
                                text-sm font-medium text-slate-800
                                outline-none transition
                                ${errors.confirmPassword
                                    ? "border-2 border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    : "border border-slate-200 focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                                }
                            `}
                        />


                        {errors.confirmPassword && (

                            <p className="mt-1.5 text-xs font-medium text-red-500">
                                {errors.confirmPassword}
                            </p>

                        )}

                    </div>


                    {/* RESET BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#193260] hover:bg-[#13274d] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 text-sm shadow-md transition cursor-pointer mt-2"
                    >

                        {loading
                            ? "Resetting..."
                            : "Reset password"
                        }

                    </button>


                    {/* BACK TO LOGIN */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                        disabled={loading}
                        className="w-full text-sm font-semibold text-[#193260] hover:underline cursor-pointer disabled:opacity-50"
                    >
                        Back to sign in
                    </button>

                </form>

            </div>

        </div>
    );
};


export default ResetPassword;