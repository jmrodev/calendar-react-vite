import React from 'react';
import ThemeSettings from '../components/settings/ThemeSettings';
import '../styles/pages/settings.css';

const Settings = () => {
  return (
    <div className="settings-page">
      <h2>Configuración</h2>
      <div className="settings-sections">
        <section>
          <ThemeSettings />
        </section>
        {/* Otras secciones de configuración */}
      </div>
    </div>
  );
};

export default Settings; 