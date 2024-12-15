import { useState } from "react";
import { Header } from "./src/components/header";
import { Footer } from "./src/components/footer";
import { Login } from "./src/components/login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Content from "./src/components/Content";

function App() {
  return (
    <Router>
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
