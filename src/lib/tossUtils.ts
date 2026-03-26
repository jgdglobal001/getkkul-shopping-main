const TOSS_CUSTOMER_KEY_PREFIX = "customer_";
const MAX_TOSS_CUSTOMER_KEY_LENGTH = 50;
const DEFAULT_BRANDPAY_RETURN_PATH = "/account/payment";
const BRANDPAY_EXPECTED_CUSTOMER_KEY_STORAGE_PREFIX = "getkkul_brandpay_expected_customer_key:";
const BRANDPAY_EXPECTED_CUSTOMER_KEY_COOKIE_PREFIX = "getkkul_brandpay_expected_customer_key_";
const BRANDPAY_EXPECTED_CUSTOMER_KEY_COOKIE_MAX_AGE_SECONDS = 60 * 30;

type TossCustomerIdentity = {
  userId?: string | null;
  email?: string | null;
};

type SearchParamsLike = {
  get(name: string): string | null;
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

function readCookieValue(cookieSource: string, cookieName: string) {
  const prefix = `${cookieName}=`;

  for (const part of cookieSource.split(";")) {
    const normalizedPart = part.trim();
    if (!normalizedPart.startsWith(prefix)) {
      continue;
    }

    try {
      return decodeURIComponent(normalizedPart.slice(prefix.length));
    } catch {
      return normalizedPart.slice(prefix.length);
    }
  }

  return null;
}

function writeBrandpayCustomerKeyCookie(customerKey: string, returnPath?: string | null) {
  if (typeof document === "undefined" || !customerKey) {
    return;
  }

  const cookieName = getBrandpayCustomerKeyCookieName(returnPath);
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${cookieName}=${encodeURIComponent(customerKey)}; Path=/; Max-Age=${BRANDPAY_EXPECTED_CUSTOMER_KEY_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

function clearBrandpayCustomerKeyCookie(returnPath?: string | null) {
  if (typeof document === "undefined") {
    return;
  }

  const cookieName = getBrandpayCustomerKeyCookieName(returnPath);
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${cookieName}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

function readBrandpayCustomerKeyCookie(returnPath?: string | null) {
  if (typeof document === "undefined") {
    return null;
  }

  return readCookieValue(document.cookie, getBrandpayCustomerKeyCookieName(returnPath));
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

export function removeQueryParams(path: string, keys: string[]) {
  const [pathnameWithSearch, hash = ""] = path.split("#", 2);
  const [pathname, search = ""] = pathnameWithSearch.split("?", 2);
  const params = new URLSearchParams(search);

  keys.forEach((key) => params.delete(key));

  const nextSearch = params.toString();
  const nextHash = hash ? `#${hash}` : "";

  return `${pathname}${nextSearch ? `?${nextSearch}` : ""}${nextHash}`;
}

export function formatBrandpayRegistrationErrorMessage(errorMessage?: string | null) {
  const trimmed = errorMessage?.trim();

  if (!trimmed) {
    return "브랜드페이 카드 등록 중 오류가 발생했습니다. 다시 시도해주세요.";
  }

  const normalized = trimmed.toLowerCase();

  if (
    normalized === "card_registration_failed" ||
    normalized.includes("timeout") ||
    normalized.includes("bridge") ||
    normalized.includes("customertoken")
  ) {
    return "브랜드페이 등록 확인이 지연되었습니다. 현재 화면에서 다시 시도해주세요.";
  }

  if (normalized.includes("expired") || trimmed.includes("만료")) {
    return "브랜드페이 인증 정보가 만료되었습니다. 원래 화면에서 다시 시도해주세요.";
  }

  return trimmed;
}

export function readBrandpayRegistrationReturn(searchParams: SearchParamsLike) {
  if (searchParams.get("brandpay") === "registered") {
    return {
      status: "success" as const,
      message: "브랜드페이 카드 등록이 완료되었습니다. 등록한 카드로 계속 결제를 진행해주세요.",
    };
  }

  const errorMessage = searchParams.get("brandpayError");
  if (errorMessage) {
    return {
      status: "error" as const,
      message: formatBrandpayRegistrationErrorMessage(errorMessage),
    };
  }

  return {
    status: null,
    message: null,
  };
}

export function getBrandpayCustomerKeyStorageKey(returnPath?: string | null) {
  const normalizedReturnPath = normalizeBrandpayReturnPath(returnPath);

  return `${BRANDPAY_EXPECTED_CUSTOMER_KEY_STORAGE_PREFIX}${createStableHash(normalizedReturnPath)}`;
}

export function getBrandpayCustomerKeyCookieName(returnPath?: string | null) {
  const normalizedReturnPath = normalizeBrandpayReturnPath(returnPath);

  return `${BRANDPAY_EXPECTED_CUSTOMER_KEY_COOKIE_PREFIX}${createStableHash(normalizedReturnPath)}`;
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

  writeBrandpayCustomerKeyCookie(customerKey, returnPath);
}

export function readExpectedBrandpayCustomerKey(returnPath?: string | null) {
  if (typeof window === "undefined") {
    return null;
  }

  const cookieValue = readBrandpayCustomerKeyCookie(returnPath);
  if (cookieValue) {
    return cookieValue;
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

  clearBrandpayCustomerKeyCookie(returnPath);
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
