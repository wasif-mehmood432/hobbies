import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind merge utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get user IP using ipify
export async function getUserIP(): Promise<string | null> {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch (error) {
    console.error("IP fetch failed:", error);
    return null;
  }
}

// Geocode postal code using OpenStreetMap API
export async function geocodePostalCode(postalCode: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postalCode)}&country=Denmark&format=json&limit=1&accept-language=da`
  );

  const data = await response.json();

  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  }

  return null;
}

// Handle contact click and store IP + timestamp in localStorage
export async function handleContactClick(serviceId: string) {
  const ip = await getUserIP();
  if (!ip || !serviceId) return;

  const clicked = JSON.parse(localStorage.getItem("contactedServices") || "{}");
  clicked[serviceId] = { ip, timestamp: Date.now() };
  localStorage.setItem("contactedServices", JSON.stringify(clicked));
}
