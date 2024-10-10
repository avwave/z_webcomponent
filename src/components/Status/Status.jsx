import {useState} from 'react'
import './StatusStyles.scss'



function Status({content, color, isHoverable, size, style}) {
    // Checks the size of the <Status/> Accepted values are: "small", "medium", "large", and any custom measurement
    const getSize = () =>  {
        if(size === 'medium' || null || undefined || ''){
            return 'medium'
        }else if (size === 'small'){
            return 'small'
        }else if (size === 'large'){
            return 'large'
        }else{
            return 'custom'
        }
    }

    const getColor = () => {
        if(color === 'negative'){
            return 'color-negative'
        }
        else if(color === 'pending'){
            return 'color-pending'
        }
        else if ( color === 'matched'){
            return 'color-matched'
        } 
        else if (color === 'live'){
            return "color-live"
        }
        else if (color === 'cancelled'){
            return "color-cancelled"
        }
        else if ( color === 'finished'){
            return 'color-finished'
        } 
        else if ( color === 'default' || color === null || color === undefined || color === '') {
            return 'color-default'

        } 
        else {    
            return 'custom'

        }
    }

    const getIsHoverable = () => {
        if(isHoverable === true){
            return 'is-hoverable'
        }else{
            return ''
        }
    }

    const sizeClassName = getSize()
    const colorClassName = getColor()
    const hoverableClassName = getIsHoverable()

    return (
        <div className={`status-container-outer
                ${colorClassName !== 'custom' && colorClassName}
                ${hoverableClassName}
            `}
        style={{
            ...(colorClassName === 'custom' ? {backgroundColor: color} : {})
        }}
        > 
            <div 
                className={`status-container 
                    ${sizeClassName !== 'custom' && sizeClassName} 
                    
                `} 
                style={{
                    ...style,
                    ...(sizeClassName ==='custom' ? {height:size} : {}),
            
                }} 
            >
                {content}
            </div>
        </div>
    )
}

export default Status