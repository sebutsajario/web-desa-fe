import React from 'react'

const TableData = (props) => {
    const {children, colspan = 1} = props;
  return (
    <td colSpan={colspan}>{children}</td>
  )
}

export default TableData