/*
  this componnet renders a spinner
  this component is used in HomePage.js and SearchPage.js
*/

import React from "react"

import "./Loading.css"

const Loading = () => {
  return (
    <div className="loading">
      <div className="loader"></div>
    </div>
  )
}

export default Loading
