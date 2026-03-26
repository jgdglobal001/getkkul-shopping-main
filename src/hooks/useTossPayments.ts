"use client";

import { useEffect, useRef, useState } from "react";

export type TossPaymentsMethodWidget = {
  destroy?: () => void | Promise<void>;
};

export type TossPaymentsAgreementWidget = {
  destroy?: () => void | Promise<void>;
};

export type TossPaymentsWidgetsInstance = {
  setAmount: (options: { value: number; currency: string }) => Promise<void>;
  renderPaymentMethods: (options: { selector: string; variantKey: string }) => Promise<TossPaymentsMethodWidget>;
  renderAgreement: (options: { selector: string; variantKey?: string }) => Promise<TossPaymentsAgreementWidget>;
  requestPayment: (options: {
    orderId: string;
    orderName: string;
    successUrl: string;
    failUrl: string;
    customerEmail?: string;
    customerName?: string;
  }) => Promise<void>;
};

export type TossPaymentsBrandpayInstance = {
  addPaymentMethod: () => Promise<void>;
  openSettings: () => Promise<void>;
};

export type TossPaymentsFactory = (clientKey: string) => {
  widgets: (options: { customerKey: string; brandpay?: { redirectUrl: string } }) => TossPaymentsWidgetsInstance;
  brandpay: (options: { customerKey: string; redirectUrl: string }) => TossPaymentsBrandpayInstance;
};

type TossPaymentsWindowLike = Window & typeof globalThis & {
  TossPayments?: unknown;
};

const SDK_LOAD_ERROR_MESSAGE =
  "Toss Payments SDK를 불러오지 못했습니다. 페이지를 새로고침한 뒤 다시 시도해주세요.";

export function getTossPaymentsFactoryFromWindow(target?: TossPaymentsWindowLike | null) {
  const candidate = target?.TossPayments;

  return typeof candidate === "function" ? (candidate as TossPaymentsFactory) : null;
}

function getTossPaymentsWindow() {
  return typeof window !== "undefined" ? (window as TossPaymentsWindowLike) : undefined;
}

export function useTossPaymentsReady(timeoutMs = 10000, pollIntervalMs = 100) {
  const [isReady, setIsReady] = useState(() =>
    Boolean(getTossPaymentsFactoryFromWindow(getTossPaymentsWindow())),
  );
  const [sdkError, setSdkError] = useState<string | null>(null);

  // Stable ref for the factory – avoids returning a new reference on every render
  const factoryRef = useRef<TossPaymentsFactory | null>(
    getTossPaymentsFactoryFromWindow(getTossPaymentsWindow()),
  );

  useEffect(() => {
    const browserWindow = getTossPaymentsWindow();
    if (!browserWindow) return;

    const existingFactory = getTossPaymentsFactoryFromWindow(browserWindow);
    if (existingFactory) {
      factoryRef.current = existingFactory;
      setIsReady(true);
      setSdkError(null);
      return;
    }

    let active = true;
    const startedAt = Date.now();

    const checkSdk = () => {
      if (!active) return true;

      const factory = getTossPaymentsFactoryFromWindow(browserWindow);
      if (factory) {
        factoryRef.current = factory;
        setIsReady(true);
        setSdkError(null);
        return true;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        setSdkError((current) => current ?? SDK_LOAD_ERROR_MESSAGE);
      }

      return false;
    };

    const intervalId = browserWindow.setInterval(() => {
      if (checkSdk()) {
        browserWindow.clearInterval(intervalId);
      }
    }, pollIntervalMs);

    const handleWindowLoad = () => {
      if (checkSdk()) {
        browserWindow.clearInterval(intervalId);
      }
    };

    browserWindow.addEventListener("load", handleWindowLoad);

    return () => {
      active = false;
      browserWindow.clearInterval(intervalId);
      browserWindow.removeEventListener("load", handleWindowLoad);
    };
  }, [pollIntervalMs, timeoutMs]);

  return {
    isReady,
    sdkError,
    /** Stable reference – same object identity as long as the underlying SDK doesn't change */
    tossPaymentsFactory: factoryRef.current,
  };
}