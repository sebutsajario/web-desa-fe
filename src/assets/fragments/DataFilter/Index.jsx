import React from 'react'
import Paragraph from '../../components/Paragraph'

const DataFilter = (props) => {
    const {children, onHandleSearch, onHandleReset, onHandlePerPage, onHandleSort} = props
  return (
    <>
        <div className='flex flex-col gap-y-2 p-5 border border-slate-300 rounded-md'>
        <Paragraph weight = 'font-medium'>Cari berdasarkan</Paragraph>
        <div className='flex flex-col md:flex-row gap-x-5 w-full items-start md:items-end'>
            {children}
            <div className='flex mt-2 md:mt-0 flex-row-reverse md:flex-row gap-x-2 gap-y-2'>
                <div onClick={onHandleSearch} className='flex w-10 h-10 rounded-md bg-slate-700 hover:bg-slate-500 cursor-pointer transition-all ease-in-out duration-200 p-3 items-end justify-center'>
                    <svg className='' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                </div>
                <div onClick={onHandleReset} className='flex w-10 h-10 rounded-md bg-slate-700 hover:bg-slate-500 cursor-pointer transition-all ease-in-out duration-200 p-3 items-end justify-center'>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="#FFFFFF"></path></g></svg>
                </div>
            </div>
        </div>
        </div>
        <div className='px-5 py-3 justify-end flex flex-col sm:flex-row gap-y-2 gap-x-3 items-end sm:items-center'>
            <label htmlFor="perPage"><Paragraph weight = 'font-medium'>Tampilkan sebanyak</Paragraph></label>
            <select onChange={onHandlePerPage} id='perPage' defaultValue="5" className="select select-xs w-fit">
                <option>5</option>
                <option>10</option>
                <option>20</option>
            </select>
            <label htmlFor="perPage"><Paragraph weight = 'font-medium'>Urutkan</Paragraph></label>
            <select onChange={onHandleSort} id='sort' defaultValue="desc" className="select select-xs w-fit">
                <option value="desc">Terbaru</option>
                <option value="asc">Terlama</option>
            </select>
        </div>
    </>
  )
}

export default DataFilter