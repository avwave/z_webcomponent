import {useState, useEffect, useRef, useLayoutEffect} from 'react'
import './TabMenuStyles.scss'
import LinearProgress from '@mui/material/LinearProgress';

function TabMenu({tabs, isLoading:isLoadingProp, fullWidth:fullWidthProp, defaultTab:defaultTabProp , style}) {
    const [selectedTab, setSelectedTab] = useState(0)
    const [selectedComponent, setSelectedComponent] = useState(null)
    const [fullWidth,setFullWidth] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        return setSelectedComponent(tabs[selectedTab].component)
    }, [selectedTab, tabs])

    useEffect(() => {
        setIsLoading(isLoadingProp)
    }, [isLoadingProp])
    
    const handleClick = (e,index)=>{
        setSelectedTab(index)
    }
    
    
    const getDefault = () => {
        if((defaultTabProp >= 0 && defaultTabProp < tabs.length)){
            return setSelectedTab(defaultTabProp)
        }else if(defaultTabProp === null || defaultTabProp === undefined || defaultTabProp === ''){
            return setSelectedTab(0)
        }else{
            console.log("%cERR: Default Tab option is not within range", 'color:red;')
            return setSelectedTab(0)
        }
    }
    
    const getWidth = () => {
        if(fullWidthProp === true){
            return 'tab-full-width'
        }else{
            return ''
        }
    }
    
    useEffect(() => {
        getDefault()
    }, [])



    const widthClassName = getWidth()
    return (
        <div className={'container'}>
            <div className={`tab-section`}>
                <div className={`outer-tab-container ${widthClassName}`}>
                    { tabs.map((element,index) => {
                        return (
                        <div key={index} className={`tab-container ${widthClassName}`}>
                            <button 
                                className={`tab-content ${selectedTab=== index ? 'selected-tab': ''} ${index===0 ? 'first-element': ''} ${index===tabs.length-1 ? 'last-element': ''} `} 
                                onClick={(e)=> handleClick(e,index)}
                                style={{
                                    ...style
                                }}
                            >
                                {element.label}
                            </button>
                        </div>
                    )})
                    }
                </div>
            </div>
            <div className={`component-section`}>
                { isLoading ? <LinearProgress /> :  selectedComponent }
            </div>
        </div>
    )
}

export default TabMenu