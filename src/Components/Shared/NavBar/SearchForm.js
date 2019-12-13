/*
  this component renders a search box
  properties:
      filter: initial value inside search textbox
      onSearchSubmit: callback, sends filter text to the parent
  this component is used in NavBar.js
*/

import React, { useState } from "react"

const SearchForm = props => {
  const [filter, setFilter] = useState(props.filter)

  const onSubmitHandler = event => {
    event.preventDefault()
    filter !== "" && props.onSearchSubmit(filter)
  }

  return (
    <form className="form-inline" onSubmit={onSubmitHandler}>
      <input
        className="form-control ml-sm-2"
        type="search"
        placeholder="جستجو"
        aria-label="جستجو"
        value={filter}
        onChange={event => setFilter(event.target.value)}
      />
      <button className="btn btn-light my-2 my-sm-0" type="submit">
        جستجو
      </button>
    </form>
  )
}

export default SearchForm
