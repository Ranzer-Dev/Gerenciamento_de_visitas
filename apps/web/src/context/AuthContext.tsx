import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('dengue.token');
    const storedUser = localStorage.getItem('dengue.user');

    if (storedToken && storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function signIn(token: string, userData: User) {
    localStorage.setItem('dengue.token', token);
    localStorage.setItem('dengue.user', JSON.stringify(userData));
    setUser(userData);
  }

  function signOut() {
    localStorage.removeItem('dengue.token');
    localStorage.removeItem('dengue.user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);