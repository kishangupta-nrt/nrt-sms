import { toast, Bounce, ToastPosition } from 'react-toastify';

const config = {
  position: 'top-right' as ToastPosition,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: Bounce,
};

export function showSuccess(msg: string) {
  toast.success(msg, config);
}

export function showError(msg: string) {
  toast.error(msg, config);
}

export function showInfo(msg: string) {
  toast.info(msg, config);
}

export function showWarning(msg: string) {
  toast.warning(msg, config);
}
