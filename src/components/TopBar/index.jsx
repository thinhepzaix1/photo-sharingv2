import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import models from '../../modelData/models'; // Import dữ liệu giả

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const location = useLocation(); // Lấy thông tin đường dẫn hiện tại
  let context = '';

  // Xác định ngữ cảnh dựa trên URL
  const path = location.pathname;
  if (path.startsWith('/users/')) {
    const userId = path.split('/')[2]; // Lấy userId từ URL
    const user = models.userModel(userId); // Lấy thông tin người dùng
    context = `${user.first_name} ${user.last_name}`; // Hiển thị tên người dùng
  } else if (path.startsWith('/photos/')) {
    const userId = path.split('/')[2];
    const user = models.userModel(userId);
    context = `Photos of ${user.first_name} ${user.last_name}`; // Hiển thị "Photos of [tên]"
  }

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        {/* Bên trái: Tên của bạn */}
        <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
          [Đinh Công Thịnh] {/* Thay bằng tên thật của bạn, ví dụ: Phạm Ngọc Duy */}
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