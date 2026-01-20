"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type CurrencyCode = "KRW" | "USD" | "CNY";

interface CurrencyContextType {
  selectedCurrency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  exchangeRates: Record<CurrencyCode, number>;
  convertPrice: (amount: number, fromCurrency?: CurrencyCode) => number;
  getCurrencySymbol: (currencyCode: CurrencyCode) => string;
  getCurrencyName: (currencyCode: CurrencyCode) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

const currencyData: Record<CurrencyCode, { symbol: string; name: string }> = {
  KRW: { symbol: "₩", name: "원화" },
  USD: { symbol: "$", name: "달러" },
  CNY: { symbol: "¥", name: "위엔화" },
};

// Mock exchange rates - in a real app, you'd fetch these from an API
const mockExchangeRates: Record<CurrencyCode, number> = {
  KRW: 1350, // 1 USD = 1350 KRW
  USD: 1,     // Base currency
  CNY: 7.2,   // 1 USD = 7.2 CNY
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Always force KRW
  const [selectedCurrency] = useState<CurrencyCode>("KRW");
  const [exchangeRates, setExchangeRates] =
    useState<Record<CurrencyCode, number>>(mockExchangeRates);

  const setCurrency = (currency: CurrencyCode) => {
    // Disabled changing currency - Force keep KRW
    // No-op or log warning
    console.warn("Currency change is disabled. Keeping KRW.");
  };

  const convertPrice = (
    amount: number,
    fromCurrency: CurrencyCode = "USD"
  ): number => {
    if (fromCurrency === selectedCurrency) return amount;

    // Convert from source currency to USD first, then to target currency
    const usdAmount = amount / exchangeRates[fromCurrency];
    const convertedAmount = usdAmount * exchangeRates[selectedCurrency];

    return convertedAmount;
  };

  const getCurrencySymbol = (currencyCode: CurrencyCode): string => {
    return currencyData[currencyCode]?.symbol || "₩";
  };

  const getCurrencyName = (currencyCode: CurrencyCode): string => {
    return currencyData[currencyCode]?.name || "원화";
  };

  // Simulate fetching exchange rates (in a real app, you'd call an API)
  useEffect(() => {
    const fetchExchangeRates = async () => {
      // In a real app, you would fetch from an API like:
      // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      // const data = await response.json();
      // setExchangeRates(data.rates);

      // For now, we'll use mock data with slight variations
      const simulatedRates = { ...mockExchangeRates };
      (Object.keys(simulatedRates) as CurrencyCode[]).forEach((currency) => {
        if (currency !== "USD") {
          // Add slight random variation to simulate real-time rates
          const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
          simulatedRates[currency] *= 1 + variation;
        }
      });
      setExchangeRates(simulatedRates);
    };

    fetchExchangeRates();
    // Update rates every 5 minutes
    const interval = setInterval(fetchExchangeRates, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const contextValue: CurrencyContextType = {
    selectedCurrency,
    setCurrency,
    exchangeRates,
    convertPrice,
    getCurrencySymbol,
    getCurrencyName,
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
