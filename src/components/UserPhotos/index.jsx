import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardMedia, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import fetchModel from '../../lib/fetchModelData';

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const photoData = await fetchModel(`/api/photo/photosOfUser/${userId}`);
        setPhotos(photoData);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải ảnh');
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [userId]);

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!photos || photos.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <Typography variant="h6">Không có ảnh nào cho người dùng này.</Typography>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {photos.map((photo) => (
        <Card key={photo._id} style={{ marginBottom: '20px' }}>
          <CardMedia
            component="img"
            src={`/images/${photo.file_name}`}
            alt="User Photo"
            style={{ maxHeight: '300px', objectFit: 'contain' }}
          />
          <Typography style={{ padding: '10px' }}>
            Created: {new Date(photo.date_time).toLocaleString()}
          </Typography>
          <div style={{ padding: '10px' }}>
            <Typography variant="h6">Comments:</Typography>
            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment) => (
                <div key={comment._id} style={{ marginTop: '10px' }}>
                  <Typography>
                    <Link
                      component={RouterLink}
                      to={`/users/${comment.user._id}`}
                    >
                      {`${comment.user.first_name} ${comment.user.last_name}`}
                    </Link>{' '}
                    on {new Date(comment.date_time).toLocaleString()}:
                  </Typography>
                  <Typography>{comment.comment}</Typography>
                </div>
              ))
            ) : (
              <Typography>Chưa có bình luận.</Typography>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;