import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const API_URL = 'http://127.0.0.1:8000';

export async function getRandomYear() {
  const response = await fetch(`${API_URL}/random_year`);
  const data = await response.json();
  return data.year;
}

export async function getAlbumsFromYear(year: number) {
  try {
    const response = await fetch(`${API_URL}/album_from_year/${year}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.album || [];  // Ensure it returns an array
  } catch (error) {
    console.error("Failed to fetch music:", error);
    return [];  // Return an empty array on error
  }
}

export async function getInventionsFromYear(year: number) {
  try {
    const response = await fetch(`${API_URL}/invention_from_year/${year}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.invention || '';  // Ensure it returns a string
  } catch (error) {
    console.error("Failed to fetch invention:", error);
    return '';  // Return an empty string on error
  }
}

export async function getEventsFromYear(year: number) {
  try {
    const response = await fetch(`${API_URL}/event_from_year/${year}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.event || [];  // Ensure it returns an array
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];  // Return an empty array on error
  }
}

export async function getMoviesFromYear(year: number) {
  try {
    const response = await fetch(`${API_URL}/movie_from_year/${year}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.movie || [];  // Ensure it returns an array
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return [];  // Return an empty array on error
  }
}