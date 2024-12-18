import { useState } from "react";
import { Header } from "./src/components/Header";
import { Footer } from "./src/components/Footer";
import { Login } from "./src/components/Login";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Content from "./src/components/Content";
import { Toaster } from 'react-hot-toast';
import { toastConfig } from './src/config/toastConfig';
import { useSelector } from 'react-redux';

function App() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <Router>
      <Toaster {...toastConfig} />
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
    </Router>
  );
}

export default App;
