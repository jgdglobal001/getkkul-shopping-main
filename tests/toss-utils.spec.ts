import { test, expect } from "@playwright/test";
import {
  appendQueryParam,
  buildTossCustomerKey,
  getBrandpayRedirectUrl,
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
});
