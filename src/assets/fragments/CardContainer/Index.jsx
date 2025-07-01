import React from 'react'

const CardContainer = (props) => {
    const {children, px = 'px-16', align = 'flex-col md:flex-row', withBorder = false} = props;
  return (
    <div className={`flex ${align} ${px} relative ${!withBorder ? 'py-5 gap-y-2' : 'bg-slate-200/50 rounded-md ring-1 ring-slate-200'}`}>
        {children}
    </div>
  )
}

export default CardContainer