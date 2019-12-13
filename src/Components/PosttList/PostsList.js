/*
    this components renders a list of posts
    properties:
        posts: posts list which post items should be created its items
        onDeleteSuccessful: call back which will be called if an item deleted
        onSaveSuccessful: call back which will be called if an  item edited
        onLoadMore: call back used infinite scroll
        hasMore: call back used infinite scroll
    this component is used in HomePage.js and SearchPage.js
*/

import React from "react"
import InfiniteScroll from "react-infinite-scroller"

import PostItem from "../PostItem/PostItem"
import "./PostsList.css"

//should receive "posts" as an array in props
const PostsList = props => {
  const onDeleteSuccessfulHandler = deletedPost =>
    props.onDeleteSuccessful(deletedPost) //signal HomePage about delete
  const onSaveSuccessfulHandler = savedPost => props.onSaveSuccessful(savedPost) //signal HomePage about save

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={props.onLoadMore}
      hasMore={props.hasMore}
    >
      {props.posts.map(post => (
        <PostItem
          key={post._id}
          post={post}
          onSaveSuccessful={onSaveSuccessfulHandler}
          onDeleteSuccessful={onDeleteSuccessfulHandler}
        />
      ))}
    </InfiniteScroll>
  )
}

export default PostsList
