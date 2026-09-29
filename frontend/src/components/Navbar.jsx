import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  changeMyPassword,
  deleteMyAccount,
  getMyProfile,
  updateMyProfile
} from "../services/profileService.js";

import {
  showConfirm,
  showError,
  showSuccess,
} from "../utils/sweetAlert";

const routeHeaders = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Key application figures for the selected period",
  },
  "/access-codes": {
    title: "Access codes",
    subtitle: "Manage codes used to access application features",
  },
  "/content": {
    title: "Content management",
    subtitle: "Manage application content, articles, and media",
  },
  "/content/edit": {
    title: "Edit Content",
    subtitle: "Modify article details, category, and publication status",
  },
  "/content/new": {
    title: "New Content",
    subtitle: "Create and publish a new content article",
  },
  "/notifications": {
    title: "Push notifications",
    subtitle: "Compose and dispatch broadcast messages to users",
  },
};

const Navbar = ({ isCollapsed }) => {
  const location = useLocation();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const currentHeader = routeHeaders[location.pathname] || {
    title: "Dashboard",
    subtitle: "Key application figures for the selected period",
  };

  const getInitials = (value) => {
    if (!value) {
      return "AD";
    }

    const words = value.trim().split(" ");

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const loadProfile = async () => {
    try {
      setProfileLoading(true);

      const result = await getMyProfile();

      const user = result.data?.user || result.data;

      setName(user?.name || "");
      setEmail(user?.email || "");
    } catch (error) {
      showError(
        error.response?.data?.message ||
          "Unable to load profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handleOpenProfile = () => {
    setIsProfileOpen(true);
    loadProfile();
  };

  const handleCloseProfile = () => {
    if (profileSaving || passwordSaving || deletingAccount) {
      return;
    }

    setIsProfileOpen(false);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleUpdateName = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      showError("Name is required");
      return;
    }

    try {
      setProfileSaving(true);

      const result = await updateMyProfile({
        name: name.trim(),
      });

      const user = result.data?.user || result.data;

      setName(user?.name || name.trim());

      const storedUser = JSON.parse(
        localStorage.getItem("user") ||
          sessionStorage.getItem("user") ||
          "null"
      );

      if (storedUser) {
        storedUser.name = user?.name || name.trim();

        if (localStorage.getItem("user")) {
          localStorage.setItem(
            "user",
            JSON.stringify(storedUser)
          );
        } else {
          sessionStorage.setItem(
            "user",
            JSON.stringify(storedUser)
          );
        }
      }

      showSuccess("Name updated successfully");
    } catch (error) {
      showError(
        error.response?.data?.message ||
          "Unable to update name"
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!currentPassword) {
      showError("Current password is required");
      return;
    }

    if (!newPassword) {
      showError("New password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("New password and confirm password must match");
      return;
    }

    try {
      setPasswordSaving(true);

      await changeMyPassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      showSuccess("Password changed successfully");
    } catch (error) {
      showError(
        error.response?.data?.message ||
          "Unable to change password"
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await showConfirm(
      "Delete admin account?",
      "This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingAccount(true);

      await deleteMyAccount();

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      window.location.href = "/login";
    } catch (error) {
      showError(
        error.response?.data?.message ||
          "Unable to delete account"
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("user") || "null") ||
      JSON.parse(sessionStorage.getItem("user") || "null");

    if (storedUser) {
      setName(storedUser.name || "");
      setEmail(storedUser.email || "");
    }
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 right-0 z-30 h-20 border-b border-slate-200/80 bg-white transition-all duration-300 ease-in-out ${
          isCollapsed ? "left-20" : "left-64"
        }`}
      >
        <div className="flex h-full items-center justify-between px-8">

          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#193260]">
              {currentHeader.title}
            </h2>

            <p className="mt-0.5 text-xs font-normal text-slate-500">
              {currentHeader.subtitle}
            </p>
          </div>

          <div className="flex items-center">

            <button
              type="button"
              title={name || "Admin Profile"}
              onClick={handleOpenProfile}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#193260] text-xs font-bold text-white shadow-sm transition hover:bg-[#12264b]"
            >
              {getInitials(name)}
            </button>

          </div>
        </div>
      </header>

      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>
                <h3 className="text-lg font-bold text-[#193260]">
                  Admin Profile
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Manage your profile and account security
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseProfile}
                className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>

            </div>

            {profileLoading ? (
              <div className="px-6 py-12 text-center text-sm text-slate-500">
                Loading profile...
              </div>
            ) : (
              <div className="space-y-7 px-6 py-6">

                {/* Profile */}
                <section>

                  <div className="mb-5 flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#193260] text-sm font-bold text-white">
                      {getInitials(name)}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        {name || "Admin User"}
                      </p>

                      <p className="text-sm text-slate-500">
                        {email}
                      </p>
                    </div>

                  </div>

                  <form onSubmit={handleUpdateName}>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Name
                    </label>

                    <input
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                    />

                    <label className="mb-2 mt-4 block text-sm font-medium text-slate-700">
                      Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500"
                    />

                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="mt-4 rounded-lg bg-[#193260] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12264b] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {profileSaving
                        ? "Saving..."
                        : "Save Name"}
                    </button>

                  </form>

                </section>

                {/* Change Password */}
                <section className="border-t border-slate-200 pt-6">

                  <h4 className="mb-4 text-base font-semibold text-slate-800">
                    Change Password
                  </h4>

                  <form
                    onSubmit={handleChangePassword}
                    className="space-y-4"
                  >

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Current Password
                      </label>

                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(event) =>
                          setCurrentPassword(
                            event.target.value
                          )
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        New Password
                      </label>

                      <input
                        type="password"
                        value={newPassword}
                        onChange={(event) =>
                          setNewPassword(
                            event.target.value
                          )
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Confirm New Password
                      </label>

                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(
                            event.target.value
                          )
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#193260] focus:ring-1 focus:ring-[#193260]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={passwordSaving}
                      className="rounded-lg bg-[#193260] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12264b] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {passwordSaving
                        ? "Changing..."
                        : "Change Password"}
                    </button>

                  </form>

                </section>

                {/* Delete Account */}
                <section className="border-t border-red-100 pt-6">

                  <h4 className="text-base font-semibold text-red-600">
                    Delete Account
                  </h4>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Permanently delete your admin account. This
                    action cannot be undone.
                  </p>

                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                    className="mt-4 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingAccount
                      ? "Deleting..."
                      : "Delete Account"}
                  </button>

                </section>

              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;