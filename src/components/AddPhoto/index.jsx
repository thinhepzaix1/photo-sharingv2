import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../lib/AuthContext';
import fetchModel from '../../lib/fetchModelData';

function AddPhoto() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Xử lý khi chọn file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      setFile(null);
      setPreview('');
      return;
    }
    
    // Kiểm tra loại file
    if (!selectedFile.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh');
      setFile(null);
      setPreview('');
      return;
    }
    
    setFile(selectedFile);
    setError('');
    
    // Tạo URL xem trước
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
    
    // Cleanup URL khi component unmount
    return () => URL.revokeObjectURL(previewUrl);
  };

  // Xử lý khi tải ảnh lên
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Vui lòng chọn một ảnh để tải lên');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Tạo FormData
      const formData = new FormData();
      formData.append('photo', file);
      
      // Tải ảnh lên
      const response = await fetch('http://localhost:8081/api/photo/new', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi tải ảnh lên');
      }
      
      const uploadedPhoto = await response.json();
      
      // Chuyển hướng đến trang ảnh của người dùng
      navigate(`/photos/${user._id}`);
    } catch (error) {
      setError(error.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Thêm ảnh mới
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box component="form" onSubmit={handleUpload}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-photo-button"
          type="file"
          onChange={handleFileChange}
        />
        
        <label htmlFor="upload-photo-button">
          <Button
            variant="contained"
            component="span"
            fullWidth
            sx={{ mb: 2 }}
          >
            Chọn ảnh
          </Button>
        </label>
        
        {preview && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>
              Xem trước:
            </Typography>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '300px',
                objectFit: 'contain' 
              }} 
            />
          </Box>
        )}
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!file || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Tải ảnh lên'}
        </Button>
      </Box>
    </Paper>
  );
}

export default AddPhoto;