import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api.js";

import {
    closeAlert,
    showError,
    showLoading,
    showSuccess
} from "../utils/sweetAlert.js";


const VerifyOtp = () => {

    const navigate = useNavigate();


    const email =
        sessionStorage.getItem("loginEmail");


    const keepSignedIn =
        sessionStorage.getItem("keepSignedIn") === "true";


    const [otp, setOtp] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!email) {

            showError(
                "Session expired",
                "Please return to the login page and try again."
            );

            navigate("/login");

            return;
        }


        if (!/^[0-9]{6}$/.test(otp)) {

            showError(
                "Invalid OTP",
                "OTP must be exactly 6 digits."
            );

            return;
        }


        try {

            setLoading(true);

            showLoading("Verifying OTP...");


            const response = await api.post(
                "/auth/verify-otp",
                {
                    email,
                    otp
                }
            );


            closeAlert();


            if (
                response.data.success &&
                response.data.data?.token
            ) {

                const {
                    token,
                    user
                } = response.data.data;


                /*
                 * Keep me signed in:
                 *
                 * Checked → localStorage
                 * Unchecked → sessionStorage
                 */

                const storage =
                    keepSignedIn
                        ? localStorage
                        : sessionStorage;


                storage.setItem(
                    "token",
                    token
                );


                storage.setItem(
                    "user",
                    JSON.stringify(user)
                );


                sessionStorage.removeItem(
                    "loginEmail"
                );

                sessionStorage.removeItem(
                    "keepSignedIn"
                );


                await showSuccess(
                    "Login successful",
                    "Welcome to the Valdoxan Admin Portal."
                );


                navigate("/dashboard");

            }

        } catch (error) {

            closeAlert();


            const message =
                error.response?.data?.message ||
                "Invalid or expired OTP.";


            showError(
                "Verification failed",
                message
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen w-full bg-[#f3f5f9] flex flex-col items-center justify-center p-4">

            {/* Brand */}

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


            {/* OTP Card */}

            <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-100">

                <div className="mb-6">

                    <h2 className="text-xl font-bold text-slate-900">
                        Verify your login
                    </h2>


                    <p className="text-xs text-slate-500 mt-2">
                        We sent a 6-digit verification code to
                    </p>


                    <p className="text-sm font-semibold text-[#193260] mt-1">
                        {email}
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            VERIFICATION CODE
                        </label>


                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otp}
                            onChange={(e) =>
                                setOtp(
                                    e.target.value
                                        .replace(/\D/g, "")
                                )
                            }
                            disabled={loading}
                            autoFocus
                            placeholder="000000"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-lg font-bold tracking-[0.5em] text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-[#193260] hover:bg-[#13274d] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 text-sm shadow-md transition cursor-pointer"
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify & Sign in"
                        }
                    </button>


                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        disabled={loading}
                        className="w-full text-sm font-semibold text-[#193260] hover:underline"
                    >
                        Back to login
                    </button>

                </form>

            </div>

        </div>
    );
};


export default VerifyOtp;