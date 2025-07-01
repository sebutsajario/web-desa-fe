import React from 'react'

const Header = (props) => {
    const {children, size = 'text-base', otherClass = '', color = 'text-black'} = props;
  return (
    <div><p className={`font-roboto font-extrabold ${size} ${otherClass} ${color}`}>{children}</p></div>
  )
}

export default Header