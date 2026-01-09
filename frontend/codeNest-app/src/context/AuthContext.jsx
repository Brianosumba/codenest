import { createContext, useContext, useEffect, useState } from "react";
import API from "../API/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [needRoleSetup, setNeedsRoleSetup] = useState(false);

  //  Hämta användaren baserat på token (kan ta token som argument)
  const fetchuser = async (tokenOverride) => {
    const activeToken = tokenOverride ?? token;

    if (!activeToken) {
      setLoading(false);
      return null;
    }

    try {
      const res = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${activeToken}` },
      });

      const currentUser = res.data;
      setUser(currentUser);

      const missingRole = !currentUser.role || currentUser.role.trim() === "";
      setNeedsRoleSetup(missingRole);

      return currentUser;
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
    setNeedsRoleSetup(false);
  };
  // Logga in: spara token + hämta user med tokenFromServer (inte stale token)
  const login = async (tokenFromServer) => {
    setLoading(true);
    localStorage.setItem("token", tokenFromServer);
    setToken(tokenFromServer);

    const currentUser = await fetchuser(tokenFromServer);
    return currentUser;
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
