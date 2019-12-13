/*
  this component renders a modal dialog to edit ot delete a post
  properties:
      post: a post entity to edit or delete
      postKey: security key 
      onSaveSuccessful: callback which will be called after save
      onDeleteSuccessful: callback which will be called after delete
      onCancelClick: callback for cancel button
  this component is used in HomePage.js and PostItem.js
*/

import React, { useState } from "react"
import { Modal, ModalBody, Button, Form, FormGroup, Label } from "reactstrap"
import { toast } from "react-toastify"

import ConfirmModal from "../../Components/Shared/ConfirmModal/ConfirmModal"
import RequiredInput from "../Shared/RequiredInput/RequiredInput"
import repository from "../../Repository"
import constants from "../../Tools/Constants"
import "./PostModal.css"

const PostModal = props => {
  const [showConfirm, setShowConfirm] = useState()
  const [confirmMessage, setConfirmMessage] = useState()
  const [confirmType, setConfirmType] = useState()
  const [saveRequestIsActive, setSaveRequestIsActive] = useState()
  const [deleteRequestIsActive, setDeleteRequestIsActive] = useState()

  //create a copy of post
  const post = {
    _id: props.post._id,
    title: props.post.title,
    desc: props.post.desc,
    date: props.post.date
  }

  // impute state controllers
  const [title, setTitle] = useState(post.title)
  const [desc, setDesc] = useState(post.desc)
  const [date, setDate] = useState(post.date)
  const onTitleStateChangeHandler = state => setTitle(state.value)
  const onDescChangeHandler = state => setDesc(state.value)
  const onDateChangeHandler = state => setDate(state.value)

  //click cancel button
  const onCancelClickHandler = () => {
    // data changed, get confirm before exit
    if (postChanged()) {
      setConfirmType(constants.confirmTypeExit)
      setConfirmMessage(constants.msgExit)
      setShowConfirm(true)
    } else {
      props.onCancelClick()
    }
  }

  //click save button
  const onSaveClickHandler = () => {
    const postToSave = {
      _id: post._id,
      title,
      desc,
      date
    }

    //update post
    if (postToSave._id === "") {
      //new mode
      insertPost(postToSave)
    } else {
      //edit mode
      updatePost(postToSave)
    }
  }

  //show delete confirm
  const onDeleteClickHandler = () => {
    setConfirmType(constants.confirmTypeDelete)
    setConfirmMessage(constants.msgDeletePost)
    setShowConfirm(true)
  }

  //check if data changed to activate save button
  const postChanged = () => {
    return title !== post.title || desc !== post.desc || date !== post.date
  }

  // save new post
  const insertPost = postToSave => {
    setSaveRequestIsActive(true)
    repository
      .insertPost(postToSave, props.postKey)
      .then(result => {
        //show the new general key
        showMessage(
          true,
          `${constants.msgNewKey + result.newGeneralKey}`,
          constants.toastSuccessDuration
        )

        //show the post key
        showMessage(
          true,
          `${constants.msgPostKey + result.postKey}`,
          constants.toastSuccessDuration
        )
        setSaveRequestIsActive(false)
        props.onSaveSuccessful(result.post)
      })
      .catch(err => {
        setSaveRequestIsActive(false)
        showMessage(false, err, constants.toastErrorDuration)
      })
  }

  // save edited post
  const updatePost = postToSave => {
    setSaveRequestIsActive(true)
    repository
      .updatePost(postToSave, props.postKey)
      .then(result => {
        if (result.newGeneralKey !== "") {
          //new general key created for user
          showMessage(
            true,
            `${constants.msgNewKey + result.newGeneralKey}`,
            constants.toastSuccessDuration
          )
        }
        setSaveRequestIsActive(false)
        props.onSaveSuccessful(postToSave)
      })
      .catch(err => {
        setSaveRequestIsActive(false)
        showMessage(false, err, constants.toastErrorDuration)
      })
  }

  //delete a post
  const deletePost = () => {
    setShowConfirm(false)
    setDeleteRequestIsActive(true)
    repository
      .deletePost(post._id, props.postKey)
      .then(result => {
        if (result.newGeneralKey !== "") {
          //new general key created for user
          showMessage(
            true,
            `${constants.msgNewKey + result.newGeneralKey}`,
            constants.toastSuccessDuration
          )
        }
        setDeleteRequestIsActive(false)
        //delete Success
        props.onDeleteSuccessful(post)
      })
      .catch(err => {
        setDeleteRequestIsActive(false)
        showMessage(false, err, constants.toastErrorDuration)
      })
  }

  // show toast
  const showMessage = (isSuccess, msg, duration) => {
    const options = {
      position: "top-right",
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      className: isSuccess ? "toast-success" : "toast-error",
      bodyClassName: "toast-body"
    }

    if (isSuccess) {
      toast.success(msg, options)
    } else {
      toast.error(msg, options)
    }
  }

  //user accept the delete operation
  const onDeleteConfirmAcceptClickHandler = () => {
    if (confirmType === constants.confirmTypeExit) {
      props.onCancelClick()
    } else {
      //delete confirm
      deletePost()
    }
  }

  //user reject the delete operation
  const onDeleteConfirmRejectClickHandler = () => {
    setShowConfirm(false)
  }

  return (
    <Modal
      isOpen
      toggle={onCancelClickHandler}
      className="text-right modal-xl"
      backdrop
      centered
    >
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="inputTitle">عنوان</Label>
            <RequiredInput
              autofocus
              type="text"
              id="inputTitle"
              placeholder="عنوان"
              value={title}
              onStateChange={onTitleStateChangeHandler}
            />
          </FormGroup>
          <FormGroup>
            <Label for="inputDesc">متن</Label>
            <RequiredInput
              className="post-desc-editor"
              type="textarea"
              id="inputDesc"
              placeholder="متن"
              value={desc}
              onStateChange={onDescChangeHandler}
            />
          </FormGroup>
          <FormGroup>
            <Label for="inputDate">تاریخ و زمان</Label>
            <RequiredInput
              type="text"
              id="inputDate"
              placeholder="تاریخ و زمان"
              value={date}
              onStateChange={onDateChangeHandler}
            />
          </FormGroup>
          <div className="row">
            <div className="col-sm-6">
              <Button
                color="primary"
                onClick={onSaveClickHandler}
                size="sm"
                disabled={
                  title === "" || desc === "" || date === "" || !postChanged()
                }
              >
                ذخیره
                {saveRequestIsActive && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
              </Button>{" "}
              <Button
                color="danger"
                onClick={onDeleteClickHandler}
                size="sm"
                disabled={props.post._id === ""}
              >
                حذف
                {deleteRequestIsActive && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
              </Button>
            </div>
            <div className="col-sm-6 text-left">
              <Button
                color="secondary"
                onClick={onCancelClickHandler}
                size="sm"
              >
                انصراف
              </Button>
            </div>
          </div>
        </Form>
      </ModalBody>
      {showConfirm && (
        <ConfirmModal
          message={confirmMessage}
          onAcceptClick={onDeleteConfirmAcceptClickHandler}
          onRejectClick={onDeleteConfirmRejectClickHandler}
        />
      )}
    </Modal>
  )
}

export default PostModal
