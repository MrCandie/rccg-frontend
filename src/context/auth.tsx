import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";

type User = Record<string, any>;

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  token: string;
  updateUser: (userData: User) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  async function updateUser(userData: User) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  const login = async (userData: User, token: string) => {
    try {
      setUser(userData);
      setIsAuthenticated(true);
      setToken(token);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", JSON.stringify(token));
    } catch (error) {
      console.error("Failed to log in:", error);
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
      setToken("");

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("restaurant");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          setToken(storedToken ? JSON.parse(storedToken) : "");
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        loading,
        login,
        logout,
        token,
        updateUser,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
