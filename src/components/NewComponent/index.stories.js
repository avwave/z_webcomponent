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
        {field: 'id',headerName:"ID", sortable:true ,width:120,flex:0,filter:true},
        {field: 'title', sortable:true,filter:true},
        {field: 'reviews',sortable:true,filter:true},
        {field: 'comments',resizable:false,sortable:true},
        {field: 'filler',sortable:true},
        {field: 'enabled',sortable:true
            ,filter:{type:"autocomplete",label:"Enabled"}
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