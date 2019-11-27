import React, { useEffect } from 'react';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { useStoreState, useStoreActions } from 'easy-peasy';
import {Label, Button, Form, Icon, Message} from "semantic-ui-react";

import reduxInput from '../../common/reduxInputs';

const selector = formValueSelector('addCompositeForm');

const validate = values => {
  const errors = {};
  if (!values.body) {
    errors.body = 'Required'
  } else if (values.body === 'choose') {
    errors.body = 'You must choose a body'
  }
  if(values.body === 'fromVertices'){
    if (!values.vertices || values.vertices.length < 3) {
      errors.vertices = { _error: 'At least three vertices must be entered' }
    } else {
      const membersArrayErrors = [];
      values.vertices.forEach((member, memberIndex) => {
        const memberErrors = {};
        if (!member || typeof member.x == "undefined") {
          memberErrors.x = 'Required';
          membersArrayErrors[memberIndex] = memberErrors
        }
        if (!member || typeof member.y == "undefined") {
          memberErrors.y = 'Required';
          membersArrayErrors[memberIndex] = memberErrors
        }
      });
      if (membersArrayErrors.length) {
        errors.vertices = membersArrayErrors
      }
    }
    //return errors
  }
  return errors
};

const initialVal = {
  options: {
    density: 0.001,
    friction: 0.1,
    frictionStatic: 0.5,
    frictionAir: 0.01,
    restitution: 0,
    chamfer: 0,
  }
};

const generalFields = [
  { name: 'density', start: 0.001, min: 0, max: 0.01, step: 0.001 },
  { name: 'friction', start: 0.1, min: 0, max: 1, step: 0.05 },
  { name: 'frictionStatic', start: 0.5, min: 0, max: 10, step: 0.1 },
  { name: 'frictionAir', start: 0.01, min: 0, max: 0.1, step: 0.001 },
  { name: 'restitution', start: 0, min: 0, max: 0.1, step: 0.1 },
  { name: 'chamfer', start: 0, min: 0, max: 30, step: 1 },
];
const pyramid = [
  { name: 'x' },
  { name: 'y' },
  { name: 'columns' },
  { name: 'rows' },
  { name: 'columnGap' },
  { name: 'rowGap' },
  { name: 'rectWidth' },
  { name: 'rectHeight' },
];
const stack = [
  { name: 'x' },
  { name: 'y' },
  { name: 'columns' },
  { name: 'rows' },
  { name: 'columnGap' },
  { name: 'rowGap' },
  { name: 'rectWidth' },
  { name: 'rectHeight' },
];
const newtonsCradle = [
  { name: 'x' },
  { name: 'y' },
  { name: 'number' },
  { name: 'size' },
  { name: 'length' },
];
const softBody = [
  { name: 'x' },
  { name: 'y' },
  { name: 'columns' },
  { name: 'rows' },
  { name: 'columnGap' },
  { name: 'rowGap' },
  { name: 'crossBrace' },
  { name: 'particleRadius' },
];
const car = [
  { name: 'x' },
  { name: 'y'},
  { name: 'width'},
  { name: 'height'},
  { name: 'wheelSize'},
];

const renderVertices = (props) => {
  const { renderTextInput } = reduxInput;
  const { fields, meta: { error, submitFailed } } = props;
  return (
    <React.Fragment>
      { fields.map((vertices, index) => (
        <Form.Group inline key={index} >
          <Field
            width={6}
            simple={true}
            label="x:"
            name={`${vertices}.x`}
            component={renderTextInput}
            type="number"
            placeholder="x"
            size="mini"
          />
          <Field
            width={6}
            simple={true}
            label="y:"
            name={`${vertices}.y`}
            component={renderTextInput}
            type="number"
            placeholder="y"
            size="mini"
          />
          <Form.Button
            type="button"
            width={4}
            color="red"
            size='mini'
            content={<Icon name='trash' />}
            onClick={() => fields.remove(index)}
          />
        </Form.Group>
      ))}
      { submitFailed && error &&
        (
          <Message negative>
            <Message.Header>Error</Message.Header>
            <p>{error}</p>
          </Message>
        )
      }
      <Button
        type="button"
        color="orange"
        size='mini'
        onClick={() => fields.push({})}
      >
        Add vertices
      </Button>
    </React.Fragment>
  )
}

