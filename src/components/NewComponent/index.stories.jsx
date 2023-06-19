import { NewComponent } from ".";

const NewComponentStory = {
  component: NewComponent,
  title: "NewComponent", 
}

export default NewComponentStory;

const DefaultStory = ({ ...args }) => (
  <NewComponent {...args} />
);

export const Default = DefaultStory.bind({});
Default.args = {
  title: "NewComponent",
  subtitle: "NewComponent",
};

export const Variant = DefaultStory.bind({});
Variant.args = {
  ...Default.args,
  title: 'varianttitle'
};

export const Color = DefaultStory.bind({});
Color.args = {
  ...Default.args,
  color: 'primary'
};

