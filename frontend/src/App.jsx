import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import AccessCodes from "./pages/AccessCodes";
import Content from "./pages/Content";
import Dashboard from "./pages/Dashboard";
import DevicesAndUsers from "./pages/DevicesAndUsers";
import EditContent from "./pages/EditContent";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";

const App = () => {
    return (
        <BrowserRouter>

            <Routes>

                {/* Login */}
                <Route path="/login" element={<Login />} />

                {/* Admin Layout */}
                <Route element={<MainLayout />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/access-codes"
                        element={<AccessCodes />}
                    />

                    <Route
                        path="/content"
                        element={<Content />}
                    />

                    <Route
                        path="/notifications"
                        element={<Notifications />}
                    />

                    <Route path="/devices-and-users" element={<DevicesAndUsers />} />
                    <Route path="/content/edit" element={<EditContent />} />
                    <Route path="/content/new" element={<EditContent />} />

                </Route>

                {/* Default */}
                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />
            </Routes>

        </BrowserRouter>
    );
};

export default App;