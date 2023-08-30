import Status from './Status'
import {Button, Grid} from '@mui/material'
const StatusStory = {
    title: "Status",
    component: Status
}

export default StatusStory

export const DefaultStory = ({...args}) => {
    return (
        <Grid container style={{padding:'1rem', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Grid item xs={2}>
                <Status 
                    content='NEGATIVE'
                    color='negative'
                    isHoverable={true}
                />
            </Grid>
            <Grid item xs={2}>
                <Status 
                    content='PENDING'
                    color='pending'
                />
            </Grid>
            <Grid item xs={2}>
                <Status 
                    content='MATCHED'
                    color="matched"
                />
            </Grid>
            <Grid item xs={2}>
                <Status 
                    content='LIVE'
                    color='live'
                />
            </Grid>
            <Grid item xs={2}>
                <Status 
                    content='CANCELLED'
                    color="cancelled"
                />
            </Grid>
            <Grid item xs={2}>
                <Status 
                    content='FINISHED'
                    color="finished"
                />
            </Grid>
        </Grid>
    )
}

export const Sizes = ({...args}) => {
    return (
        <Grid container style={{padding:'1rem', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'white'}}>
            <Grid item xs={3}>
                <Status content='Small' size='small' color='finished' />
            </Grid>
            <Grid item xs={3}>
                <Status content='Medium' color='live'/>
            </Grid>
            <Grid item xs={3}>
                <Status content='Large' size='large' color="pending" />
            </Grid>
        </Grid>
    )
}

export const HoverEnabled = () => {
    return <Status content='Hoverable' isHoverable={true} color="live" />
}
