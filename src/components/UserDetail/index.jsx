import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import fetchModel from '../../lib/fetchModelData';

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, [userId]);

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

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