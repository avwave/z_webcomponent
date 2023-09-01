import React from 'react'

function SectionContent({children, style}) {
    return (
        <div className={`section-content`} style={style}>
            {children}
        </div>
    )
}

export default SectionContent