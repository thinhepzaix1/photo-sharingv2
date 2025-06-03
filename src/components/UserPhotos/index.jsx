import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardMedia,
  Typography,
  Link,
  TextField,
  Button,
  Box,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import fetchModel from '../../lib/fetchModelData';
import { useAuth } from '../../lib/AuthContext';

function UserPhotos() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const photoData = await fetchModel(`/api/photo/photosOfUser/${userId}`);
        setPhotos(photoData);

        // Khởi tạo state cho form bình luận
        const initialComments = {};
        photoData.forEach(photo => {
          initialComments[photo._id] = '';
        });
        setComments(initialComments);

        setLoading(false);
      } catch (err) {
        setError('Không thể tải ảnh');
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [userId]);

  // Xử lý thay đổi nội dung bình luận
  const handleCommentChange = (photoId, value) => {
    setComments(prev => ({
      ...prev,
      [photoId]: value
    }));
  };

  // Xử lý gửi bình luận
  const handleSubmitComment = async (photoId) => {
    if (!comments[photoId].trim()) return;

    setSubmitting(prev => ({ ...prev, [photoId]: true }));

    try {
      const newComment = await fetchModel(`/api/comment/commentsOfPhoto/${photoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: comments[photoId] }),
      });

      // Cập nhật danh sách ảnh với bình luận mới
      setPhotos(prevPhotos =>
        prevPhotos.map(photo => {
          if (photo._id === photoId) {
            return {
              ...photo,
              comments: [...photo.comments, newComment]
            };
          }
          return photo;
        })
      );

      // Xóa nội dung form bình luận
      setComments(prev => ({
        ...prev,
        [photoId]: ''
      }));
    } catch (err) {
      console.error('Lỗi khi thêm bình luận:', err);
    } finally {
      setSubmitting(prev => ({ ...prev, [photoId]: false }));
    }
  };

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
            src={`http://localhost:8081/images/${photo.file_name}  `}
            alt="User Photo"
            style={{ maxHeight: '300px', objectFit: 'contain' }}

          />
          <Typography style={{ padding: '10px' }}>
            Đăng lúc: {new Date(photo.date_time).toLocaleString()}
          </Typography>
          <Divider />
          <div style={{ padding: '10px' }}>
            <Typography variant="h6">Bình luận:</Typography>
            {photo.comments && photo.comments.length > 0 ? (
              photo.comments.map((comment) => {
                return (
                  <div key={comment._id} style={{ marginTop: '10px' }}>
                    <Typography>
                      {comment.user && comment.user._id && (comment.user.first_name || comment.user.last_name) ? (
                        <Link component={RouterLink} to={`/users/${comment.user._id}`}>
                          {`${comment.user.first_name || ''} ${comment.user.last_name || ''}`.trim() || 'Người dùng không tên'}
                        </Link>
                      ) : (
                        'Người dùng không xác định'
                      )}{' '}
                      lúc {new Date(comment.date_time).toLocaleString()}:
                    </Typography>
                    <Typography>{comment.comment}</Typography>
                  </div>
                );
              })
            ) : (
              <Typography>Chưa có bình luận.</Typography>
            )}

            {/* Form thêm bình luận */}
            <Box
              component="form"
              sx={{ mt: 3, display: 'flex', alignItems: 'flex-start' }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitComment(photo._id);
              }}
            >
              <TextField
                fullWidth
                label="Thêm bình luận"
                multiline
                rows={2}
                value={comments[photo._id] || ''}
                onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                disabled={submitting[photo._id]}
                sx={{ mr: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!comments[photo._id]?.trim() || submitting[photo._id]}
                sx={{ mt: 1 }}
              >
                Gửi
              </Button>
            </Box>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;