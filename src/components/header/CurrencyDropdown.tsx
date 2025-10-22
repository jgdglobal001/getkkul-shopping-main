"use client";
import { useState, useRef, useEffect } from "react";
import { IoChevronDownSharp } from "react-icons/io5";
import { FiCheck } from "react-icons/fi";
import { useCurrency } from "../../contexts/CurrencyContext";
import CurrencyNotification from "../notifications/CurrencyNotification";

type CurrencyCode = "KRW" | "USD" | "CNY";

const currencies: {
  code: CurrencyCode;
  name: string;
  symbol: string;
  region?: string;
}[] = [
  { code: "KRW", name: "원화", symbol: "₩", region: "Korea" },
  { code: "USD", name: "달러", symbol: "$", region: "Global" },
  { code: "CNY", name: "위엔화", symbol: "¥", region: "China" },
];

const CurrencyDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    name: "",
    symbol: "",
    code: "",
  });
  const { selectedCurrency, setCurrency } = useCurrency();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCurrencySelect = (currency: {
    code: CurrencyCode;
    name: string;
    symbol: string;
    region?: string;
  }) => {
    // Don't show notification if selecting the same currency
    if (currency.code === selectedCurrency) {
      setIsOpen(false);
      return;
    }

    setCurrency(currency.code);
    setIsOpen(false);

    // Show custom notification
    setNotificationData({
      name: currency.name,
      symbol: currency.symbol,
      code: currency.code,
    });
    setShowNotification(true);
  };

  const currentCurrency =
    currencies.find((c) => c.code === selectedCurrency) || currencies[0];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="headerTopMenu cursor-pointer hover:text-orange-300 transition-colors flex items-center gap-1"
      >
        <span className="hidden sm:inline">{currentCurrency.symbol}</span>
        <span>{currentCurrency.code}</span>
        <IoChevronDownSharp
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 z-50 py-2"
          style={{ backdropFilter: "blur(8px)" }}
        >
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencySelect(currency)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between transition-colors ${
                currency.region === "Korea"
                  ? "border-l-2 border-l-blue-500 bg-blue-50/30"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium text-gray-700">
                  {currency.symbol}
                </span>
                <div>
                  <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    {currency.code}
                    {currency.region === "Korea" && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                        기본
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-900">{currency.name}</div>
                </div>
              </div>
              {selectedCurrency === currency.code && (
                <FiCheck className="text-theme-color text-sm" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Custom Currency Notification */}
      <CurrencyNotification
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        currencyName={notificationData.name}
        currencySymbol={notificationData.symbol}
        currencyCode={notificationData.code}
      />
    </div>
  );
};

export default CurrencyDropdown;
