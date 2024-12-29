import { toast } from 'react-toastify';

const defaultConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};

const showToast = (message, type = 'info', config = {}) => {
  const toastConfig = {
    ...defaultConfig,
    ...config
  };

  switch (type) {
    case 'success':
      toast.success(message, toastConfig);
      break;
    case 'error':
      toast.error(message, toastConfig);
      break;
    case 'warning':
      toast.warning(message, toastConfig);
      break;
    case 'info':
    default:
      toast.info(message, toastConfig);
      break;
  }
};

export const showSuccessToast = (message, config = {}) => {
  showToast(message, 'success', config);
};

export const showErrorToast = (message, config = {}) => {
  showToast(message, 'error', config);
};

export const showWarningToast = (message, config = {}) => {
  showToast(message, 'warning', config);
};

export const showInfoToast = (message, config = {}) => {
  showToast(message, 'info', config);
};

export default showToast;
