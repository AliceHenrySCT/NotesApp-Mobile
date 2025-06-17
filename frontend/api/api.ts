import Constants from "expo-constants";

// Use either .env or app.json's "extra" field for your base URL
const API_BASE_URL =
  Constants?.manifest?.extra?.API_BASE_URL ||
  Constants?.expoConfig?.extra?.API_BASE_URL ||
  "http://10.0.0.59:5000/api";

export const api = async (
  endpoint: string,
  method: string = "GET",
  body?: any,
  token?: string
) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  try {
    const res = await fetch(url, options);

    // Always read as text first for debugging
    const text = await res.text();
    console.log(`API response from [${url}] status ${res.status}:\n${text}`);

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error(
        `Non-JSON response from API!\nStatus: ${res.status}\nURL: ${url}\nResponse:\n${text}`
      );
    }

    if (!res.ok) throw new Error(data.message || "API Error");
    return data;
  } catch (error: any) {
    // This catches fetch errors (network etc.)
    throw new Error(
      `Network or API error: ${error.message || error.toString()}`
    );
  }
};
