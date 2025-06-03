import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import fetchModel from '../../lib/fetchModelData';

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [pageUser, setPageUser] = useState(null);
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
          setPageUser(userData);
          setLoading(false);
        } catch (err) {
          setError('Không thể tải thông tin người dùng');
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [userId]);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  // Xử lý thêm ảnh mới
  const handleAddPhoto = () => {
    navigate('/photos/upload');
  };

  // Xác định ngữ cảnh dựa trên URL
  let context = '';
  if (loading) {
    context = 'Đang tải...';
  } else if (error) {
    context = error;
  } else if (pageUser) {
    if (path.startsWith('/users/')) {
      context = `${pageUser.first_name} ${pageUser.last_name}`; // Hiển thị tên người dùng
    } else if (path.startsWith('/photos/')) {
      context = `Photos of ${pageUser.first_name} ${pageUser.last_name}`; // Hiển thị "Photos of [tên]"
    }
  }

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        {/* Bên trái: Tên của bạn */}
        <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
          [Đinh Công Thịnh]
        </Typography>
        
        {/* Phần giữa: Ngữ cảnh */}
        <Typography variant="h6" color="inherit" style={{ flexGrow: 1, textAlign: 'center' }}>
          {context}
        </Typography>
        
        {/* Bên phải: Thông tin đăng nhập/đăng xuất */}
        <Box>
          {user ? (
            <>
              <Typography variant="subtitle1" component="span" style={{ marginRight: 16 }}>
                Xin chào, {user.first_name}
              </Typography>
              <Button 
                color="inherit" 
                variant="outlined" 
                onClick={handleAddPhoto}
                style={{ marginRight: 8 }}
              >
                Thêm ảnh
              </Button>
              <Button color="inherit" variant="outlined" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <Typography variant="subtitle1">
              Vui lòng đăng nhập
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;