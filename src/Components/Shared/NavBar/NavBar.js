/*
  this component contains top navigation bar
  properties:
      showHome: used in Links component
      showNewPost: used in Links component
      onNewPostClick: used in Links component
      filter: used in SearchForm component
      onSearchSubmit: used in SearchForm component
  this component is used in MainContainer.js
*/

import React from "react"

import SearchForm from "./SearchForm"
import Links from "./Links"
import Brand from "./Brand"
import "./NavBar.css"

const NavBar = props => {
  return (
    <nav className="navbar navbar-expand-md navbar-dark fixed-top">
      <Brand />

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <Links
          showHome={props.showHome}
          showNewPost={props.showNewPost}
          onNewPostClick={props.onNewPostClick}
        />

        <SearchForm
          filter={props.filter}
          onSearchSubmit={props.onSearchSubmit}
        />
      </div>
    </nav>
  )
}

export default NavBar
