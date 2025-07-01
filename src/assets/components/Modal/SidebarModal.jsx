import React from 'react'

const SidebarModal = (props) => {
    const {children} = props;
  return (
    <>
        {/* <button className="btn" onClick={()=>document.getElementById('my_modal_2').showModal()}>open modal</button> */}
        <dialog id="sidebar_modal" className="modal">
        <div className="modal-box">
            {/* <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Press ESC key or click outside to close</p> */}
            {children}
        </div>
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
        </dialog>
    </>
  )
};

export default SidebarModal;