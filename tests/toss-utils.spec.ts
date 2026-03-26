import { test, expect } from "@playwright/test";
import {
  appendQueryParam,
  buildBrandpayCallbackRedirectTargets,
  buildTossCustomerKey,
  getBrandpayCustomerKeyStorageKey,
  getBrandpayRedirectUrl,
  isBrandpayCustomerKeyVerified,
  normalizeBrandpayReturnPath,
} from "../src/lib/tossUtils";

test.describe("tossUtils", () => {
  test("buildTossCustomerKey returns a stable key for the same user", () => {
    const first = buildTossCustomerKey({ userId: "User-123" });
    const second = buildTossCustomerKey({ userId: "User-123" });

    expect(first).toBe(second);
    expect(first).toMatch(/^customer_/);
    expect(first!.length).toBeLessThanOrEqual(50);
  });

  test("buildTossCustomerKey normalizes email input", () => {
    const key = buildTossCustomerKey({ email: "Test.User+tag@Example.com " });

    expect(key).toContain("email");
    expect(key).not.toContain("@");
    expect(key).not.toContain(".");
  });

  test("buildTossCustomerKey returns null when identity is missing", () => {
    expect(buildTossCustomerKey({})).toBeNull();
  });

  test("normalizeBrandpayReturnPath only allows internal paths", () => {
    expect(normalizeBrandpayReturnPath("/checkout?orderId=abc")).toBe("/checkout?orderId=abc");
    expect(normalizeBrandpayReturnPath("https://evil.example/test")).toBe("/account/payment");
    expect(normalizeBrandpayReturnPath("//evil.example/test")).toBe("/account/payment");
  });

  test("appendQueryParam preserves existing query and hash", () => {
    const nextPath = appendQueryParam("/checkout?orderId=abc#brandpay", "brandpay", "registered");

    expect(nextPath).toBe("/checkout?orderId=abc&brandpay=registered#brandpay");
  });

  test("getBrandpayRedirectUrl embeds a safe returnUrl", () => {
    const redirectUrl = getBrandpayRedirectUrl("https://www.getkkul.com", "/cart?step=payment");

    expect(redirectUrl).toBe(
      "https://www.getkkul.com/account/payment/callback?returnUrl=%2Fcart%3Fstep%3Dpayment",
    );
  });

  test("getBrandpayCustomerKeyStorageKey is stable for the same return path", () => {
    const first = getBrandpayCustomerKeyStorageKey("/checkout?orderId=abc");
    const second = getBrandpayCustomerKeyStorageKey("/checkout?orderId=abc");
    const third = getBrandpayCustomerKeyStorageKey("/account/orders");

    expect(first).toBe(second);
    expect(first).not.toBe(third);
  });

  test("isBrandpayCustomerKeyVerified only accepts exact matches", () => {
    expect(isBrandpayCustomerKeyVerified("customer_uid_user_123", "customer_uid_user_123")).toBeTruthy();
    expect(isBrandpayCustomerKeyVerified("customer_uid_user_123", "customer_uid_user_456")).toBeFalsy();
    expect(isBrandpayCustomerKeyVerified(null, "customer_uid_user_123")).toBeFalsy();
  });

  test("buildBrandpayCallbackRedirectTargets uses account-payment query flags", () => {
    const targets = buildBrandpayCallbackRedirectTargets("/account/payment?tab=cards", "실패 메시지");

    expect(targets.returnUrl).toBe("/account/payment?tab=cards");
    expect(targets.successRedirectUrl).toBe("/account/payment?tab=cards&success=true");
    expect(targets.errorRedirectUrl).toBe("/account/payment?tab=cards&error=%EC%8B%A4%ED%8C%A8+%EB%A9%94%EC%8B%9C%EC%A7%80");
  });

  test("buildBrandpayCallbackRedirectTargets uses generic brandpay flags for other paths", () => {
    const targets = buildBrandpayCallbackRedirectTargets("/checkout?step=payment", null, "timeout_error");

    expect(targets.returnUrl).toBe("/checkout?step=payment");
    expect(targets.successRedirectUrl).toBe("/checkout?step=payment&brandpay=registered");
    expect(targets.errorRedirectUrl).toBe("/checkout?step=payment&brandpayError=timeout_error");
  });
});
