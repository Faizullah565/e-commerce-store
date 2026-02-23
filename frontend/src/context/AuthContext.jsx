import { createContext, useContext, useEffect, useState } from "react";
import { getToken, getUser, removeUser, saveToken, saveUser } from "../utils/storedData";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);

  //======= LOAD TOKEN ON REFRESH ==============
  useEffect(() => {
    const savedToken = getToken("auth-token");
    const savedUser = getUser("user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(savedUser);
  }, []);

  // ==========USER LOGIN ===================
  const login = (data) => {
    //========== SET TOKEN ==========================
    let token = data?.data?.token
    saveToken("auth-token", token);
    //========== SET USER ==========================
    let user = data?.data?.user
    saveUser("user", user)
    //========== GET TOKEN ==========================
    setToken(getToken("auth-token"));
    //========== GETT USER ==========================
    setUser(getUser("user"));
  };

  // ========= UPDATE LOGIN USER PROFILE ==========
  const updateProfile = (data) => {
    removeUser("user");
    let user = data?.data;
    saveUser("user", user);
    setUser(getUser("user"));
  };
  
  // ========= LOGOUT USER AND CLEAR LOCALSTORAGE ============
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);