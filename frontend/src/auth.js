const appAccessKey = import.meta.env.VITE_APP_ACCESS_KEY ?? "";

export function accessHeaders() {
  return appAccessKey ? { "X-App-Access-Key": appAccessKey } : {};
}
