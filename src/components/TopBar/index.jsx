import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import fetchModel from '../../lib/fetchModelData';

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy userId từ URL và fetch dữ liệu người dùng
  const path = location.pathname;
  let userId = null;
  if (path.startsWith('/users/') || path.startsWith('/photos/')) {
    userId = path.split('/')[2]; // Lấy userId từ URL
  }

  useEffect(() => {
    if (userId) {
      setLoading(true);
      const fetchUser = async () => {
        try {
          const userData = await fetchModel(`/api/user/${userId}`);
          setUser(userData);
          setLoading(false);
        } catch (err) {
          setError('Không thể tải thông tin người dùng');
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [userId]);

  // Xác định ngữ cảnh dựa trên URL
  let context = '';
  if (loading) {
    context = 'Đang tải...';
  } else if (error) {
    context = error;
  } else if (user) {
    if (path.startsWith('/users/')) {
      context = `${user.first_name} ${user.last_name}`; // Hiển thị tên người dùng
    } else if (path.startsWith('/photos/')) {
      context = `Photos of ${user.first_name} ${user.last_name}`; // Hiển thị "Photos of [tên]"
    }
  }

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        {/* Bên trái: Tên của bạn */}
        <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
          [Đinh Công Thịnh]
        </Typography>
        {/* Bên phải: Ngữ cảnh */}
        <Typography variant="h6" color="inherit">
          {context}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;