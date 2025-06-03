import './App.css';

import React from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import AddPhoto from "./components/AddPhoto";
import { useAuth } from "./lib/AuthContext";

// Component bảo vệ route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = (props) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  return (
    <Router>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar />
          </Grid>
          <div className="main-topbar-buffer" />
          
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/users" replace /> : <LoginRegister />} />
            
            <Route path="/" element={<ProtectedRoute><Navigate to="/users" replace /></ProtectedRoute>} />
            
            <Route path="/users" element={
              <ProtectedRoute>
                <Grid container spacing={2}>
                  <Grid item sm={3}>
                    <Paper className="main-grid-item">
                      <UserList />
                    </Paper>
                  </Grid>
                  <Grid item sm={9}>
                    <Paper className="main-grid-item">
                      <Typography variant="h5">Chọn một người dùng từ danh sách bên trái</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </ProtectedRoute>
            } />
            
            <Route path="/users/:userId" element={
              <ProtectedRoute>
                <Grid container spacing={2}>
                  <Grid item sm={3}>
                    <Paper className="main-grid-item">
                      <UserList />
                    </Paper>
                  </Grid>
                  <Grid item sm={9}>
                    <Paper className="main-grid-item">
                      <UserDetail />
                    </Paper>
                  </Grid>
                </Grid>
              </ProtectedRoute>
            } />
            
            <Route path="/photos/:userId" element={
              <ProtectedRoute>
                <Grid container spacing={2}>
                  <Grid item sm={3}>
                    <Paper className="main-grid-item">
                      <UserList />
                    </Paper>
                  </Grid>
                  <Grid item sm={9}>
                    <Paper className="main-grid-item">
                      <UserPhotos />
                    </Paper>
                  </Grid>
                </Grid>
              </ProtectedRoute>
            } />
            
            <Route path="/photos/upload" element={
              <ProtectedRoute>
                <Grid container spacing={2}>
                  <Grid item sm={3}>
                    <Paper className="main-grid-item">
                      <UserList />
                    </Paper>
                  </Grid>
                  <Grid item sm={9}>
                    <Paper className="main-grid-item">
                      <AddPhoto />
                    </Paper>
                  </Grid>
                </Grid>
              </ProtectedRoute>
            } />
          </Routes>
        </Grid>
      </div>
    </Router>
  );
}

export default App;
