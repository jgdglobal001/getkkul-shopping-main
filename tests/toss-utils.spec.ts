import { test, expect } from "@playwright/test";
import {
  appendQueryParam,
  buildBrandpayCustomerIdentity,
  buildBrandpayCallbackRedirectTargets,
  buildTossCustomerKey,
  formatBrandpayRegistrationErrorMessage,
  getBrandpayCustomerKeyCookieName,
  getBrandpayCustomerKeyStorageKey,
  getBrandpayRedirectUrl,
  isBrandpayCustomerKeyVerified,
  normalizeBrandpayReturnPath,
  readBrandpayRegistrationReturn,
  removeQueryParams,
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

  test("buildBrandpayCustomerIdentity normalizes name and mobile phone", () => {
    expect(
      buildBrandpayCustomerIdentity({
        name: "  홍길동  ",
        mobilePhone: "010-1234-5678",
      }),
    ).toEqual({
      name: "홍길동",
      mobilePhone: "01012345678",
    });
  });

  test("buildBrandpayCustomerIdentity returns null when all fields are empty", () => {
    expect(buildBrandpayCustomerIdentity({ name: " ", mobilePhone: "-" })).toBeNull();
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

  test("removeQueryParams removes only requested parameters", () => {
    const nextPath = removeQueryParams(
      "/checkout?orderId=abc&brandpay=registered&brandpayError=timeout_error#payment",
      ["brandpay", "brandpayError"],
    );

    expect(nextPath).toBe("/checkout?orderId=abc#payment");
  });

  test("getBrandpayRedirectUrl returns clean URL without query params", () => {
    const redirectUrl = getBrandpayRedirectUrl("https://www.getkkul.com", "/cart?step=payment");

    // Must match Toss Developer Center registered URL exactly — no query parameters
    expect(redirectUrl).toBe("https://www.getkkul.com/account/payment/callback");
  });

  test("getBrandpayCustomerKeyStorageKey is stable for the same return path", () => {
    const first = getBrandpayCustomerKeyStorageKey("/checkout?orderId=abc");
    const second = getBrandpayCustomerKeyStorageKey("/checkout?orderId=abc");
    const third = getBrandpayCustomerKeyStorageKey("/account/orders");

    expect(first).toBe(second);
    expect(first).not.toBe(third);
  });

  test("getBrandpayCustomerKeyCookieName is stable and isolated by return path", () => {
    const first = getBrandpayCustomerKeyCookieName("/checkout?orderId=abc");
    const second = getBrandpayCustomerKeyCookieName("/checkout?orderId=abc");
    const third = getBrandpayCustomerKeyCookieName("/account/orders");

    expect(first).toBe(second);
    expect(first).not.toBe(third);
    expect(first).toMatch(/^getkkul_brandpay_expected_customer_key_/);
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

  test("formatBrandpayRegistrationErrorMessage normalizes timeout errors", () => {
    expect(formatBrandpayRegistrationErrorMessage("timeout_error")).toBe(
      "브랜드페이 등록 확인이 지연되었습니다. 현재 화면에서 다시 시도해주세요.",
    );
    expect(formatBrandpayRegistrationErrorMessage("[BRIDGE] customerToken timeout")).toBe(
      "브랜드페이 등록 확인이 지연되었습니다. 현재 화면에서 다시 시도해주세요.",
    );
    expect(formatBrandpayRegistrationErrorMessage("[BRIDGE] GET_PARAMETER brandpayCustomerToken timeout")).toBe(
      "브랜드페이 등록 확인이 지연되었습니다. 현재 화면에서 다시 시도해주세요.",
    );
  });

  test("readBrandpayRegistrationReturn reads success and error flags", () => {
    expect(readBrandpayRegistrationReturn(new URLSearchParams("brandpay=registered"))).toEqual({
      status: "success",
      message: "브랜드페이 카드 등록이 완료되었습니다. 등록한 카드로 계속 결제를 진행해주세요.",
    });

    expect(
      readBrandpayRegistrationReturn(new URLSearchParams("brandpayError=card_registration_failed")),
    ).toEqual({
      status: "error",
      message: "브랜드페이 등록 확인이 지연되었습니다. 현재 화면에서 다시 시도해주세요.",
    });
  });
});
