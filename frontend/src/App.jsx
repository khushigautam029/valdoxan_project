import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import AccessCodes from "./pages/AccessCodes";
import AddContent from "./pages/AddContent";
import Content from "./pages/Content";
import Dashboard from "./pages/Dashboard";
import DevicesAndUsers from "./pages/DevicesAndUsers";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import PageNotFound from "./pages/PageNotFound";
import ResetPassword from "./pages/ResetPassword";

const RequireAuth = () => {
    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />}/>
                <Route path="/reset-password/:token" element={<ResetPassword />}/>
                <Route element={<RequireAuth />}>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/access-codes" element={<AccessCodes />} />
                        <Route path="/content" element={<Content />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/devices-and-users" element={<DevicesAndUsers />} />
                        <Route path="/content/add" element={<AddContent />} />
                        <Route path="/content/new" element={<AddContent />} />
                        <Route path="/content/edit/:id" element={<AddContent />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
