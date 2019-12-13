/*
  this component renders a required textbox
  properties:
      value: initial value
      type: type of input
      placeholder: place holder of input
      className: css class of the input
      onStateChange: a callback which will report current state of this control to the parent
  this component is used in PostModal.js and PostKeyModal.js
*/

import React, { useReducer, useEffect } from "react"
import { Input } from "reactstrap"

const inputReducer = (state, action) => {
  return {
    value: action.value,
    isValid: action.value !== ""
  }
}

const RequiredInput = props => {
  const [state, dispatch] = useReducer(inputReducer, {
    value: props.value,
    isValid: true
  })

  useEffect(() => {
    props.onStateChange(state)
  })

  const onChangeHandler = event => {
    dispatch({ value: event.target.value })
  }

  return (
    <div>
      <Input
        id={props.id}
        className={props.className}
        placeholder={props.placeholder}
        value={state.value}
        type={props.type}
        invalid={!state.isValid}
        onChange={onChangeHandler}
      />
    </div>
  )
}

export default RequiredInput
