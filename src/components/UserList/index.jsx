import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import models from '../../modelData/models'; // Đường dẫn đến dữ liệu giả

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const users = models.userListModel(); // Lấy danh sách người dùng từ dữ liệu giả

  return (
    <div>
      <List component="nav">
        {users.map((user) => (
          <ListItem
            key={user._id} // Sử dụng _id làm key để React phân biệt các phần tử
            component={Link} // Sử dụng Link từ react-router-dom để điều hướng
            to={`/users/${user._id}`} // Điều hướng đến trang chi tiết người dùng
          >
            <ListItemText primary={`${user.first_name} ${user.last_name}`} /> {/* Hiển thị tên đầy đủ */}
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default UserList;