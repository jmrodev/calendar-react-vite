import React from "react";
import { Aside } from "./Aside";
import { Main } from "./Main";
import { AppContent } from "./AppContent";
import { Header } from "./Header";
import { Footer } from "./Footer";
import "./styles/appointments.css";

const Appointments = () => {
  return (
    <div className="page-container">
      <h1>Gestión de Citas</h1>
      <AppContent />
    </div>
  );
};

export default Appointments;
