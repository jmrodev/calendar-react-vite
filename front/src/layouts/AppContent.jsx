import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import {Header} from "./Header";
import {Footer} from "./Footer";
import {Login} from "../pages/Login";
import {Content} from "./Content";

export const AppContent = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <div className="container">
      <Header />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route 
          path="/" 
          element={isAuthenticated ? <Content /> : <Navigate to="/login" />} 
        />
      </Routes>
      <Footer />
    </div>
  );
};

