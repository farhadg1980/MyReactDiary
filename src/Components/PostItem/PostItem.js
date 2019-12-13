/*
  this component renders a post in the list of posts
  properties:
      post: post entity of this item
      onDeleteSuccessful: call back which will be called if this item deleted
      onSaveSuccessful: call back which will be called if this item edited
  this component is used in PostList.js
*/

import React, { useState } from "react"
import { Button } from "reactstrap"

import PostModal from "../PostModal/PostModal"
import PostKeyModal from "../PostKeyModal/PostKeyModal"
import constants from "../../Tools/Constants"
import "./PostItem.css"

const PostItem = props => {
  const [postModalVisible, setPostModalVisible] = useState()
  const [postKeyModalVisible, setPostKeyModalVisible] = useState()
  const [postKey, setPostKey] = useState()

  //open post key modal
  const onEditClickHandler = () => setPostKeyModalVisible(true)

  //close modal
  const onEditCancelClickHandler = () => setPostModalVisible(false)

  const onDeleteSuccessfulHandler = deletedPost => {
    setPostModalVisible(false)
    //signal PostsList about delete
    props.onDeleteSuccessful(deletedPost)
  }

  const onSaveSuccessfulHandler = savedPost => {
    setPostModalVisible(false)
    //signal PostsList about save
    props.onSaveSuccessful(savedPost)
  }

  //entered key is valid
  const onPostKeyModalSuccessHandler = key => {
    setPostKey(key)
    setPostKeyModalVisible(false)
    setPostModalVisible(true)
  }

  const onPostKeyModalCancelClickHandler = () => setPostKeyModalVisible(false)

  return (
    <div className="post-item row">
      <div className="col-sm-12 card post-info">
        <h4 className="title">{props.post.title}</h4>
        <p className="text-dark">{props.post.desc}</p>
        <div className="row">
          <div className="col-sm-6">
            <p className="date text-secondary">{props.post.date}</p>
          </div>
          <div className="col-sm-6 text-left actions">
            <Button
              outline
              color="secondary"
              size="sm"
              className="ml-1"
              onClick={onEditClickHandler}
            >
              ویرایش
            </Button>
          </div>
        </div>
      </div>
      {postModalVisible && (
        <PostModal
          post={props.post}
          postKey={postKey}
          onSaveSuccessful={onSaveSuccessfulHandler}
          onDeleteSuccessful={onDeleteSuccessfulHandler}
          onCancelClick={onEditCancelClickHandler}
        />
      )}
      {postKeyModalVisible && (
        <PostKeyModal
          postId={props.post._id}
          msg={constants.msgEnterEditPostKey}
          onSuccess={onPostKeyModalSuccessHandler}
          onCancelClick={onPostKeyModalCancelClickHandler}
          isFirstPost={false}
        />
      )}
    </div>
  )
}

export default PostItem
