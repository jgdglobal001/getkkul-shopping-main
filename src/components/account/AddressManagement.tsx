"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import AddressForm from "./AddressForm";
import { getCountryByCode } from "./countryData";
import { Address } from "../../../type";

interface AddressManagementProps {

  addresses: Address[];
  onAddressesChange: (addresses: Address[]) => void;
}

export default function AddressManagement({
  addresses: initialAddresses,
  onAddressesChange,
}: AddressManagementProps) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sidebar states
  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [showEditSidebar, setShowEditSidebar] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  useEffect(() => {
    setAddresses(initialAddresses);
  }, [initialAddresses]);

  const showMessage = (message: string, isError: boolean = false) => {
    if (isError) {
      setError(message);
      setSuccess("");
    } else {
      setSuccess(message);
      setError("");
    }
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 3000);
  };

  const handleSetDefault = async (index: number) => {
    if (!session?.user?.email) return;

    setLoading(true);
    try {
      const updatedAddresses = addresses.map((addr, i) => ({
        ...addr,
        isDefault: i === index,
      }));

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          address: updatedAddresses,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAddresses(updatedAddresses);
        onAddressesChange(updatedAddresses);
        showMessage(t("account.default_address_updated"));
      } else {
        showMessage(data.error || t("account.failed_to_update_default"), true);
      }
    } catch (err) {
      showMessage(t("account.failed_to_update_default"), true);
    }
    setLoading(false);
  };

  const handleAddAddress = async (newAddress: Address) => {
    if (!session?.user?.email) return;

    setLoading(true);
    try {
      const addressToAdd = {
        ...newAddress,
        isDefault: addresses.length === 0 ? true : newAddress.isDefault,
      };

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          addAddress: addressToAdd,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses);
        onAddressesChange(data.addresses);
        setShowAddSidebar(false);
        showMessage(t("account.address_added"));
      } else {
        showMessage(data.error || t("account.failed_to_add_address"), true);
      }
    } catch (err) {
      showMessage(t("account.failed_to_add_address"), true);
    }
    setLoading(false);
  };

  const handleEditAddress = async (updatedAddress: Address) => {
    if (!session?.user?.email) return;

    setLoading(true);
    try {
      const updatedAddresses = [...addresses];
      updatedAddresses[editingIndex] = updatedAddress;

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          address: updatedAddresses,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAddresses(updatedAddresses);
        onAddressesChange(updatedAddresses);
        setShowEditSidebar(false);
        setEditingAddress(null);
        setEditingIndex(-1);
        showMessage(t("account.address_updated"));
      } else {
        showMessage(data.error || t("account.failed_to_update_address"), true);
      }
    } catch (err) {
      showMessage(t("account.failed_to_update_address"), true);
    }
    setLoading(false);
  };

  const handleDeleteAddress = async (index: number) => {
    if (!session?.user?.email) return;

    if (!confirm(t("account.delete_address_confirm"))) return;

    setLoading(true);
    try {
      const res = await fetch("/api/user/delete-address", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          addressIndex: index,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAddresses(data.addresses);
        onAddressesChange(data.addresses);
        showMessage(t("account.address_deleted"));
      } else {
        showMessage(data.error || t("account.failed_to_delete_address"), true);
      }
    } catch (err) {
      showMessage(t("account.failed_to_delete_address"), true);
    }
    setLoading(false);
  };

  const openEditSidebar = (address: Address, index: number) => {
    setEditingAddress(address);
    setEditingIndex(index);
    setShowEditSidebar(true);
  };

  const closeSidebars = () => {
    setShowAddSidebar(false);
    setShowEditSidebar(false);
    setEditingAddress(null);
    setEditingIndex(-1);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">{t("account.manage_addresses")}</h2>
            <p className="text-gray-500 text-sm">{t("account.manage_addresses_desc")}</p>
          </div>
          <button
            onClick={() => setShowAddSidebar(true)}
            className="px-4 py-2 bg-theme-color text-white rounded-md hover:bg-theme-color/90 transition-colors"
          >
            {t("account.add_new_address")}
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Address List */}
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="space-y-3">
                <div className="text-4xl">📍</div>
                <h3 className="text-lg font-medium text-gray-900">
                  {t("account.no_addresses")}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {t("account.no_addresses_desc")}
                </p>
                <button
                  onClick={() => setShowAddSidebar(true)}
                  className="inline-block mt-4 px-6 py-2 bg-theme-color text-white rounded-md hover:bg-theme-color/90 transition-colors"
                >
                  {t("account.add_first_address")}
                </button>
              </div>
            </div>
          ) : (
            addresses.map((address, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {address.isDefault && (
                      <span className="inline-block bg-theme-color text-white px-2 py-1 rounded text-xs font-medium mb-3">
                        {t("account.default_address")}
                      </span>
                    )}
                    <div className="text-gray-900">
                      <p className="font-semibold text-base mb-1">
                        {address.recipientName} ({address.phone})
                      </p>
                      <p className="text-gray-700">
                        {address.address}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {address.detailAddress}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        [{address.zipCode}]
                      </p>
                      {address.deliveryRequest && (
                        <p className="text-gray-400 text-xs mt-2 italic">
                          {t("account.delivery_request")}: {address.deliveryRequest}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-6">
                    <button
                      onClick={() => openEditSidebar(address, index)}
                      className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      {t("common.edit")}
                    </button>
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(index)}
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100 disabled:opacity-50 transition-colors"
                      >
                        {t("account.set_as_default")}
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAddress(index)}
                      disabled={loading}
                      className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 disabled:opacity-50 transition-colors"
                    >
                      {t("common.delete")}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Address Sidebar */}
      <Sidebar
        isOpen={showAddSidebar}
        onClose={closeSidebars}
        title={t("account.add_new_address")}
        width="w-96"
      >
        <AddressForm
          onSubmit={handleAddAddress}
          onCancel={closeSidebars}
          loading={loading}
          showSetDefault={addresses.length > 0}
        />
      </Sidebar>

      {/* Edit Address Sidebar */}
      <Sidebar
        isOpen={showEditSidebar}
        onClose={closeSidebars}
        title={t("account.edit_address")}
        width="w-96"
      >
        {editingAddress && (
          <AddressForm
            address={editingAddress}
            onSubmit={handleEditAddress}
            onCancel={closeSidebars}
            loading={loading}
            isEdit={true}
            showSetDefault={false}
          />
        )}
      </Sidebar>
    </>
  );
}
