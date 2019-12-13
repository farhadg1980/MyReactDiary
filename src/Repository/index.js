/*
  this component is the repository of the project
  this component is responsible to communicate to back end and analayze received status code and data
  other components which need to manipulate date should use this component's methods
*/

import constants from "../Tools/Constants"
import { Promise } from "bluebird"

Promise.config({
  cancellation: true
})

const postsUrl = `${constants.serverAddress}/api/posts`
const authUrl = `${constants.serverAddress}/api/auth`
const limit = constants.postFetchLimit
export default {
  //request some posts from server start from a specific post
  //latPostId is the last received post id used for paging
  //for first page lastPostId should be " "
  //used api: GET [server-address]/api/posts/:limit/:lastPostId
  getPosts: lastPostId => {
    let url = `${postsUrl}/${limit}`

    if (lastPostId === "") {
      url = `${url}/%20`
    } else {
      url = `${url}/${lastPostId}`
    }

    return runFetch(fetch(url))
  },

  //search method a filter and lastPostId for paging or " " for first page
  //used api: GET [server-address]/api/posts/search/:filter/:limit/:lastPostId
  search: (filter, lastPostId) => {
    let url = `${postsUrl}/search/${filter}/${limit}`

    if (lastPostId === "") {
      url = `${url}/%20`
    } else {
      url = `${url}/${lastPostId}`
    }

    return runFetch(fetch(url))
  },

  //insert a new single post
  //used api: POST [server-address]/api/posts
  insertPost: (newPost, key) => {
    let url = postsUrl

    const fetchRequest = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        post: {
          title: newPost.title,
          desc: newPost.desc,
          date: newPost.date
        },
        key: key
      })
    })

    return runFetch(fetchRequest)
  },

  //update a single post
  //used api: PATCH [server-address]/api/posts/:postId
  updatePost: (post, key) => {
    let url = `${postsUrl}/${post._id}`
    const fetchRequest = fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        post: {
          title: post.title,
          desc: post.desc,
          date: post.date
        },
        key: key
      })
    })

    return runFetch(fetchRequest)
  },

  //delete a single post
  //used api: DELETE [server-address]/api/posts/:postId
  deletePost: (postId, key) => {
    let url = `${postsUrl}/${postId}`
    const fetchRequest = fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        key: key
      })
    })

    return runFetch(fetchRequest)
  },

  //check an entered key against a post
  //used api: POST [server-address]/api/auth
  checkKey: (key, postId) => {
    const fetchRequest = fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        key,
        postId
      })
    })

    return runFetch(fetchRequest)
  }
}

//run each fetch method of preveios methods and status codes and return json response if status code is 200
const runFetch = fetchRequest => {
  const promise = new Promise((resolve, reject) => {
    fetchRequest
      .then(response => {
        switch (response.status) {
          case 200:
            //find ok
            return response.json()
          case 400: {
            reject(constants.msgInvalidRequest)
            promise.cancel()
            break
          }
          case 404: {
            reject(constants.msgNotFound)
            promise.cancel()
            break
          }
          default: //status 500
          {
            reject(constants.msgServerError)
            promise.cancel()
          }
        }
      })
      .then(jsonResponse => {
        resolve(jsonResponse)
      })
      .catch(err => {
        console.log(err)
        reject(constants.msgRequestError)
      })
  })

  return promise
}
