/*
  this components contains main routes of reacts
  also contains ToastContainer component which renders toast messages if ShowMessage method called in other components
  this components is used in main index.js
*/

import React from "react"
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom"
import { ToastContainer, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import HomePage from "./Pages/HomePage/HomePage"
import SearchPage from "./Pages/SearchPage/SearchPage"

const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
          <Route path="/search/:filter" exact>
            <SearchPage />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>
      <ToastContainer transition={Slide} />
    </div>
  )
}

export default App
