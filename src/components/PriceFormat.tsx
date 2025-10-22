"use client";
import { twMerge } from "tailwind-merge";
import { useCurrency } from "../contexts/CurrencyContext";

type CurrencyCode = "KRW" | "USD" | "CNY";

interface Props {
  amount?: number;
  className?: string;
  fromCurrency?: CurrencyCode;
}

const PriceFormat = ({ amount, className, fromCurrency = "KRW" }: Props) => {
  const { selectedCurrency, convertPrice } = useCurrency();

  if (!amount)
    return <span className={twMerge("font-medium", className)}>-</span>;

  const convertedAmount = convertPrice(amount, fromCurrency);

  // Currencies that don't use decimal places
  const noDecimalCurrencies = ["KRW", "CNY"];
  const useDecimals = !noDecimalCurrencies.includes(selectedCurrency);

  // Use Korean locale for KRW, otherwise use en-US
  const locale = selectedCurrency === "KRW" ? "ko-KR" : "en-US";

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: selectedCurrency,
    minimumFractionDigits: useDecimals ? 2 : 0,
    maximumFractionDigits: useDecimals ? 2 : 0,
  }).format(convertedAmount);

  return (
    <span className={twMerge("font-medium", className)}>{formattedPrice}</span>
  );
};

export default PriceFormat;
