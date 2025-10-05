export async function apiClient(url: string, options?: RequestInit) {
  const absoluteUrl = `${process.env.NEXT_PUBLIC_APP_URL}${url}`;

  const res = await fetch(absoluteUrl, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} - ${text}`);
  }

  // try parse json, otherwise return null
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return null;
}
