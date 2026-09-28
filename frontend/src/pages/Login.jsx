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
    const [email, setEmail] = useState("admin@dotsquares.com");
    const [password, setPassword] = useState("");
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            showError(
                "Missing Information",
                "Please enter your email and password."
            );
            return;
        }
        try {
            setLoading(true);
            showLoading(
                "Sending verification code..."
            );
            const result = await loginAdmin(
                email,
                password
            );
            closeAlert();
            if (result.success) {
                sessionStorage.setItem(
                    "loginEmail",
                    email
                );
                sessionStorage.setItem(
                    "keepSignedIn",
                    keepSignedIn.toString()
                );
                navigate("/verify-otp");
            }
        } catch (error) {
            closeAlert();
            const message =
                error.response?.data?.message ||
                "Unable to sign in. Please try again.";
            showError(
                "Sign in failed",
                message
            );
        } finally {
            setLoading(false);
        }
    };

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
                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            EMAIL ADDRESS
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                            disabled={loading}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            PASSWORD
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                            disabled={loading}
                            placeholder="Enter your password"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                        />
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
                            ? "Sending code..."
                            : "Sign in"
                        }
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;