import { useState } from "react";
import { Header } from "./src/components/Header";
import { Footer } from "./src/components/Footer";
import { Login } from "./src/components/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Content from "./src/components/Content";
import { Toaster } from 'react-hot-toast';
import { toastConfig } from './src/config/toastConfig';

function App() {
  return (
    <Router>
      <Toaster {...toastConfig} />
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
      <div className="container">
        <Header />
        <Content />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
