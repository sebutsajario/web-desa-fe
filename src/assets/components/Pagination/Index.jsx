import React from 'react'

const Pagination = (props) => {
  const {totalPage, currentPage, onChangePage} = props;
  return (
    <div className='flex justify-center'>
        <div className="join p-5">
        <button onClick={()=> onChangePage('prev')} className={`join-item btn ${currentPage == 1 ? 'btn-disabled' : ''}`}>«</button>
        <button className="join-item btn">Halaman {currentPage}</button>
        <button onClick={()=> onChangePage('next')}  className={`join-item btn ${currentPage == totalPage ? 'btn-disabled' : ''}`}>»</button>
        </div>
    </div>
  )
}

export default Pagination