let AddComposites = props => {
  const {
    addBodyMouseEvent,
    initialize,
    updateBodyMouseEvent,
    invalid,
    handleSubmit,
    addBody,
    pristine
  } = props;
  const { renderSelect, renderRange, renderTextInput } = reduxInput;
  const options = useStoreState(state => state.matterOptions.options);


  const addOptions = useStoreActions(
    actions => actions.matterOptions.addOptions
  );

  const allFields = useStoreState(state => {
    const allFields = selector(
      state, 'body', 'density'
    );
    return {
      ...allFields
    }
  });

  const changeEvent = (event, value, prevValue, name) => {
    if(name === 'x'){
      updateBodyMouseEvent(+value, false)
    } else if (name === 'y'){
      updateBodyMouseEvent(false,+value)
    }
  };

  const pyramidForm = () => {
    return (
      <div className="bodiesForms">
        {
          pyramid.map((value, index) => {
            return (
              <div className="ui focus input" key={index}>
                <Field
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type="number"
                  placeholder={value.name}
                  size="mini"
                />
              </div>
            )
          })
        }
      </div>
    )
  };
  const stackForm = () => {
    return (
      <div className="bodiesForms">
        {
          stack.map((value, index) => {
            return (
              <div className="ui focus input" key={index}>
                <Field
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type="number"
                  placeholder={value.name}
                  size="mini"
                />
              </div>
            )
          })
        }
      </div>
    )
  };
  const newtonsCradleForm = () => {
    return (
      <div className="bodiesForms">
        {
          newtonsCradle.map((value, index) => {
            return (
              <div className="ui focus input" key={index}>
                <Field
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type="number"
                  placeholder={value.name}
                  size="mini"
                />
              </div>
            )
          })
        }
      </div>
    )
  };
  const softBodyForm = () => {
    return (
      <div className="bodiesForms">
        {
          softBody.map((value, index) => {
            return (
              <div className="ui focus input" key={index}>
                <Field
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type="number"
                  placeholder={value.name}
                  size="mini"
                />
              </div>
            )
          })
        }
      </div>
    )
  };
  const carForm = () => {
    return (
      <div className="bodiesForms">
        {
          car.map((value, index) => {
            return (
              <div className="ui focus input" key={index}>
                <Field
                  label={`${value.name}:`}
                  onChange={changeEvent}
                  name={value.name}
                  component={renderTextInput}
                  type="number"
                  placeholder={value.name}
                  size="mini"
                />
              </div>
            )
          })
        }
        {/*<FieldArray name="vertices" component={renderVertices} />*/}
      </div>
    )
  };

  const  onchange = (val,name) => {
    let data = {};
    if(name === 'pyramid'){
      data = {
        x: options.width / 2,
        y: options.height / 2,
        columns: 10,
        rows: 10,
        columnGap: 0,
        rowGap:0,
        rectWidth: 30,
        rectHeight: 30
      };
    }else if(name === 'stack'){
      data = {
        x: options.width / 2,
        y: options.height / 2,
        columns: 6,
        rows: 10,
        columnGap: 0,
        rowGap:0,
        rectWidth: 30,
        rectHeight: 30
      };
    }else if(name === 'newtonsCradle'){
      data = {x: options.width / 2, y: options.height / 2, number: 10, size: 10, length: 100 };
    }else if(name === 'softBody'){
      data = {
        x: options.width / 2,
        y: options.height / 2,
        columns: 5,
        rows: 5,
        columnGap: 0,
        rowGap: 0,
        crossBrace: 1,
        particleRadius: 18,
        //particleOptions: 1,
      };
    }else if(name === 'car'){
      data = {x: options.width / 2, y: options.height / 2, width:200, height:30, wheelSize: 30}
    };

    initialize({
      ...initialVal,
      ...data
    });
    addBodyMouseEvent(data)
  };

  const sendFormToAddBody = (value,next,third) => {
    console.log(value,next,third)
    addBody(value)
  };
  return (
    <Form onSubmit={handleSubmit(sendFormToAddBody)}>
      <div>
        <Field
          name="body"
          type="text"
          component={renderSelect}
          onChange={onchange}
          options={[
            { key: 'choose', value: 'choose', text: 'Select body' },
            { key: 'pyramid', value: 'pyramid', text: 'pyramid' },
            { key: 'stack', value: 'stack', text: 'stack' },
            { key: 'newtonsCradle', value: 'newtonsCradle', text: 'newtonsCradle' },
            { key: 'softBody', value: 'softBody', text: 'softBody' },
            { key: 'car', value: 'car', text: 'car' },
          ]}
          label="Choose body"
        />
        {allFields.body === 'pyramid' && pyramidForm()}
        {allFields.body === 'stack' && stackForm()}
        {allFields.body === 'newtonsCradle' && newtonsCradleForm()}
        {allFields.body === 'softBody' && softBodyForm()}
        {allFields.body === 'car' && carForm()}
        {
         /* generalFields.map((value, index) => {
            return (
              <Field
              settings={{...value}}
              key={index}
              name={`options.${value.name}`}
              component={renderRange}
              type="text"
              label={value.name}
            />
            )
          })*/
        }
        <Button primary={!invalid} type="submit" >Add</Button>
      </div>
    </Form>
  )
};

AddComposites = reduxForm({
  initialValues: {
    ...initialVal,
    body: 'choose',
  },
  validate,
  form: 'addCompositeForm',
  enableReinitialize : true,
  keepDirtyOnReinitialize:true,
})(AddComposites);


export default AddComposites
