import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Simple hash function to replace bcrypt for browser compatibility
const simpleHash = (password) => {
  let hash = 0;
  if (password.length === 0) return hash.toString();
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('galagram_admin');
    if (storedAdmin) {
      setAdminUser(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  const adminLogin = async (username, password) => {
    try {
      // Default admin credentials
      const defaultUsername = 'galagram';
      const defaultPassword = 'admin123';

      // Check stored admin credentials
      const storedCredentials = JSON.parse(localStorage.getItem('galagram_admin_credentials') || 'null');
      let isValid = false;

      if (storedCredentials) {
        // Check against stored credentials
        const hashedPassword = simpleHash(password);
        isValid = username === storedCredentials.username && hashedPassword === storedCredentials.password;
      } else {
        // Check against default credentials
        isValid = username === defaultUsername && password === defaultPassword;
        
        // If default credentials are used, hash and store them
        if (isValid) {
          const hashedPassword = simpleHash(defaultPassword);
          localStorage.setItem('galagram_admin_credentials', JSON.stringify({
            username: defaultUsername,
            password: hashedPassword
          }));
        }
      }

      if (isValid) {
        const adminUser = {
          id: 'admin',
          username: username,
          role: 'admin',
          loginTime: new Date().toISOString()
        };
        setAdminUser(adminUser);
        localStorage.setItem('galagram_admin', JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('galagram_admin');
  };

  const changeAdminPassword = async (currentPassword, newPassword) => {
    try {
      const storedCredentials = JSON.parse(localStorage.getItem('galagram_admin_credentials') || 'null');
      if (!storedCredentials) {
        return { success: false, error: 'No stored credentials found' };
      }

      const currentHashedPassword = simpleHash(currentPassword);
      if (currentHashedPassword !== storedCredentials.password) {
        return { success: false, error: 'Current password is incorrect' };
      }

      const hashedNewPassword = simpleHash(newPassword);
      localStorage.setItem('galagram_admin_credentials', JSON.stringify({
        username: storedCredentials.username,
        password: hashedNewPassword
      }));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    adminUser,
    adminLogin,
    adminLogout,
    changeAdminPassword,
    loading
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};