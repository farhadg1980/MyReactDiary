/*
  this component renders buttons in the navbar beside search section
  properties:
      showHome: [boolean] show Home button
      showNewPost: [boolean] show New Post button
      onNewPostClick: callback
  this component is used in Navbar.js
*/

import React from "react"
import { Link } from "react-router-dom"
import { Button } from "reactstrap"

const Links = props => {
  return (
    <ul className="navbar-nav mr-auto">
      {props.showHome && (
        <li className="nav-item active">
          <Link className="nav-link home" to="/">
            صفحه اصلی
          </Link>
        </li>
      )}
      {props.showNewPost && (
        <li className="nav-item">
          <Button
            outline
            color="success"
            size="sm"
            className="new-post"
            onClick={() => props.onNewPostClick()}
          >
            پست جدید
          </Button>
        </li>
      )}
    </ul>
  )
}

export default Links
