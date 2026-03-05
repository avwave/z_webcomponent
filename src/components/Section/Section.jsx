import React from 'react'
import './SectionStyles.scss'

function Section({children, style}) {
    return (
        <div className={`section`} style={style}>
            {children}
        </div>
    )
}

export default Section