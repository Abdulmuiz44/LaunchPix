export function getAppUrl(request?: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.URL || process.env.DEPLOY_PRIME_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (request) {
    const url = new URL(request.url);
    return url.origin.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

export function buildAppUrl(path: string, request?: Request) {
  const baseUrl = getAppUrl(request);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
