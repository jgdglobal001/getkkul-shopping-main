import { expect, test } from "@playwright/test";
import {
  amountsMatch,
  buildTossBasicAuthHeader,
  calculateCancelPaymentAmount,
  normalizeTossAmount,
} from "../src/lib/tossPaymentValidation";

test.describe("tossPaymentValidation", () => {
  test("normalizeTossAmount returns rounded integer KRW amounts", () => {
    expect(normalizeTossAmount(29000)).toBe(29000);
    expect(normalizeTossAmount("29000")).toBe(29000);
    expect(normalizeTossAmount(28999.6)).toBe(29000);
  });

  test("normalizeTossAmount rejects invalid values", () => {
    expect(normalizeTossAmount(undefined)).toBeNull();
    expect(normalizeTossAmount(" ")).toBeNull();
    expect(normalizeTossAmount(-1)).toBeNull();
  });

  test("amountsMatch compares normalized values safely", () => {
    expect(amountsMatch(29000, "29000")).toBeTruthy();
    expect(amountsMatch(29000, 29001)).toBeFalsy();
  });

  test("calculateCancelPaymentAmount derives the deficit from round-trip shipping fee", () => {
    expect(calculateCancelPaymentAmount(3000)).toBe(3000);
    expect(calculateCancelPaymentAmount(6000)).toBe(0);
    expect(calculateCancelPaymentAmount(9000)).toBe(0);
  });

  test("buildTossBasicAuthHeader encodes the secret for basic auth", () => {
    expect(buildTossBasicAuthHeader("gsk_test_secret")).toBe(
      `Basic ${btoa("gsk_test_secret:")}`,
    );
  });
});