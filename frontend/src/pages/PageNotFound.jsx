import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center">
                <h1 className="text-8xl font-bold text-gray-800">
                    404
                </h1>

                <h2 className="mt-4 text-2xl font-semibold text-gray-700">
                    Page Not Found
                </h2>

                <p className="mt-2 text-gray-500">
                    Sorry, the page you are looking for does not exist.
                </p>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default PageNotFound;
