/*
  this component is the home page
  this component is used in App.js
*/

import React, { useState, useEffect } from "react"
import { Redirect } from "react-router-dom"
import { toast } from "react-toastify"

import MainContainer from "../../Components/Shared/MainContainer/MainContainer"
import PostsList from "../../Components/PosttList/PostsList"
import Loading from "../../Components/Shared/Loading/Loading"
import PostModal from "../../Components/PostModal/PostModal"
import PostKeyModal from "../../Components/PostKeyModal/PostKeyModal"
import repository from "../../Repository"
import constants from "../../Tools/Constants"
import "./HomePage.css"

const HomePage = () => {
  const [posts, setPosts] = useState([])
  const [requestActive, setRequestActive] = useState(true)
  const [postModalVisible, setPostModalVisible] = useState()
  const [postKeyModalVisible, setPostKeyModalVisible] = useState()
  const [postKey, setPostKey] = useState()
  const [hasMore, setHasMore] = useState()
  const [filter, setFilter] = useState("")

  // getPosts() for the first time on mount
  useEffect(
    () => getPosts(""),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  //recieve posts from repository
  const getPosts = lastPostId => {
    repository
      .getPosts(lastPostId)
      .then(result => {
        const newPosts = posts.concat(result.posts)
        setHasMore(result.hasMore)
        setPosts(newPosts)
      })
      .catch(err => {
        setPosts(null)
        showMessage(false, err, constants.toastErrorDuration)
      })
      .finally(() => {
        setRequestActive(false)
      })
  }

  //used when user scrolls down, paging mechanism
  const onLoadMoreHandler = () => {
    const lastPostId = posts[posts.length - 1]._id
    getPosts(lastPostId)
  }

  //callback sent to MainContainer which triggerd when user clicks search button on the top navbar
  //render <Redirect> component and user will be directed to search page
  const onSearchSubmitHandler = filter => {
    setFilter(filter)
  }

  //call back sent to MainContainer which prompts a key for creating a new post
  const onNewPostClickHandler = () => {
    setPostKeyModalVisible(true)
  }

  //call back sent to edit modal, which will be called when user clicks cancell button
  const onNewPostCancelHandler = () => setPostModalVisible(false)

  //save button of the post modal click handler
  const onSaveSuccessfulHandler = (savedPost, newGeneralKey) => {
    setPostModalVisible(false)
    recreateStateAfterSave(savedPost)
  }

  //call back sent to edit modal, which will be called when a post is deleted
  const onDeleteSuccessfulHandler = deletedPost =>
    recreateStateAfterDelete(deletedPost)

  //update state after db save, recreate posts list
  const recreateStateAfterSave = savedPost => {
    let newPosts
    const i = posts.findIndex(post => post._id === savedPost._id)
    if (i === -1) {
      //new post saved, concat
      newPosts = [savedPost, ...posts]
    } else {
      posts[i] = savedPost
      newPosts = [...posts]
    }
    setPosts(newPosts)
  }

  //update state after db update, recreate posts list
  const recreateStateAfterDelete = deletedPost => {
    const newPosts = posts.filter(post => post._id !== deletedPost._id)
    setPosts(newPosts)
  }

  //call back send to key prompt modal, will be called when user entered a valid key
  const onPostKeyModalSuccessHandler = key => {
    setPostKey(key)
    setPostKeyModalVisible(false)
    setPostModalVisible(true)
  }

  //call back send to key prompt modal, will be called when user click cancel button
  const onPostKeyModalCancelClickHandler = () => setPostKeyModalVisible(false)

  // show toast message using <ToastContainer> located in App.js
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

  return (
    <MainContainer
      showNewPost
      onSearchSubmit={onSearchSubmitHandler}
      onNewPostClick={onNewPostClickHandler}
      filter=""
    >
      {requestActive ? (
        <Loading />
      ) : posts ? (
        posts.length === 0 ? (
          <div className="text-center">
            <h5 className="no-post">{constants.msgNoPosts}</h5>
          </div>
        ) : (
          <PostsList
            posts={posts}
            onSaveSuccessful={onSaveSuccessfulHandler}
            onDeleteSuccessful={onDeleteSuccessfulHandler}
            onLoadMore={onLoadMoreHandler}
            hasMore={hasMore}
          />
        )
      ) : (
        //error contacting server
        <div />
      )}
      {postModalVisible && (
        <PostModal
          post={{ _id: "", title: "", desc: "", date: "" }}
          postKey={postKey}
          onSaveSuccessful={onSaveSuccessfulHandler}
          onDeleteSuccessful={onDeleteSuccessfulHandler}
          onCancelClick={onNewPostCancelHandler}
        />
      )}
      {postKeyModalVisible && (
        <PostKeyModal
          msg={constants.msgEnterNewPostKey}
          onSuccess={onPostKeyModalSuccessHandler}
          onCancelClick={onPostKeyModalCancelClickHandler}
          isFirstPost={posts == null || posts.length === 0}
        />
      )}
      {filter !== "" && <Redirect to={`/search/${filter}`} push />}
    </MainContainer>
  )
}

export default HomePage
