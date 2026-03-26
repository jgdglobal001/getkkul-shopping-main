const ROUND_TRIP_SHIPPING_FEE = 6000;

export function normalizeTossAmount(value: unknown): number | null {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : Number.NaN;

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return Math.round(parsed);
}

export function amountsMatch(expected: unknown, actual: unknown): boolean {
  const normalizedExpected = normalizeTossAmount(expected);
  const normalizedActual = normalizeTossAmount(actual);

  return normalizedExpected !== null && normalizedActual !== null && normalizedExpected === normalizedActual;
}

export function calculateCancelPaymentAmount(
  orderTotalAmount: unknown,
  shippingFee = ROUND_TRIP_SHIPPING_FEE,
) {
  const normalizedOrderTotal = normalizeTossAmount(orderTotalAmount);

  if (normalizedOrderTotal === null) {
    return null;
  }

  return Math.max(shippingFee - normalizedOrderTotal, 0);
}

export function buildTossBasicAuthHeader(secretKey: string) {
  return `Basic ${btoa(`${secretKey}:`)}`;
}

export { ROUND_TRIP_SHIPPING_FEE };