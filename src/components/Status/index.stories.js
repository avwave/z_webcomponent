import Status from './Status'
import {Button, Grid} from '@mui/material'
const StatusStory = {
    title: "Status",
    component: Status
}

export default StatusStory

export const DefaultStory = ({...args}) => {
    return (
        <div container style={{padding:'1rem', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div style={{marginRight:'1rem'}}>
                <Status 
                    content='NEGATIVE'
                    color='negative'
                    isHoverable={true}
                />
            </div>
            <div style={{marginRight:'1rem'}}>
                <Status 
                    content='PENDING'
                    color='pending'
                />
            </div>
            <div style={{marginRight:'1rem'}}>
                <Status 
                    content='MATCHED'
                    color="matched"
                />
            </div>
            <div style={{marginRight:'1rem'}}>
                <Status 
                    content='LIVE'
                    color='live'
                />
            </div>
            <div style={{marginRight:'1rem'}}>
                <Status 
                    content='CANCELLED'
                    color="cancelled"
                />
            </div>
            <div>
                <Status 
                    content='FINISHED'
                    color="finished"
                />
            </div>
        </div>
    )
}

export const Sizes = ({...args}) => {
    return (
        <Grid container style={{padding:'1rem', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'white'}}>
            <div style={{marginRight:'1rem'}}>
                <Status content='Small' size='small' color='finished' />
            </div>
            <div style={{marginRight:'1rem'}}>
                <Status content='Medium' color='live'/>
            </div>
            <div>
                <Status content='Large' size='large' color="pending" />
            </div>
        </Grid>
    )
}

export const HoverEnabled = () => {
    return <Status content='Hoverable' isHoverable={true} color="live" />
}
