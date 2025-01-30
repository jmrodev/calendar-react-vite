Restarting 'server.js'
node:internal/modules/esm/resolve:275
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/jmro/Documentos/repositorios/calendar-react-vite/backend/Middleware/authMiddleware.js' imported from /home/jmro/Documentos/repositorios/calendar-react-vite/backend/Router/appointmentRouter.js
    at finalizeResolution (node:internal/modules/esm/resolve:275:11)
    at moduleResolve (node:internal/modules/esm/resolve:860:10)
    at defaultResolve (node:internal/modules/esm/resolve:984:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:654:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:603:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:586:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:242:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:135:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///home/jmro/Documentos/repositorios/calendar-react-vite/backend/Middleware/authMiddleware.js'
}

Node.js v23.3.0
Failed running 'server.js'

#!/bin/zsh

# Colores para mejor legibilidad
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}Iniciando la aplicación...${NC}"

# Función para verificar si pnpm está instalado
check_pnpm() {
    if ! command -v pnpm &> /dev/null; then
        echo "pnpm no está instalado. Por favor, instálalo primero."
        exit 1
    fi
}

# Verificar pnpm
check_pnpm

# Función para abrir una nueva terminal
open_terminal() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        osascript -e "tell application \"Terminal\" to do script \"cd $(pwd) && $1\""
    else
        # Linux
        if command -v x-terminal-emulator &> /dev/null; then
            x-terminal-emulator -e "zsh -c '$1; exec zsh'" &
        elif command -v konsole &> /dev/null; then
            konsole -e "zsh -c '$1; exec zsh'" &
        elif command -v xterm &> /dev/null; then
            xterm -e "zsh -c '$1; exec zsh'" &
        else
            echo "No se encontró un emulador de terminal compatible"
            exit 1
        fi
    fi
}

# Iniciar el backend
echo -e "${BLUE}Iniciando el backend...${NC}"
cd backend
pnpm install
open_terminal "pnpm start"

# Esperar un momento para asegurar que el backend esté corriendo
sleep 3

# Iniciar el frontend
echo -e "${BLUE}Iniciando el frontend...${NC}"
cd ..
cd front
pnpm install
open_terminal "pnpm run dev"

echo -e "${GREEN}¡Aplicación iniciada!${NC}"
echo "Backend corriendo en http://localhost:3001"
echo "Frontend corriendo en http://localhost:5173" 