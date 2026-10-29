// src/context/AuthProvider.tsx

import type { AuthContextType } from "@/interfaces";
import type { IUser, LoginResponseDto } from "@e-pocket-assignment/shared/interfaces";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<IUser | null>(
    () => (localStorage.getItem("user") ? (JSON.parse(localStorage.getItem("user") as string) as IUser) : null)
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem("accessToken") ? true : false
  );
  const setAuthContext = (loginResponseDto: LoginResponseDto) => {
    const {accessToken, refreshToken, ...user} = loginResponseDto;
    localStorage.setItem(`user`, JSON.stringify(user));
    localStorage.setItem(`accessToken`, accessToken);
    localStorage.setItem(`refreshToken`, refreshToken);
  }
  const signInSuccessHandler = (loginResponseDto: LoginResponseDto) => {
    if(loginResponseDto) {
      const {accessToken, ...user} = loginResponseDto;
      setAuthContext(loginResponseDto);
      setIsAuthenticated(true);
      setUser(user);
    }
  };

  const signOutSuccessHandler = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!isAuthenticated,
        signInSuccessHandler,
        signOutSuccessHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};