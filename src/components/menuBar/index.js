import React, { useState, useEffect } from 'react'
import { Menu, Checkbox, Dropdown } from 'semantic-ui-react';
import { useStoreActions, useStoreState } from "easy-peasy";
import { useHistory, useRouteMatch } from "react-router-dom";

const exampleOptions = [
  { key: 'emptyArea', text: 'Empty Area', value: 'emptyArea' },
  { key: 'ballPool', text: 'Ball Pool', value: 'ballPool' },
  { key: 'bridge', text: 'Bridge', value: 'bridge' },
  { key: 'catapult', text: 'Catapult', value: 'catapult' },
  { key: 'chains', text: 'Chains', value: 'chains' },
  { key: 'concave', text: 'Concave', value: 'concave' },
  { key: 'constraints', text: 'Constraints', value: 'constraints' },
  { key: 'manipulation', text: 'Manipulation', value: 'manipulation' },
  { key: 'pyramid', text: 'Pyramid', value: 'pyramid' },
  { key: 'restitution', text: 'Restitution', value: 'restitution' },
  { key: 'sprites', text: 'Sprites', value: 'sprites' },
  { key: 'wreckingBall', text: 'Wrecking Ball', value: 'wreckingBall' },
];
const newModels = [
  { key: 'excavator', text: 'Excavator', value: 'excavator' },
  { key: 'bulldozer', text: 'Bulldozer', value: 'bulldozer' },
];

function MenuBar() {

  const menuLeft = useStoreState(state => state.general.menuLeft);

  const history = useHistory();

  const mashValue = useRouteMatch('/examples/:id');
  const selectExample = mashValue && mashValue.isExact ? mashValue.params.id : '';

  const mashModelValue = useRouteMatch('/new-models/:id');
  const selectModel = mashModelValue && mashModelValue.isExact ? mashModelValue.params.id : '';

  const turnMenuLeft = useStoreActions(
    actions => actions.general.turnMenuLeft
  );

  useEffect(() => {
      localStorage.setItem('leftMenu', menuLeft);
  },[ menuLeft ]);

  const [activeItem, setActiveItem] = useState(false);
  const [example, setExample] = useState(1);
  const [model, setModel] = useState(2);

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
    history.push(name)
  };

  const handlerChooseExample = (event, data) => {
    history.push(`/examples/${data.value}`);
      setExample(1);
      setModel(0);
  };
  const handlerChooseModel = (event, data) => {
      //console.log(data)
    history.push(`/new-models/${data.value}`);
      setExample(0);
      setModel(1);
  };

  return (
   <Menu>
     <Menu.Item>
         <Checkbox
           onChange = {event => {turnMenuLeft(!menuLeft)}}
           toggle
           checked={menuLeft}
         />
     </Menu.Item>
     <Menu.Item
       name='examples'
     >
       <Dropdown
           key={example}
         button
         className='icon'
         floating
         labeled
         icon='random'
         options={exampleOptions}
         search
         defaultValue={selectExample}
         text='Select example'
         onChange={handlerChooseExample}
       />
     </Menu.Item>

     <Menu.Item
       name='new-model'
     >
       <Dropdown
           key={example}
           button
         className='icon'
         floating
         labeled
         icon='truck'
         options={newModels}
         search
         defaultValue={selectModel}
         text='Select models'
         onChange={handlerChooseModel}
       />
     </Menu.Item>

     <Menu.Item
       name='upcomingEvents'
       active={activeItem === 'upcomingEvents'}
       onClick={handleItemClick}
     >
       Matte.js
     </Menu.Item>
        <Menu.Item
           name='upcomingEvents'
           active={activeItem === 'upcomingEvents'}
           onClick={handleItemClick}
         >
          Website
        </Menu.Item>
       <Menu.Item
           name='upcomingEvents'
           active={activeItem === 'upcomingEvents'}
           onClick={handleItemClick}
         >
          github
       </Menu.Item>
   </Menu>
  )

}
export default MenuBar;
