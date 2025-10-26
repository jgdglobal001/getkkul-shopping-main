"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import AddressForm from "../account/AddressForm";
import { Address } from "../../../type";
import { FiPlus, FiMapPin, FiEdit2, FiCheck } from "react-icons/fi";

interface ShippingAddressSelectorProps {
  selectedAddress: Address | null;
  onAddressSelect: (address: Address | null) => void;
}

export default function ShippingAddressSelector({
  selectedAddress,
  onAddressSelect,
}: ShippingAddressSelectorProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [session?.user?.email]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);

      if (!session?.user?.email) {
        console.log("No user email available");
        setAddresses([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.profile?.addresses && Array.isArray(data.profile.addresses)) {
        const addressList = data.profile.addresses;
        setAddresses(addressList);

        // Auto-select default address or first address
        const defaultAddress = addressList.find(
          (addr: Address) => addr.isDefault
        );
        const addressToSelect = defaultAddress || addressList[0] || null;
        if (addressToSelect && !selectedAddress) {
          onAddressSelect(addressToSelect);
        }
      } else {
        console.log("No addresses found in profile");
        setAddresses([]);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address: Address) => {
    onAddressSelect(address);
    setIsExpanded(false);
  };

  const handleAddAddress = async (addressData: Address) => {
    try {
      // Remove id if it exists since we'll generate a new one
      const { id, ...addressWithoutId } = addressData;
      const newAddress = {
        ...addressWithoutId,
        id: Date.now().toString(),
      };

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          addAddress: newAddress,
        }),
      });

      if (response.ok) {
        await fetchAddresses();
        setShowAddForm(false);
        // Auto-select the newly added address
        onAddressSelect(newAddress);
      } else {
        const errorData = await response.json();
        console.error("Failed to add address:", errorData);
        alert(`Failed to add address: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Failed to add address. Please try again.");
    }
  };

  const handleEditAddress = async (addressData: Address) => {
    try {
      if (!editingAddress?.id) return;

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          updateAddress: {
            id: editingAddress.id,
            ...addressData,
          },
        }),
      });

      if (response.ok) {
        await fetchAddresses();
        setShowEditForm(false);
        setEditingAddress(null);
      } else {
        const errorData = await response.json();
        console.error("Failed to update address:", errorData);
        alert(`Failed to update address: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to update address. Please try again.");
    }
  };

  const formatAddress = (address: Address) => {
    return `${address.recipientName} | ${address.zipCode} ${address.address} ${address.detailAddress}`;
  };

  if (!session?.user) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-center text-orange-800">
          <FiMapPin className="text-orange-600 text-lg mr-2" />
          <span className="text-sm font-medium">
            {t("cart.please_sign_in_to_manage")}
          </span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <FiMapPin className="mr-2 text-theme-color" />
            {t("cart.shipping_address")}
          </h3>
          {addresses.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-theme-color hover:text-theme-color/80"
            >
              {isExpanded ? t("cart.collapse") : t("cart.change")}
            </button>
          )}
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-6">
            <FiMapPin className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">{t("cart.no_shipping_addresses")}</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-theme-color hover:bg-theme-color/90"
            >
              <FiPlus className="mr-2" />
              {t("cart.add_shipping_address")}
            </Button>
          </div>
        ) : (
          <>
            {/* Selected Address Display */}
            {selectedAddress && !isExpanded && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center mb-1">
                      <FiCheck className="text-green-600 mr-1 text-sm" />
                      <span className="text-sm font-medium text-green-800">
                        {t("cart.selected_address")}
                      </span>
                      {selectedAddress.isDefault && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {t("cart.default")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">
                      {formatAddress(selectedAddress)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Address List (when expanded) */}
            {isExpanded && (
              <div className="space-y-3">
                {addresses.map((address, index) => (
                  <div
                    key={address.id || index}
                    className={`border rounded-lg p-3 transition-all ${
                      selectedAddress?.id === address.id
                        ? "border-theme-color bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleAddressSelect(address)}
                      >
                        <div className="flex items-center mb-1">
                          {selectedAddress?.id === address.id && (
                            <FiCheck className="text-theme-color mr-2 text-sm" />
                          )}
                          {address.isDefault && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
                              {t("cart.default")}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">
                          {formatAddress(address)}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingAddress(address);
                          setShowEditForm(true);
                        }}
                        className="ml-2 p-2 text-gray-400 hover:text-theme-color hover:bg-gray-100 rounded transition-all"
                        title="주소 수정"
                      >
                        <FiEdit2 className="text-lg" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-500 hover:border-theme-color hover:text-theme-color transition-all flex items-center justify-center"
                >
                  <FiPlus className="mr-2" />
                  {t("cart.add_new_address")}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Address Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{t("cart.add_new_address")}</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <AddressForm
                onSubmit={handleAddAddress}
                onCancel={() => setShowAddForm(false)}
                loading={false}
                isEdit={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Form Modal */}
      {showEditForm && editingAddress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">주소 수정</h3>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingAddress(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <AddressForm
                address={editingAddress}
                onSubmit={handleEditAddress}
                onCancel={() => {
                  setShowEditForm(false);
                  setEditingAddress(null);
                }}
                loading={false}
                isEdit={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
