import React from 'react'

const Paragraph = (props) => {
    const {children, size = 'text-sm', color = 'text-black', weight = 'font-light', clamp = false, otherClass = ''} = props;
  return (
    <p className={`font-roboto ${color} ${size} ${weight} ${clamp ? 'line-clamp-3' : ''} ${otherClass}`}>{children}</p>
  )
}

export default Paragraph