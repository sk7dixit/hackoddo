export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  employeeId?: string;
  token?: string;
  departmentId?: string;
  designation?: string;
  reportingManager?: string;
  officeLocation?: string;
}

class AuthStore {
  private key = "assetflow_session";

  getUser(): UserSession | null {
    const data = localStorage.getItem(this.key);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing session data:", e);
      return null;
    }
  }

  setUser(user: UserSession): void {
    localStorage.setItem(this.key, JSON.stringify(user));
  }

  clearUser(): void {
    localStorage.removeItem(this.key);
  }

  isAuthenticated(): boolean {
    return this.getUser() !== null;
  }
}

export const authStore = new AuthStore();
export default authStore;
