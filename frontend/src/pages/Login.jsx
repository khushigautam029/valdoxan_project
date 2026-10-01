import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginAdmin } from "../services/authService.js";

import {
    closeAlert,
    showError,
    showLoading
} from "../utils/sweetAlert.js";

const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] =
        useState("admin@dotsquares.com");

    const [password, setPassword] =
        useState("");

    const [keepSignedIn, setKeepSignedIn] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [errors, setErrors] =
        useState({
            email: "",
            password: ""
        });

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
    // Password validation
    // -----------------------------
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

    // -----------------------------
    // Email change
    // -----------------------------
    const handleEmailChange = (e) => {

        const value = e.target.value;

        setEmail(value);

        setErrors((previous) => ({
            ...previous,
            email: validateEmail(value)
        }));
    };

    // -----------------------------
    // Password change
    // -----------------------------
    const handlePasswordChange = (e) => {

        const value = e.target.value;

        setPassword(value);

        setErrors((previous) => ({
            ...previous,
            password: validatePassword(value)
        }));
    };

    // -----------------------------
    // Submit
    // -----------------------------
    const handleSubmit = async (e) => {

        e.preventDefault();

        const emailError =
            validateEmail(email);

        const passwordError =
            validatePassword(password);

        setErrors({
            email: emailError,
            password: passwordError
        });

        if (emailError || passwordError) {
            return;
        }

        try {

            setLoading(true);

            showLoading(
                "Signing in..."
            );

            const result = await loginAdmin(
                email.trim(),
                password
            );

            closeAlert();

            if (result.success) {

                const token = result.data.token;
                const user = result.data.user;

                localStorage.removeItem("token");
                localStorage.removeItem("user");
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");

                const storage = keepSignedIn
                    ? localStorage
                    : sessionStorage;
                storage.setItem("token", token);
                storage.setItem("user", JSON.stringify(user));

                // Navigate to Dashboard
                navigate("/dashboard");
            }

        } catch (error) {

            closeAlert();

            const message =
                error.response?.data?.message ||
                "Unable to sign in. Please try again.";

            if (error.response?.status === 400) {

                const backendErrors =
                    error.response?.data?.errors;

                if (Array.isArray(backendErrors)) {

                    const newErrors = {
                        email: "",
                        password: ""
                    };

                    backendErrors.forEach((item) => {

                        if (item.field === "email") {
                            newErrors.email = item.message;
                        }

                        if (item.field === "password") {
                            newErrors.password = item.message;
                        }
                    });

                    setErrors(newErrors);

                    return;
                }
            }

            showError(
                "Sign in failed",
                message
            );

        } finally {

            setLoading(false);
        }
    };

    // -----------------------------
    // Forgot password
    // -----------------------------
    const handleForgotPassword = (e) => {

        e.preventDefault();

        showError(
            "Not Available",
            "Forgot password functionality has not been implemented yet."
        );
    };

    return (

        <div className="min-h-screen w-full bg-[#f3f5f9] flex flex-col items-center justify-center p-4">

            {/* Brand Logo Header */}

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


            {/* Login Card */}

            <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-100">

                <div className="mb-6">

                    <h2 className="text-xl font-bold text-slate-900">
                        Admin sign in
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                        MyValdoxan content & notifications console.
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
                            className={`
                                w-full rounded-xl bg-white px-4 py-3
                                text-sm font-medium text-slate-800
                                outline-none transition
                                ${errors.email
                                    ? "border-2 border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    : "border border-slate-200 focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                                }
                            `}
                        />

                        {errors.email && (

                            <p className="mt-1.5 text-xs font-medium text-red-500">
                                {errors.email}
                            </p>

                        )}

                    </div>


                    {/* PASSWORD */}

                    <div>

                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            PASSWORD
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            disabled={loading}
                            placeholder="Enter your password"
                            className={`
                                w-full rounded-xl bg-white px-4 py-3
                                text-sm font-medium text-slate-800
                                outline-none transition
                                ${errors.password
                                    ? "border-2 border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                    : "border border-slate-200 focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                                }
                            `}
                        />

                        {errors.password && (

                            <p className="mt-1.5 text-xs font-medium text-red-500">
                                {errors.password}
                            </p>

                        )}

                    </div>


                    {/* Keep signed in */}

                    <div className="flex items-center justify-between text-xs font-medium pt-1">

                        <label className="flex items-center gap-2 cursor-pointer text-slate-600">

                            <input
                                type="checkbox"
                                checked={keepSignedIn}
                                onChange={(e) =>
                                    setKeepSignedIn(
                                        e.target.checked
                                    )
                                }
                                disabled={loading}
                                className="h-4 w-4 rounded border-slate-300 text-[#193260] focus:ring-[#193260]"
                            />

                            <span>
                                Keep me signed in
                            </span>

                        </label>


                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="font-semibold text-[#193260] hover:underline"
                        >
                            Forgot password?
                        </button>

                    </div>


                    {/* Sign In */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#193260] hover:bg-[#13274d] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 text-sm shadow-md transition cursor-pointer mt-2"
                    >

                        {loading
                            ? "Signing in..."
                            : "Sign in"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
};

export default Login;
