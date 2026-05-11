const ACCESS_KEY_STORAGE = "promo_gen_access_key";

export function getAccessKey() {
  return window.localStorage.getItem(ACCESS_KEY_STORAGE) ?? "";
}

export function setAccessKey(accessKey) {
  window.localStorage.setItem(ACCESS_KEY_STORAGE, accessKey);
}

export function clearAccessKey() {
  window.localStorage.removeItem(ACCESS_KEY_STORAGE);
}

export function accessHeaders() {
  const accessKey = getAccessKey();
  return accessKey ? { "X-App-Access-Key": accessKey } : {};
}
