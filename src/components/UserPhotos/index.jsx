import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardMedia, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import models from '../../modelData/models';

function UserPhotos() {
  const { userId } = useParams();
  const photos = models.photoOfUserModel(userId);

  if (!photos || !Array.isArray(photos)) {
    return (
      <div style={{ padding: '20px' }}>
        <Typography variant="h6">No photos available for this user.</Typography>
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
              <Typography>No comments yet.</Typography>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;