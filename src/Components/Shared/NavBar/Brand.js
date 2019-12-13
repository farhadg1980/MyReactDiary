/*
    this component renders a logo n the navbar
    this component is used in NavBar.js
*/

import React from "react"
import { Link } from "react-router-dom"

import logo from "../../../Images/logo.png"

const Brand = () => {
  return (
    <Link className="navbar-brand" to="/">
      <img
        src={logo}
        width="30"
        height="30"
        className="ml-2 d-inline-block align-top"
        alt=""
      />
      خاطرات شخصی
    </Link>
  )
}

export default Brand
