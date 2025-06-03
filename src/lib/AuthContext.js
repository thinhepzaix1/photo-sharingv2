import React, { createContext, useState, useEffect, useContext } from 'react';
import fetchModel from './fetchModelData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra nếu người dùng đã đăng nhập khi khởi động ứng dụng
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await fetchModel('/api/admin/current');
        setUser(userData);
      } catch (error) {
        // Người dùng không đăng nhập hoặc phiên hết hạn
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Hàm đăng nhập
  const login = async (loginName, password) => {
    try {
      const userData = await fetchModel('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login_name: loginName, password }),
      });
      setUser(userData);
      return { success: true,user: userData };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Đăng nhập thất bại. Vui lòng thử lại.',
      };
    }
  };

  // Hàm đăng xuất
  const logout = async () => {
    try {
      await fetchModel('/api/admin/logout', {
        method: 'POST',
      });
      setUser(null);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Đăng xuất thất bại. Vui lòng thử lại.',
      };
    }
  };

  // Hàm đăng ký
  const register = async (userData) => {
    try {
      const response = await fetchModel('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Đăng ký thất bại. Vui lòng thử lại.',
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);