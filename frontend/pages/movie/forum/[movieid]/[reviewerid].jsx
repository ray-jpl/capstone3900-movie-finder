import React, { useEffect, useRef, useState } from "react";
import { Context, useContext } from '../../../../context'

import Layout from "../../../../components/Layout";
import Link from "next/link";
import ForumPost from "../../../../components/forums/ForumPost";


export default function ForumPage({ params, forumData, movieData }) {
  const { getters, setters } = useContext(Context);

  const textareaRef = useRef(null);
  const [messageInput, setMessageInput] = useState("");
  const [forumDataState, setForumDataState] = useState(forumData);
  const [submitState, setSubmitState] = useState(false);
  const [getFetchComplete, setGetFetchComplete] = useState(false);
  const [messageHasBeenEdited, setMessageHasBeenEdited] = useState(false);
  const [messageHasBeenDeleted, setMessageHasBeenDeleted] = useState(false);

  useEffect(() => {
    textareaRef.current.style.height = "67px";
    const scrollHeight = textareaRef.current.scrollHeight;
    if (Number(scrollHeight) > 67) textareaRef.current.style.height = scrollHeight + "px";
  }, [messageInput]);

  useEffect(() => {
    if (submitState && messageInput === "") {
      const updateForumDataState = async () => {
        try {
          const data = await fetch(`http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/movies/get_forum/${params.movieid}/${getters.loggedInUserId}`, {
            method: 'GET'
          })
            .then(res => res.json())
            .then((resData) => {
              setForumDataState(resData)
            })
        } catch (err) {
          console.log(err)
        } finally {
          setGetFetchComplete(true)
        }
      }
      setTimeout(() => { updateForumDataState() }, 500)
      setSubmitState(false)
    } else if (messageHasBeenEdited) {
      const updateForumDataState = async () => {
        try {
          const data = await fetch(`http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/movies/get_forum/${params.movieid}/${getters.loggedInUserId}`, {
            method: 'GET'
          })
            .then(res => res.json())
            .then((resData) => {
              setForumDataState(resData)
            })
        } catch (err) {
          console.log(err)
        } finally {
          setGetFetchComplete(true)
        }
      } 
      setTimeout(() => { updateForumDataState() }, 700)
      setMessageHasBeenEdited(false);
    } else if (messageHasBeenDeleted) {
      const updateForumDataState = async () => {
        try {
          const data = await fetch(`http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/movies/get_forum/${params.movieid}/${getters.loggedInUserId}`, {
            method: 'GET'
          })
            .then(res => res.json())
            .then((resData) => {
              setForumDataState(resData)
            })
        } catch (err) {
          console.log(err)
          console.log("here is the error")
        } finally {
          setGetFetchComplete(true)
        }
      } 
      setTimeout(() => { updateForumDataState() }, 500)
      setMessageHasBeenDeleted(false);
    }
  }, [submitState, messageHasBeenEdited, messageHasBeenDeleted]);

  useEffect(() => {
    if (getFetchComplete) {
      setGetFetchComplete(false)
    }
  }, [getFetchComplete]);

  useEffect(() => {
    // console.log(forumDataState);
  }, [forumDataState]);

  return (
    <Context.Provider value={{ getters, setters }}>
      <Layout>
        <Link href={`/movie/${params['movieid']}`}>
          <h1 className='text-xl dark:text-orange-500 transition hover:-translate-x-4 mb-2'>
            ← Go back to {movieData.title}'s movie page
          </h1>
        </Link> 
        <h1 className="text-4xl mb-5 font-bold dark:text-white">Discussion Forum for {movieData.title}</h1>
        <div
          className="w-full mb-2 py-2 px-4 flex flex-col rounded-xl dark:bg-neutral-700 max-h-max"
        >
          <textarea 
            id="txtarea"
            className={messageInput === "" ?
              "shadow appearance-none bg-inherit border-2 dark:border-neutral-600 w-full py-2 px-3 text-gray-700 dark:text-white dark:placeholder-neutral-300 leading-tight focus:outline-none focus:shadow-outline resize-none overflow-hidden rounded-lg transition ease-in-out"
              :
              "shadow appearance-none bg-inherit border-2 dark:border-neutral-600 w-full py-2 px-3 text-gray-700 dark:text-white dark:placeholder-neutral-300 leading-tight focus:outline-none focus:shadow-outline resize-none overflow-hidden rounded-lg transition ease-in-out dark:bg-neutral-600"
            }
            placeholder="Join the discussion..."
            ref={textareaRef}
            onInput={(event) => {
              setMessageInput(event.target.value);
            }}
          />
          <div
            className="w-full flex flex-row justify-end"
          >
            <button
              className="w-max mt-2 mb-2 py-1 px-3 rounded dark:bg-orange-500 dark:text-black dark:hover:bg-orange-400 hover:underline font-bold text-lg"
              onClick={() => {
                const postInForum = async () => {
                  const bodyData = {
                    reviewerId: getters.loggedInUserId,
                    message: messageInput,
                  }
                  const data = await fetch(`http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/movies/post_forum/${params['movieid']}`, {
                    method: 'POST',
                    body: JSON.stringify(bodyData)
                  })
                    .then(res => res.json())
                    .then(() => {
                      setSubmitState(true)
                      setMessageInput("")
                      const textarea = document.getElementById("txtarea")
                      textarea.value = ""
                    })
                }
                try {
                  postInForum();
                } catch (err) {
                  console.log(err)
                }
              }}
            >
              Post
            </button>
          </div>
        </div>
        <div
          className="w-full mb-2 py-2 px-4 flex flex-col items-center rounded-xl dark:bg-neutral-700"
        >
          {
            forumDataState['error'] ? 
            <p className="italic dark:text-white"> 
              There are no forum posts for {movieData.title}. Start a discussion!!
            </p>
            :
            forumDataState.map((forumPost) => {
              return (
                <ForumPost postId={forumPost.postId} movieId={forumPost.movieId} userId={forumPost.userId} userName={forumPost.name} message={forumPost.message} timestamp={forumPost.timestamp} setMessageHasBeenEdited={setMessageHasBeenEdited} setMessageHasBeenDeleted={setMessageHasBeenDeleted}/>
              );
            })
          }
        </div>
      </Layout>
    </Context.Provider>
  );
}

export async function getServerSideProps({ params }) {
  // Fetch data from external BE
  const forumData = await fetch(`http://${process.env.BE_SERVERSIDE_HOST}:${process.env.BE_SERVERSIDE_PORT}/movies/get_forum/${params.movieid}/${params.reviewerid}`)
    .then(res => res.json())

  const movieData = await fetch(`http://${process.env.BE_SERVERSIDE_HOST}:${process.env.BE_SERVERSIDE_PORT}/movies/get_details/${params.movieid}`)
    .then(res => res.json())

  const userData = await fetch(`http://${process.env.BE_SERVERSIDE_HOST}:${process.env.BE_SERVERSIDE_PORT}/accounts/profile/${params.reviewerid}`)
    .then(res => res.json())

  // Pass data to the page via props
  return { props: { params, forumData, movieData, userData } }
}