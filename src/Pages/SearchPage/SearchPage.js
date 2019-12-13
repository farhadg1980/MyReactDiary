/*
  this component is the search page
  this component is used in App.js
*/

import React, { useState, useEffect } from "react"
import { useParams, Redirect } from "react-router-dom"
import { toast } from "react-toastify"

import PostsList from "../../Components/PosttList/PostsList"
import MainContainer from "../../Components/Shared/MainContainer/MainContainer"
import Loading from "../../Components/Shared/Loading/Loading"
import PostModal from "../../Components/PostModal/PostModal"
import constants from "../../Tools/Constants"
import repository from "../../Repository"
import "./SearchPage.css"

const SearchPage = () => {
  const { filter } = useParams()
  const [filterChanged, setFilterChanged] = useState(false)
  const [newFilter, setNewFilter] = useState("")
  const [posts, setPosts] = useState([])
  const [requestActive, setRequestActive] = useState()
  const [postModalVisible, setPostModalVisible] = useState()
  const [hasMore, setHasMore] = useState()

  // getPosts() for the first time on mounting of this component
  useEffect(() => {
    setRequestActive(true)
    findPosts(true, filter, "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (newFilter !== "") {
      setRequestActive(true)
      findPosts(true, newFilter, "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newFilter])

  //use repository to find posts
  const findPosts = (isNewSearch, filter, lastPostId) => {
    repository
      .search(filter, lastPostId)
      .then(result => {
        setHasMore(result.hasMore)
        if (isNewSearch) {
          setPosts(result.posts)
        } else {
          const newPosts = posts.concat(result.posts)
          setPosts(newPosts)
        }
      })
      .catch(err => {
        setPosts(null)
        showMessage(false, err)
      })
      .finally(() => {
        setRequestActive(false)
      })
  }

  //used when user scrolls down
  const onLoadMoreHandler = () => {
    const lastPostId = posts[posts.length - 1]._id
    findPosts(false, filter, lastPostId)
  }

  //callback sent to MainContainer which triggerd when user clicks search button on the top navbar
  const onSearchSubmitHandler = newFilterString => {
    if (filter !== newFilterString) {
      setFilterChanged(true)
      setNewFilter(newFilterString)
    }
  }

  //save button of the post modal click handler
  const onSaveSuccessfulHandler = savedPost => {
    setPostModalVisible(false)
    recreateStateAfterSave(savedPost)
  }

  //occurs when a post is deleted
  const onDeleteSuccessfulHandler = deletedPost =>
    recreateStateAfterDelete(deletedPost)

  //update the saved post in the list and render page
  const recreateStateAfterSave = savedPost => {
    let newPosts
    const i = posts.findIndex(post => post._id === savedPost._id)
    posts[i] = savedPost
    newPosts = [...posts]
    setPosts(newPosts) //trigger rendering
  }

  //remove post from posts list and render page
  const recreateStateAfterDelete = deletedPost => {
    const newPosts = posts.filter(post => post._id !== deletedPost._id)
    setPosts(newPosts) //trigger rendering
  }

  // show toast message using <ToastContainer> located in App.js
  const showMessage = (isSuccess, msg) => {
    const options = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      className: isSuccess ? "toast-success" : "toast-error",
      bodyClassName: "toast-body"
    }

    isSuccess ? toast.success(msg, options) : toast.error(msg, options)
  }

  return (
    <MainContainer
      showHome
      onSearchSubmit={onSearchSubmitHandler}
      filter={filter}
    >
      {requestActive ? (
        <Loading />
      ) : posts ? (
        posts.length === 0 && !requestActive ? (
          <div className="text-center">
            <h5 className="no-post">{constants.msgNoResult}</h5>
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
          onSaveSuccessful={onSaveSuccessfulHandler}
          onDeleteSuccessful={onDeleteSuccessfulHandler}
        />
      )}
      {filterChanged && <Redirect to={`/search/${newFilter}`} />}
    </MainContainer>
  )
}

export default SearchPage
