import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("admin@dotsquares.com");
    const [password, setPassword] = useState("............");
    const [keepSignedIn, setKeepSignedIn] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform authentication logic here
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen w-full bg-[#f3f5f9] flex flex-col items-center justify-center p-4">
            {/* Brand Logo Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#193260] font-serif">
                    Valdoxan<span className="text-xs align-top font-sans font-normal ml-0.5">®</span>
                </h1>
                <p className="text-xs font-semibold text-[#193260]/80 tracking-widest uppercase mt-0.5">
                    agomelatine
                </p>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-100">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Admin sign in</h2>
                    <p className="text-xs text-slate-500 mt-1">
                        MyValdoxan content & notifications console.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Address */}
                    <div>
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            EMAIL ADDRESS
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
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
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                        />
                    </div>

                    {/* Checkbox & Forgot Password Link */}
                    <div className="flex items-center justify-between text-xs font-medium pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                            <input
                                type="checkbox"
                                checked={keepSignedIn}
                                onChange={(e) => setKeepSignedIn(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-[#193260] focus:ring-[#193260]"
                            />
                            <span>Keep me signed in</span>
                        </label>

                        <a
                            href="#forgot-password"
                            className="font-semibold text-[#193260] hover:underline"
                        >
                            Forgot password?
                        </a>
                    </div>

                    {/* Sign In Primary Button (Navy Blue) */}
                    <button
                        type="submit"
                        className="w-full rounded-xl bg-[#193260] hover:bg-[#13274d] text-white font-bold py-3 text-sm shadow-md transition cursor-pointer mt-2"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;