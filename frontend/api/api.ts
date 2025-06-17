import Constants from "expo-constants";

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
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API Error");
  return data;
};
