import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  changeMyPassword,
  deleteMyAccount,
  getMyProfile,
  updateMyProfile,
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
  "/content/add": {
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
  const profileRef = useRef(null);

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

  const currentHeader =
    routeHeaders[location.pathname] || {
      title: "Dashboard",
      subtitle: "Key application figures for the selected period",
    };

  const getInitials = (value) => {
    if (!value || !value.trim()) {
      return "AD";
    }

    const words = value.trim().split(/\s+/);

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

      const user =
        result?.data?.user ||
        result?.data ||
        result;

      setName(user?.name || "");
      setEmail(user?.email || "");
    } catch (error) {
      showError(
        "Unable to load profile",
        error.response?.data?.message ||
        "Please try again."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handleOpenProfile = () => {
    if (isProfileOpen) {
      handleCloseProfile();
      return;
    }

    setIsProfileOpen(true);
    loadProfile();
  };

  const handleCloseProfile = () => {
    if (
      profileSaving ||
      passwordSaving ||
      deletingAccount
    ) {
      return;
    }

    setIsProfileOpen(false);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        event.target.closest(".swal2-container") ||
        event.target.closest(".swal2-popup")
      ) {
        return;
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        handleCloseProfile();
      }
    };

    if (isProfileOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [
    isProfileOpen,
    profileSaving,
    passwordSaving,
    deletingAccount,
  ]);

  const handleUpdateName = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      showError(
        "Name is required",
        "Please enter your name."
      );
      return;
    }

    try {
      setProfileSaving(true);

      const result = await updateMyProfile({
        name: trimmedName,
      });

      const user =
        result?.data?.user ||
        result?.data ||
        result;

      const updatedName =
        user?.name || trimmedName;

      setName(updatedName);

      const localUser = localStorage.getItem("user");
      const sessionUser = sessionStorage.getItem("user");

      const storedUser = JSON.parse(
        localUser || sessionUser || "null"
      );

      if (storedUser) {
        storedUser.name = updatedName;

        if (localUser) {
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

      showSuccess(
        "Profile Updated",
        "Your name has been updated successfully."
      );
    } catch (error) {
      showError(
        "Unable to Update Profile",
        error.response?.data?.message ||
        "Please try again."
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!currentPassword) {
      showError(
        "Current Password Required",
        "Please enter your current password."
      );
      return;
    }

    if (!newPassword) {
      showError(
        "New Password Required",
        "Please enter a new password."
      );
      return;
    }

    if (!confirmPassword) {
      showError(
        "Confirm Password Required",
        "Please confirm your new password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showError(
        "Password Mismatch",
        "New password and confirm password must match."
      );
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

      showSuccess(
        "Password Changed",
        "Your password has been changed successfully."
      );
    } catch (error) {
      showError(
        "Unable to Change Password",
        error.response?.data?.message ||
        "Please try again."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await showConfirm(
      "Deactivate admin account?",
      "Your admin account will be deactivated and you will be logged out.",
      "Yes, Deactivate"
    );

    if (!result.isConfirmed) {
      return;
    }

    try {
      setDeletingAccount(true);

      await deleteMyAccount();

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("loginEmail");

      await showSuccess(
        "Account Deactivated",
        "Your admin account has been deactivated."
      );

      window.location.href = "/login";
    } catch (error) {
      showError(
        "Unable to Deactivate Account",
        error.response?.data?.message ||
        "Please try again."
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    const sessionUser = sessionStorage.getItem("user");

    const storedUser = JSON.parse(
      localUser || sessionUser || "null"
    );

    if (storedUser) {
      setName(storedUser.name || "");
      setEmail(storedUser.email || "");
    }
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-20 border-b border-slate-200/80 bg-white transition-all duration-300 ease-in-out ${isCollapsed ? "left-20" : "left-64"
        }`}
    >
      <div className="flex h-full items-center justify-between px-8">

        {/* Page Header */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#193260]">
            {currentHeader.title}
          </h2>

          <p className="mt-0.5 text-xs font-normal text-slate-500">
            {currentHeader.subtitle}
          </p>
        </div>

        {/* Right Side */}
        <div
          ref={profileRef}
          className="relative flex items-center gap-2"
        >

          {/* Admin Initials Circle */}
          <div
            title={name || "Admin"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#193260] text-xs font-bold text-white shadow-sm"
          >
            {getInitials(name)}
          </div>

          {/* Profile Icon */}
          <button
            type="button"
            title="Admin Profile"
            aria-label="Open admin profile"
            aria-expanded={isProfileOpen}
            onClick={handleOpenProfile}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${isProfileOpen
                ? "border-[#193260] bg-[#193260] text-white"
                : "border-slate-200 bg-white text-[#193260] hover:border-[#193260] hover:bg-slate-50"
              }`}
          >
            <span className="text-lg leading-none">
              👤
            </span>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-14 z-50 w-[420px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

              {/* Dropdown Header */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#193260] text-xs font-bold text-white">
                    {getInitials(name)}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#193260]">
                      Admin Profile
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {email || "Manage your account"}
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={handleCloseProfile}
                  disabled={
                    profileSaving ||
                    passwordSaving ||
                    deletingAccount
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ×
                </button>

              </div>

              {profileLoading ? (
                <div className="px-6 py-10 text-center text-sm text-slate-500">
                  Loading profile...
                </div>
              ) : (
                <div className="max-h-[calc(100vh-120px)] overflow-y-auto">

                  <div className="space-y-6 px-5 py-5">

                    {/* Profile Details */}
                    <section>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-slate-800">
                          Profile Details
                        </h4>

                        <p className="mt-1 text-xs text-slate-500">
                          Update your admin profile information.
                        </p>
                      </div>

                      <form onSubmit={handleUpdateName}>

                        <label className="mb-2 block text-xs font-semibold text-slate-700">
                          Name
                        </label>

                        <input
                          type="text"
                          value={name}
                          onChange={(event) =>
                            setName(event.target.value)
                          }
                          disabled={profileSaving}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260] disabled:cursor-not-allowed disabled:bg-slate-100"
                        />

                        <label className="mb-2 mt-4 block text-xs font-semibold text-slate-700">
                          Email
                        </label>

                        <input
                          type="email"
                          value={email}
                          disabled
                          readOnly
                          className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500"
                        />

                        <button
                          type="submit"
                          disabled={profileSaving}
                          className="mt-4 rounded-lg bg-[#193260] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#12264b] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {profileSaving
                            ? "Saving..."
                            : "Save Changes"}
                        </button>

                      </form>

                    </section>

                    {/* Change Password */}
                    <section className="border-t border-slate-200 pt-5">

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-slate-800">
                          Change Password
                        </h4>

                        <p className="mt-1 text-xs text-slate-500">
                          Keep your administrator account secure.
                        </p>
                      </div>

                      <form
                        onSubmit={handleChangePassword}
                        className="space-y-4"
                      >

                        <div>
                          <label className="mb-2 block text-xs font-semibold text-slate-700">
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
                            disabled={passwordSaving}
                            autoComplete="current-password"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260] disabled:cursor-not-allowed disabled:bg-slate-100"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold text-slate-700">
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
                            disabled={passwordSaving}
                            autoComplete="new-password"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260] disabled:cursor-not-allowed disabled:bg-slate-100"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold text-slate-700">
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
                            disabled={passwordSaving}
                            autoComplete="new-password"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#193260] focus:ring-1 focus:ring-[#193260] disabled:cursor-not-allowed disabled:bg-slate-100"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={passwordSaving}
                          className="rounded-lg bg-[#193260] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#12264b] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {passwordSaving
                            ? "Changing..."
                            : "Change Password"}
                        </button>

                      </form>

                    </section>

                    {/* Delete Account */}
                    <section className="border-t border-red-100 pt-5">

                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        disabled={deletingAccount}
                        className="mt-1 rounded-lg border border-red-200 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingAccount
                          ? "Deactivating..."
                          : "Delete Account"}
                      </button>

                    </section>

                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;