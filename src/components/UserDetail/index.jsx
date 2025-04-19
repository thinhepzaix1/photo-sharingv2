import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import models from '../../modelData/models'; // Import dữ liệu giả

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  // Lấy userId từ URL
  const { userId } = useParams();
  // Lấy thông tin người dùng từ dữ liệu giả
  const user = models.userModel(userId);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5">{`${user.first_name} ${user.last_name}`}</Typography>
      <Typography>Location: {user.location}</Typography>
      <Typography>Description: {user.description}</Typography>
      <Typography>Occupation: {user.occupation}</Typography>
      <Link component={RouterLink} to={`/photos/${userId}`}>
        View Photos
      </Link>
    </div>
  );
}

export default UserDetail;