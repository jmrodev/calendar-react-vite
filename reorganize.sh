#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Directorio base
BASE_DIR="front/src"

echo -e "${BLUE}Creando nueva estructura de directorios...${NC}"

# Crear estructura de directorios
mkdir -p "$BASE_DIR/components/appointments"
mkdir -p "$BASE_DIR/components/common"
mkdir -p "$BASE_DIR/components/ui"
mkdir -p "$BASE_DIR/layouts"
mkdir -p "$BASE_DIR/pages"
mkdir -p "$BASE_DIR/styles/components/appointments"
mkdir -p "$BASE_DIR/styles/components/common"
mkdir -p "$BASE_DIR/styles/layouts"
mkdir -p "$BASE_DIR/styles/pages"

echo -e "${GREEN}Directorios creados exitosamente${NC}"

echo -e "${BLUE}Moviendo archivos...${NC}"

# Mover componentes de appointments
mv "$BASE_DIR/components/AppointmentList.jsx" "$BASE_DIR/components/appointments/"
mv "$BASE_DIR/components/Calendar.jsx" "$BASE_DIR/components/appointments/"
mv "$BASE_DIR/components/DayView.jsx" "$BASE_DIR/components/appointments/"
mv "$BASE_DIR/components/Week.jsx" "$BASE_DIR/components/appointments/"
mv "$BASE_DIR/components/AppointmentForm.jsx" "$BASE_DIR/components/appointments/"

# Mover layouts
mv "$BASE_DIR/components/Header.jsx" "$BASE_DIR/layouts/"
mv "$BASE_DIR/components/Footer.jsx" "$BASE_DIR/layouts/"
mv "$BASE_DIR/components/Navbar.jsx" "$BASE_DIR/layouts/"
mv "$BASE_DIR/components/ProtectedLayout.jsx" "$BASE_DIR/layouts/"

# Mover páginas
mv "$BASE_DIR/components/Dashboard.jsx" "$BASE_DIR/pages/"
mv "$BASE_DIR/components/Login.jsx" "$BASE_DIR/pages/"
mv "$BASE_DIR/components/Appointments.jsx" "$BASE_DIR/pages/"
mv "$BASE_DIR/components/Profile.jsx" "$BASE_DIR/pages/"
mv "$BASE_DIR/components/Doctors.jsx" "$BASE_DIR/pages/"
mv "$BASE_DIR/components/Patients.jsx" "$BASE_DIR/pages/"
mv "$BASE_DIR/components/Settings.jsx" "$BASE_DIR/pages/"
mv "$BASE_DIR/components/UnauthorizedPage.jsx" "$BASE_DIR/pages/"

# Mover componentes comunes
mv "$BASE_DIR/messages/ErrorMessage.jsx" "$BASE_DIR/components/common/"
mv "$BASE_DIR/messages/styles/errorMessage.css" "$BASE_DIR/styles/components/common/"

# Mover estilos
mv "$BASE_DIR/components/styles/header.css" "$BASE_DIR/styles/layouts/"
mv "$BASE_DIR/components/styles/footer.css" "$BASE_DIR/styles/layouts/"
mv "$BASE_DIR/components/styles/navbar.css" "$BASE_DIR/styles/layouts/"
mv "$BASE_DIR/components/styles/calendar.css" "$BASE_DIR/styles/components/appointments/"
mv "$BASE_DIR/components/styles/dayView.css" "$BASE_DIR/styles/components/appointments/"
mv "$BASE_DIR/components/styles/appointmentForm.css" "$BASE_DIR/styles/components/appointments/"
mv "$BASE_DIR/components/styles/appointmentList.css" "$BASE_DIR/styles/components/appointments/"

# Mover y renombrar estilos de páginas
mv "$BASE_DIR/components/styles/dashboard.css" "$BASE_DIR/styles/pages/"
mv "$BASE_DIR/components/styles/login.css" "$BASE_DIR/styles/pages/"
mv "$BASE_DIR/components/styles/appointments.css" "$BASE_DIR/styles/pages/"
mv "$BASE_DIR/components/styles/profile.css" "$BASE_DIR/styles/pages/"
mv "$BASE_DIR/components/styles/unauthorized.css" "$BASE_DIR/styles/pages/unauthorizedPage.css"

echo -e "${GREEN}Archivos movidos exitosamente${NC}"

# Actualizar importaciones
echo -e "${BLUE}Actualizando importaciones...${NC}"

# Función para actualizar importaciones en un archivo
update_imports() {
    local file=$1
    sed -i 's|from "../components/|from "../components/appointments/|g' "$file"
    sed -i 's|from "./components/|from "./components/appointments/|g' "$file"
    sed -i 's|from "../../messages/ErrorMessage"|from "../../components/common/ErrorMessage"|g' "$file"
    sed -i 's|from "../messages/ErrorMessage"|from "../components/common/ErrorMessage"|g' "$file"
    sed -i 's|import "./styles/|import "../styles/pages/|g' "$file"
    sed -i 's|import "../styles/|import "../../styles/components/appointments/|g' "$file"
}

# Actualizar importaciones en todos los archivos
find "$BASE_DIR" -type f -name "*.jsx" -exec bash -c 'update_imports "$0"' {} \;

echo -e "${GREEN}Reorganización completada exitosamente${NC}"

# Eliminar directorios vacíos antiguos
rm -rf "$BASE_DIR/components/styles"
rm -rf "$BASE_DIR/messages"

echo -e "${BLUE}Limpieza completada${NC}" 