import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { forgotPassword } from "../services/authService.js";

import {
    closeAlert,
    showError,
    showLoading
} from "../utils/sweetAlert.js";

const ForgotPassword = () => {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [submitted, setSubmitted] =
        useState(false);


    // -----------------------------
    // Email validation
    // -----------------------------
    const validateEmail = (value) => {

        const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;

        if (!value.trim()) {
            return "Email address is required.";
        }

        if (!emailRegex.test(value.trim())) {
            return "Please enter a valid email address.";
        }

        return "";
    };


    // -----------------------------
    // Email change
    // -----------------------------
    const handleEmailChange = (e) => {

        const value = e.target.value;

        setEmail(value);

        if (error) {
            setError(validateEmail(value));
        }
    };


    // -----------------------------
    // Submit
    // -----------------------------
    const handleSubmit = async (e) => {

        e.preventDefault();

        const emailError =
            validateEmail(email);

        setError(emailError);

        if (emailError) {
            return;
        }

        try {

            setLoading(true);

            showLoading(
                "Sending reset link..."
            );

            const result =
                await forgotPassword(
                    email.trim()
                );

            closeAlert();

            if (result.success) {
                setSubmitted(true);
            }

        } catch (error) {

            closeAlert();

            const message =
                error.response?.data?.message ||
                "Unable to send reset link. Please try again.";

            showError(
                "Request failed",
                message
            );

        } finally {

            setLoading(false);
        }
    };


    // -----------------------------
    // Success screen
    // -----------------------------
    if (submitted) {

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
                            Check your email
                        </h2>

                        <p className="text-sm text-slate-500 mt-3 leading-6">
                            If an account exists with this email,
                            a password reset link has been sent.
                        </p>


                        <p className="text-xs text-slate-400 mt-3">
                            The reset link will expire in 15 minutes.
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


            {/* Forgot Password Card */}

            <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-100">

                <div className="mb-6">

                    <h2 className="text-xl font-bold text-slate-900">
                        Forgot password?
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                        Enter your email address and we'll send you
                        a link to reset your password.
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* EMAIL */}

                    <div>

                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            EMAIL ADDRESS
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            disabled={loading}
                            placeholder="Enter your email address"
                            className={`
                                w-full rounded-xl bg-white px-4 py-3
                                text-sm font-medium text-slate-800
                                outline-none transition
                                ${error
                                    ? "border-2 border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    : "border border-slate-200 focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                                }
                            `}
                        />

                        {error && (

                            <p className="mt-1.5 text-xs font-medium text-red-500">
                                {error}
                            </p>

                        )}

                    </div>


                    {/* Submit */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#193260] hover:bg-[#13274d] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 text-sm shadow-md transition cursor-pointer"
                    >

                        {loading
                            ? "Sending..."
                            : "Send reset link"
                        }

                    </button>


                    {/* Back to Login */}

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

export default ForgotPassword;