/*
this component is the main container with a navbar and a main empty div for other components
properties:
    children: components which should be placed inside this main container
    onSearchSubmit: used in NavBar component
    filter: used in NavBar component
    showHome: used in NavBar component
    showNewPost: used in NavBar component
    onNewPostClick: used in NavBar component
this component is used in HomPage.js and SearchPage.js
*/

import React from "react"
import NavBar from "../NavBar/NavBar"

import "./MainContainer.css"

const MainContainer = props => {
  return (
    <div>
      <NavBar
        onSearchSubmit={props.onSearchSubmit}
        showHome={props.showHome}
        showNewPost={props.showNewPost}
        onNewPostClick={props.onNewPostClick}
        filter={props.filter}
      />
      <div className="container main-container text-right">
        {props.children}
      </div>
    </div>
  )
}

export default MainContainer
