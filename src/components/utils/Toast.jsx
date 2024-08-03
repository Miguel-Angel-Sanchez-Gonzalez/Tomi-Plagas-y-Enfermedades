import { toast } from "react-toastify";
const showToast = (message, type) => {
  if (type === "success") {
    toast.success(message, {
      position: "top-center",
      autoClose: 1500,
      theme: "colored",
    });
  } else if (type === "error") {
    toast.error(message, {
      position: "top-center",
      autoClose: 1500,
      theme: "colored",
    });
  }
};
export default showToast;
