import React from 'react'
import Paragraph from '../Paragraph';

const Table = (props) => {
    const {tableHead, children} = props;
  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
            {tableHead && (<thead>
                <tr>
                <th></th>
                {tableHead.length > 0 && tableHead.map((key, i) => (
                    <th key={i}><Paragraph weight = 'font-medium'>{key}</Paragraph></th>
                ))}
                </tr>
            </thead>)}
            <tbody>
                {children}
            </tbody>
        </table>

    </div>
  )
}

export default Table