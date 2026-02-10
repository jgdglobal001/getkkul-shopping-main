"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

interface ProfileEditFormProps {
  profile: {
    name: string;
    email: string;
    phone: string;
    image: string;
  };
  onSubmit: (updatedProfile: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ProfileEditForm({
  profile,
  onSubmit,
  onCancel,
  loading = false,
}: ProfileEditFormProps) {
  const { t } = useTranslation("translation", { keyPrefix: "account" });
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    image: profile?.image || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user is using OAuth (no password needed) - can be detected by checking if they have an image from provider
  const isOAuthUser =
    session?.user?.image?.includes("googleusercontent") ||
    session?.user?.image?.includes("github") ||
    false;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);
      formDataUpload.append("email", formData.email);

      const res = await fetch("/api/user/upload-image", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.imageUrl }));
      } else {
        setErrors((prev) => ({
          ...prev,
          image: data.error || "Failed to upload image",
        }));
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, image: "Failed to upload image" }));
    } finally {
      setImageUploading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("name_required");
    }
    if (!formData.email.trim()) {
      newErrors.email = t("email_required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("valid_email");
    }
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = t("valid_phone");
    }

    // Password validation (only if trying to update password)
    if (
      showPasswordSection ||
      formData.newPassword ||
      formData.currentPassword
    ) {
      if (!isOAuthUser && !formData.currentPassword.trim()) {
        newErrors.currentPassword = t("current_password_required");
      }

      if (formData.newPassword) {
        if (formData.newPassword.length < 6) {
          newErrors.newPassword = t("password_min_length");
        }

        if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = t("passwords_do_not_match");
        }
      }

      if (formData.confirmPassword && !formData.newPassword) {
        newErrors.newPassword = t("new_password_required");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image Section */}
      <div className="text-center">
        <div className="relative inline-block shrink-0">
          {formData.image ? (
            <Image
              src={formData.image}
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full object-cover border-4 border-gray-200"
              unoptimized
            />
          ) : (
            <div className="w-[120px] h-[120px] bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">{t("no_image")}</span>
            </div>
          )}
          {imageUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <svg
                className="animate-spin h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                ></circle>
                <path
                  fill="currentColor"
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
        </div>

        <div className="mt-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={imageUploading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            {imageUploading ? t("uploading") : t("change_picture")}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            {t("file_format_note")}
          </p>
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("full_name")} *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color ${errors.name ? "border-red-500" : "border-gray-300"
            }`}
          placeholder={t("enter_full_name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("email_address")}
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
          disabled
          readOnly
        />
        <p className="text-sm text-gray-500 mt-1">{t("email_cannot_be_changed")}</p>
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("phone_number")}
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color ${errors.phone ? "border-red-500" : "border-gray-300"
            }`}
          placeholder={t("enter_phone_number")}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Password Section */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {t("password_settings")}
          </h3>
          <button
            type="button"
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            {showPasswordSection ? t("cancel") : t("change_password")}
          </button>
        </div>

        {showPasswordSection && (
          <div className="space-y-4">
            {isOAuthUser && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">{t("oauth_user")}</span> {t("oauth_description")}
                </p>
              </div>
            )}

            {!isOAuthUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("current_password")} *
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color ${errors.currentPassword
                    ? "border-red-500"
                    : "border-gray-300"
                    }`}
                  placeholder={t("enter_current_password")}
                />
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.currentPassword}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("new_password")} *
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color ${errors.newPassword ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder={t("enter_new_password")}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("confirm_new_password")} *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-color ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder={t("confirm_new_password_placeholder")}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          {t("cancel")}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-theme-color text-white rounded-md hover:bg-theme-color/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                ></circle>
                <path
                  fill="currentColor"
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("updating")}
            </span>
          ) : (
            t("update_profile")
          )}
        </button>
      </div>
    </form>
  );
}
