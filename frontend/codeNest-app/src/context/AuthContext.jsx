import { createContext, useContext, useEffect, useState } from "react";
import API from "../API/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [needRoleSetup, setNeedsRoleSetup] = useState(false);

  //  Hämta användaren baserat på token
  const fetchuser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);

      // Kolla om användaren saknar roll
      if (!res.data.role || res.data.role.trim() === "") {
        setNeedsRoleSetup(true);
      } else {
        setNeedsRoleSetup(false);
      }
    } catch (err) {
      console.error("Auth fetch failed", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  //  Logga ut
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  //  Logga in & hämta användaren
  const login = async (tokenFromServer) => {
    localStorage.setItem("token", tokenFromServer);
    setToken(tokenFromServer);
    await fetchuser();
  };

  useEffect(() => {
    fetchuser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        logout,
        loading,
        needRoleSetup,
        setNeedsRoleSetup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook för att använda auth
export const useAuth = () => useContext(AuthContext);
