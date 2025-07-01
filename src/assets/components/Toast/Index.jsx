import React, { useContext } from 'react'
import { Toast } from '../../../contexts/ToastContext';

const ToastComponent = () => {
    const {toastMessage, status, isShow} = useContext(Toast);
  return (
    <>
      {isShow && (
        <div className="toast toast-top toast-center fixed mt-14 z-50">
            <div className={`alert ${status == 'success' ? 'alert-success' : 'alert-error'}`}>
                <span>{toastMessage || "Pesan"}</span>
            </div>
        </div>
      )}
    </>
  )
}

export default ToastComponent