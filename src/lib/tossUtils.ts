const TOSS_CUSTOMER_KEY_PREFIX = "customer_";
const MAX_TOSS_CUSTOMER_KEY_LENGTH = 50;
const DEFAULT_BRANDPAY_RETURN_PATH = "/account/payment";
const BRANDPAY_EXPECTED_CUSTOMER_KEY_STORAGE_PREFIX = "getkkul_brandpay_expected_customer_key:";

type TossCustomerIdentity = {
  userId?: string | null;
  email?: string | null;
};

function createStableHash(value: string) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

function sanitizeCustomerFragment(value: string) {
  return value
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function buildTossCustomerKey({ userId, email }: TossCustomerIdentity) {
  const trimmedUserId = userId?.trim();
  const trimmedEmail = email?.trim().toLowerCase();
  const sourceType = trimmedUserId ? "uid" : trimmedEmail ? "email" : null;
  const sourceValue = trimmedUserId || trimmedEmail;

  if (!sourceType || !sourceValue) {
    return null;
  }

  const sanitized = sanitizeCustomerFragment(sourceValue) || "user";
  const hash = createStableHash(`${sourceType}:${sourceValue}`);
  const reservedLength = `${TOSS_CUSTOMER_KEY_PREFIX}${sourceType}_`.length + hash.length + 1;
  const baseLength = Math.max(MAX_TOSS_CUSTOMER_KEY_LENGTH - reservedLength, 1);
  const base = sanitized.slice(0, baseLength);

  return `${TOSS_CUSTOMER_KEY_PREFIX}${sourceType}_${base}_${hash}`;
}

export function normalizeBrandpayReturnPath(
  returnPath?: string | null,
  fallback = DEFAULT_BRANDPAY_RETURN_PATH,
) {
  if (!returnPath) {
    return fallback;
  }

  const trimmed = returnPath.trim();

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  return trimmed;
}

export function appendQueryParam(path: string, key: string, value: string) {
  const [pathnameWithSearch, hash = ""] = path.split("#", 2);
  const [pathname, search = ""] = pathnameWithSearch.split("?", 2);
  const params = new URLSearchParams(search);

  params.set(key, value);

  const nextSearch = params.toString();
  const nextHash = hash ? `#${hash}` : "";

  return `${pathname}${nextSearch ? `?${nextSearch}` : ""}${nextHash}`;
}

export function getBrandpayCustomerKeyStorageKey(returnPath?: string | null) {
  const normalizedReturnPath = normalizeBrandpayReturnPath(returnPath);

  return `${BRANDPAY_EXPECTED_CUSTOMER_KEY_STORAGE_PREFIX}${createStableHash(normalizedReturnPath)}`;
}

export function persistExpectedBrandpayCustomerKey(customerKey: string, returnPath?: string | null) {
  if (!customerKey || typeof window === "undefined") {
    return;
  }

  const storageKey = getBrandpayCustomerKeyStorageKey(returnPath);

  try {
    window.sessionStorage.setItem(storageKey, customerKey);
  } catch {
    // ignore storage failures
  }

  try {
    window.localStorage.setItem(storageKey, customerKey);
  } catch {
    // ignore storage failures
  }
}

export function readExpectedBrandpayCustomerKey(returnPath?: string | null) {
  if (typeof window === "undefined") {
    return null;
  }

  const storageKey = getBrandpayCustomerKeyStorageKey(returnPath);

  try {
    const sessionValue = window.sessionStorage.getItem(storageKey);
    if (sessionValue) {
      return sessionValue;
    }
  } catch {
    // ignore storage failures
  }

  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

export function clearExpectedBrandpayCustomerKey(returnPath?: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey = getBrandpayCustomerKeyStorageKey(returnPath);

  try {
    window.sessionStorage.removeItem(storageKey);
  } catch {
    // ignore storage failures
  }

  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // ignore storage failures
  }
}

export function isBrandpayCustomerKeyVerified(
  expectedCustomerKey?: string | null,
  callbackCustomerKey?: string | null,
) {
  return Boolean(expectedCustomerKey && callbackCustomerKey && expectedCustomerKey === callbackCustomerKey);
}

export function buildBrandpayCallbackRedirectTargets(
  returnPath?: string | null,
  errorMessage?: string | null,
  errorCode?: string | null,
) {
  const returnUrl = normalizeBrandpayReturnPath(returnPath);

  return {
    returnUrl,
    successRedirectUrl: returnUrl.startsWith("/account/payment")
      ? appendQueryParam(returnUrl, "success", "true")
      : appendQueryParam(returnUrl, "brandpay", "registered"),
    errorRedirectUrl: returnUrl.startsWith("/account/payment")
      ? appendQueryParam(returnUrl, "error", errorMessage || errorCode || "카드 등록에 실패했습니다.")
      : appendQueryParam(returnUrl, "brandpayError", errorMessage || errorCode || "card_registration_failed"),
  };
}

export function getBrandpayRedirectUrl(origin: string, returnPath?: string | null) {
  const normalizedReturnPath = normalizeBrandpayReturnPath(returnPath);
  const url = new URL("/account/payment/callback", origin);

  url.searchParams.set("returnUrl", normalizedReturnPath);

  return url.toString();
}
