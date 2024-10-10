import React, { useState } from 'react'
import TabMenu from './TabMenu'
import { Button, Paper } from '@mui/material'

const TabMenuStory = {
    title: "Tab Menu",
    component: TabMenu
}

export default TabMenuStory

const component1 = () => {
    return (
        <div style={{backgroundColor:'skyblue', width:'100%', height:"100%"}}>
            Component 1
        </div>
    )
}

const component2 = () => {
    return(
        <div style={{backgroundColor:'teal', width:'100%', height:"100%"}}>
            Component 2
        </div>
    )
}

const component3 = () => {
    return(
        <div style={{backgroundColor:'#f3f3f3', width:'100%', height:"100%"}}>
            Component 3
        </div>
    )
}

const component4 = () => {
    return (
        <div style={{backgroundColor:'pink', width:'100%', height:"100%"}}>
            Component 4
        </div>
    )
}

export const DefaultStory = ({...args}) => {

    return(
        <Paper sx={{p:'1rem', height:'50vh'}}>
            <TabMenu 
                tabs={[
                    {label: 'Booking', component: component1},
                    {label: 'Ride', component: component2},
                    {label: 'Operations', component: component3},
                    {label: 'Client Chat', component: component4}
                ]}
            />
        </Paper>
    )
}

export const LoadingStory = ({args}) => {
    const [loading, setLoading] = useState(false)
    return(
        <Paper sx={{p: '1rem', height: '80vh', display:'flex', flexDirection:'column'}}>
            <div style={{marginBottom:'1rem'}}>
            <Button variant='outlined' onClick={()=>{setLoading(!loading)}} style={{paddingBottom:'0.5rem'}}>
                {loading ? "Loading Off" : "Set Loading"}
            </Button>
            </div>
            <TabMenu 
                tabs={[
                    {label: 'Booking', component: component1},
                    {label: 'Ride', component: component2},
                    {label: 'Operations', component: component3},
                    {label: 'Client Chat', component: component4}
                ]}
                isLoading={ loading }
            />
        </Paper>
    )
}

export const FullWidthStory = ({args}) => {
    return(
        <Paper sx={{p: '1rem', height: '80vh', display:'flex', flexDirection:'column'}}>
            <TabMenu 
                tabs={[
                    {label: 'Booking', component: component1},
                    {label: 'Ride', component: component2},
                    {label: 'Operations', component: component3},
                    {label: 'Client Chat', component: component4}
                ]}
                fullWidth={ true }
            />
        </Paper>
    )
}

export const DefaultTabStory = ({args}) => {
    return(
        <Paper sx={{p: '1rem', height: '80vh', display:'flex', flexDirection:'column'}}>
            <TabMenu 
                tabs={[
                    {label: 'Booking', component: component1},
                    {label: 'Ride', component: component2},
                    {label: 'Operations', component: component3},
                    {label: 'Client Chat', component: component4}
                ]}
                defaultTab={ 3 }
            />
        </Paper>
    )
}