import { toast } from 'react-toastify';

export const showToast = (message, type = 'info') => {
  const options = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  switch (type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'warning':
      toast.warning(message, options);
      break;
    case 'info':
    default:
      toast.info(message, options);
      break;
  }
};

// Mantener la exportación por defecto para compatibilidad hacia atrás
const showToastDefault = showToast;
export default showToastDefault;
