import React from 'react'
import {NewComponent} from "."

const NewComponentStory = {
    title: "NewComponent",
    component: NewComponent
}

export default NewComponentStory

export const DefaultStory =({...args}) => {
    return <NewComponent {...args}/>
}

export const Default = DefaultStory.bind({});
Default.args = {
    hasSearch:true,
    columns: [ 
        {
            field: 'id', headerName:"ID", sortable:true , width:120, flex:0,
        },
        {
            field: 'title', sortable:true},
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
        { id: 0, title: 'Example 4', reviews:10 ,comments: 'rad', filler: false, enabled: true},
        { id: 1, title: 'Demo' ,reviews:7.5,comments: 'meh', filler: true, enabled: false},
        { id: 2, title: 'Demo' ,reviews:7.5,comments: 'meh', filler: true, enabled: false},
        { id: 3, title: 'Demo' ,reviews:7.5,comments: 'meh', filler: true, enabled: false},
        { id: 4, title: 'Demo' ,reviews:7.5,comments: 'meh', filler: true, enabled: false},
        { id: 5, title: 'Demo' ,reviews:7.5,comments: 'meh', filler: true, enabled: false},
        { id: 6, title: 'Demo' ,reviews:7.5,comments: 'meh', filler: true, enabled: false},
        { id: 7, title: 'Demo' ,reviews:7.5,comments: 'meh', filler: true, enabled: false},
        { id: 8, title: 'Demo' ,reviews:7.5,comments: 'meh', filler: true, enabled: false},
        { id: 9, title: 'Demo' ,reviews:7.5,comments: 'meh', filler: true, enabled: false},
        { id: 10, title: 'Demo' ,reviews:7.5,comments: 'meh', filler: true, enabled: false},
        { id: 11, title: 'Demo' ,reviews:7.5,comments: 'meh', filler: true, enabled: false},
        { id: 12, title: 'Demo' ,reviews:7.5,comments: 'meh', filler: true, enabled: false},
        { id: 13, title: 'Demo' ,reviews:7.5,comments: 'meh', filler: true, enabled: false},
        { id: 14, title: 'Demo' ,reviews:7.5,comments: 'meh', filler: true, enabled: false},
        { id: 15, title: 'Demo' ,reviews:7.5,comments: 'meh', filler: true, enabled: false},
    ],
}