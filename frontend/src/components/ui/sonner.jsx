import { ToastContainer, toast } from 'react-toastify';

const Toaster = (props) => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      {...props}
    />
  );
};

export { Toaster, toast };
