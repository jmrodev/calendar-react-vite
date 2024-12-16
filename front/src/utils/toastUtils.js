import toast from "react-hot-toast";

const showToast = (message, type = "success") => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
      toast(message); 
      break;
    default:
      toast(message);
  }
};

export default showToast;
