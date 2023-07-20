import React, { useEffect, useContext, useReducer} from 'react'
import DataGrid from './DataGrid'
import { GridContext, actions, initialState, gridReducer 
    //, GridProvider
} from './GridContext'

const DataGridRemakeStory = {
    title: "DataGridRemake2",
    component: DataGrid
}

export default DataGridRemakeStory

export const DefaultStory = ({...args}) => {
    const [state,dispatch] = useReducer(gridReducer,initialState)
    
    return <GridContext.Provider value={[state,dispatch]}>
                <DGWrapper {...args}/>
            </GridContext.Provider>
}
function DGWrapper({...args}){
    const [state,dispatch] = useContext(GridContext)
    useEffect(() => {
        console.log("State Shallow:",state.sortColumn)
    }, [state.sortColumn])
    
    return(
        <DataGrid {...args}/>
    )
}

export const Default = DefaultStory.bind({});
Default.args = {
    hasSearch:true,
    // onSort:,
    columns: [ 
        {
            field: 'id', headerName:"ID", sortable:true , width:120, flex:0,
        },
        {
            field: 'title', sortable:true
        },
        {
            field:'location_scope', headerName:'Scope', sortable: true,
            filter: {
                type: 'nestedAutocomplete',
                label: "Location Scope",
                options:[
                    {
                        label: 'Global',
                        value: 'global'
                    },
                    {
                        label: 'Country',
                        value: 'country',
                        nestedOptions:[
                            {
                                label: 'Philippines',
                                value: '1'
                            },
                            {
                                label: 'US',
                                value: '2'
                            },
                            {
                                label: 'Canada',
                                value: '3'
                            },
                            {
                                label: 'Japan',
                                value: '4'
                            }
                        ]
                    },
                    {
                        label:'Office',
                        value:'office',
                        nestedOptions:[
                            {
                                label: 'Manila - Cebu',
                                value: '1'
                            },
                            {
                                label: 'Manila - Makati',
                                value: '2'
                            }
                        ]
                    },
                ]
            }

        },
        {
            field: 'reviews',sortable:true,
            filter:{
                type:'autocomplete',
                options:[
                    {
                        label:'Low',
                        value:6
                    },
                    {
                        label: 'High',
                        value: 5
                    },
                    {
                        label: 'Mid',
                        value: 4
                    },
                    {
                        label: 'Good',
                        value: 3
                    },
                    {
                        label: 'Bad',
                        value: 2
                    }
                ]
            }
        },
        {
            field: 'comments',sortable:true},
        {
            field: 'filler',sortable:true,
            filter:{
                type:'multiple',
                options:[
                    {
                        label: 'True',
                        value: true
                    },
                    {
                        label: 'False',
                        value: false
                    },
                    {
                        label: 'Null',
                        value: null
                    }
                ]
            }
        },
        {
            field: 'enabled',sortable:true
            ,filter:{
                label:"Enabled",
                options:[
                {
                    label: 'Enabled',
                    value: 0,
                    key:'key1'
                },
                {
                    label: 'Disabled',
                    value: 1,
                    key:'key2'
                }
            ]}
        },
    ],
    rows: [
        { id: 0, title: 'Example 4', reviews:10,comments: 'rad', filler: false, enabled: true,location_scope:'Global'},
        { id: 1, title: 'Example 5' ,reviews:7.5,comments: 'Normal', filler: true, enabled: false,location_scope:'Office'},
        { id: 2, title: 'Life of Pi' ,reviews:7.5,comments: '...', filler: true, enabled: false,location_scope:'Regional'},
        { id: 3, title: 'South Park' ,reviews:7.5,comments: 'Random Comment here', filler: true, enabled: false,location_scope:'Global'},
        { id: 4, title: 'Cabinet of Curioisities' ,reviews:7.5,comments: 'wow 10/10 changed my life', filler: true, enabled: false,location_scope:'Office'},
        { id: 5, title: 'Babadook' ,reviews:7.5,comments: 'Member a comments', filler: true, enabled: false,location_scope:'Global'},
        { id: 6, title: 'Missing' ,reviews:7.5,comments: 'Nice movie', filler: true, enabled: false,location_scope:'Office'},
        { id: 7, title: 'Example 6' ,reviews:7.5,comments: 'Typical', filler: true, enabled: false,location_scope:'Regional'},
        { id: 8, title: 'Home Alone' ,reviews:7.5,comments: '', filler: true, enabled: false,location_scope:'Global'},
        { id: 9, title: 'Insert Title Here' ,reviews:7.5,comments: 'Some Comment insert here', filler: true, enabled: false,location_scope:'Office'},
        { id: 10, title: 'School of Rock' ,reviews:7.5,comments: '', filler: true, enabled: false,location_scope:'Regional'},
        { id: 11, title: 'Witcher' ,reviews:7.5,comments: 'Wow', filler: true, enabled: false,location_scope:'Global'},
        { id: 12, title: 'Pacific Rim' ,reviews:7.5,comments: '8/10', filler: true, enabled: false,location_scope:'Regional'},
        { id: 13, title: 'Journey to the center of the earth' ,reviews:7.5,comments: 'would recommend', filler: true, enabled: false,location_scope:'Office'},
        { id: 14, title: '2012' ,reviews:7.5,comments: 'Some other comment here', filler: true, enabled: false,location_scope:'Global'},
        { id: 15, title: 'Edge of Tomorrow' ,reviews:7.5,comments: 'meh', filler: true, enabled: false,location_scope:'Global'},
    ],
}