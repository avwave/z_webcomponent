import React from 'react'

function SectionRow({label, value, spacing, style}) {

    return (
        <div className={`section-row`} style={style}>
            <div className={`label`}>
                {label}
            </div>
            <div className={`value`}>
                {value}
            </div>
        </div>
    )
}

export default SectionRow