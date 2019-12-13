/*
  this component renders a dialog to enter security key
  properties:
      postId: post id to which authentication should occured
      onCancelClick: callback for cancel button
      onSuccess: callback which called after a valid key is entered
      msg: message of the dialog
      isFirstPost: indicates if this is the first usage of the app
  this component is used in HomePage.js and PostItem.js
*/

import React, { useState } from "react"
import { Modal, ModalBody, Button, Form, FormGroup, Label } from "reactstrap"
import { toast } from "react-toastify"

import repository from "../../Repository"
import constants from "../../Tools/Constants"
import RequiredInput from "../Shared/RequiredInput/RequiredInput"
import "./PostKeyModal.css"

const PostKeyModal = props => {
  // impute state controllers
  const [key, setKey] = useState("")
  const [requestIsActive, setRequestIsActive] = useState()

  const onKeyStateChangeHandler = state => setKey(state.value)

  //click cancel button
  const onCancelClickHandler = () => props.onCancelClick()

  //click save button
  const onOkClickHandler = () => {
    let postId = props.postId ? props.postId : ""

    setRequestIsActive(true)
    repository
      .checkKey(key, postId)
      .then(result => {
        setRequestIsActive(false)
        if (result.isValid) {
          props.onSuccess(key)
        } else {
          showMessage(constants.msgInvalidKey)
        }
      })
      .catch(err => {
        setRequestIsActive(false)
        showMessage(err)
      })
  }

  // show toast
  const showMessage = msg => {
    const options = {
      position: "top-right",
      autoClose: constants.toastErrorDuration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      className: "toast-error",
      bodyClassName: "toast-body"
    }

    toast.error(msg, options)
  }

  return (
    <Modal
      isOpen
      toggle={onCancelClickHandler}
      className="text-right modal-sm"
      backdrop
      centered
    >
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="inputTitle">{props.msg}</Label>
            <RequiredInput
              autofocus
              type="password"
              id="inputTitle"
              placeholder="کلید"
              value={key}
              onStateChange={onKeyStateChangeHandler}
            />
          </FormGroup>

          <div className="row">
            <div className="col-sm-12">
              <Button
                color="primary"
                onClick={onOkClickHandler}
                size="sm"
                disabled={!props.isFirstPost && key === ""}
              >
                تایید
                {requestIsActive && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
              </Button>{" "}
              <Button color="danger" onClick={onCancelClickHandler} size="sm">
                انصراف
              </Button>
            </div>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default PostKeyModal
