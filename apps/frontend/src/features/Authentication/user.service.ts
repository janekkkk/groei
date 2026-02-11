import type { User } from "@groei/common/src/models/User.ts";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetch user by email address
 * @param email - User email address
 * @returns User object or null if not found
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  if (!email || !API_URL) {
    throw new Error("Email and API URL are required");
  }

  try {
    const response = await fetch(
      `${API_URL}/user/${encodeURIComponent(email)}`,
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch user: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

/**
 * Check if a user exists by email
 * @param email - User email address
 * @returns true if user exists, false otherwise
 */
export const userExists = async (email: string): Promise<boolean> => {
  try {
    const user = await getUserByEmail(email);
    return user !== null;
  } catch {
    return false;
  }
};
