import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./src/providers/AppProvider";
import AppContent from "./components/AppContent";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AppProvider>
  );
}

export default App;
