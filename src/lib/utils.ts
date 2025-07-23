import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

