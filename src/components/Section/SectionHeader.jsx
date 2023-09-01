import React from 'react'

function SectionHeader({title,style}) {

    return (
        <div className={`section-header`} style={style}>
            {title}
        </div>
    )
}

export default SectionHeader