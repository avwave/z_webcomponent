import React from 'react'
import {NewComponent} from "."

const NewComponentStory = {
    title: "title",
    component: NewComponent
}

export const DefaultStory =({...args}) => {
    <NewComponent {...args}/>
}

export const Default = DefaultStory.bind({});
export default NewComponentStory