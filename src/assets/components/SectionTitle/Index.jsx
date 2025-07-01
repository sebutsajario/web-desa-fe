import React from 'react'

const SectionTitle = (props) => {
    const {children, px = 'px-16', isHomePage = false} = props;
  return (
    <div className={`flex flex-row ${px} py-5 gap-x-2`}>
        <div className={`w-2 h-7 ${!isHomePage ? 'bg-black' : 'bg-white'}`}></div>
        <p className={`font-roboto font-bold text-lg ${!isHomePage ? '' : 'text-white'}`}>{children}</p>
    </div>
  )
}

export default SectionTitle