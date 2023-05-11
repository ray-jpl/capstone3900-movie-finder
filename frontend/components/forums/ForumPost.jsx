import { Context, useContext } from '../../context'
import DeleteModal from "../modals/DeleteModal";
import Link from "next/link";
import React from "react";


export default function ForumPost( {postId, movieId, userId, userName, message, timestamp, setMessageHasBeenEdited, setMessageHasBeenDeleted} ) {

  const { getters, setters } = useContext(Context);
  const [open, setOpen] = React.useState(false);
  
  const [hoverState, setHoverState] = React.useState(false);
  const [editState, setEditState] = React.useState(false);
  const [updatedMessage, setUpdatedMessage] = React.useState(message);
  
  timestamp = new Date(timestamp);

  return (
    <Context.Provider value={{ getters, setters }}>
      <div
        className="w-full mt-2 mb-2 pl-2 pr-2 pt-2 pb-3 dark:bg-neutral-800 rounded-xl"
        onMouseEnter={() => { 
          if (Number(userId) === Number(getters.loggedInUserId)) setHoverState(true) 
        }}
        onMouseLeave={() => { 
          if (Number(userId) === Number(getters.loggedInUserId)) setHoverState(false) 
        }}
        onMouseOver={() => { 
          if (Number(userId) === Number(getters.loggedInUserId)) setHoverState(true) 
        }}
        onMouseOut={() => { 
          if (Number(userId) === Number(getters.loggedInUserId)) setHoverState(false) 
        }}
      >
        <div>
          {/* Dp Image goes here */}
          <div
            className="w-full flex flex-col"
          >
            
              {/* Name */}
              <Link
                className="text-lg ml-1 mr-1 max-w-max dark:text-white font-bold hover:underline"
                href={`./../../../profile/${userId}`}
              >
                {userName}
              </Link>
            {/* Time */}
            <h4
              className="-translate-y-7 text-xs dark:text-white font-bold text-right"
            >
              Posted {timestamp.getHours() < 10 ? `0${timestamp.getHours()}` : timestamp.getHours()}:{timestamp.getMinutes() < 10 ? `0${timestamp.getMinutes()}` : timestamp.getMinutes()} {timestamp.getDate() < 10 ? `0${timestamp.getDate()}` : timestamp.getDate()}/{timestamp.getMonth() < 10 ? `0${timestamp.getMonth()}` : timestamp.getMonth()}/{timestamp.getFullYear()}
            </h4>
          </div>
        </div>
        { !editState 
          ? <div
              className="flex flex-row justify-between"
            >
              {/* Message */}
              <p
                className="text-base ml-1 mr-1 dark:text-white"
              >
                {message}
              </p>
              { hoverState &&
                <div
                  className="flex flex-end justify-end"
                >
                  <button
                    className=""
                    onClick={() => {
                      if (editState) {
                        setEditState(false);
                      } else {
                        setEditState(true);
                      }
                    }}
                  >
                    <svg 
                      className="w-6 h-6 dark:stroke-neutral-400 dark:hover:stroke-neutral-200"
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <button
                    className="ml-1"
                    onClick={() => {
                      setOpen(true)
                    }}
                  >
                    <svg
                      className="w-6 h-6 dark:stroke-neutral-400 dark:hover:stroke-neutral-200" 
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              }
            </div>
          : <div>
              <textarea 
                id="txtarea"
                className={updatedMessage === "" ?
                  "shadow appearance-none bg-inherit border-2 dark:border-neutral-600 w-full py-2 px-3 text-gray-700 dark:text-white dark:placeholder-neutral-300 leading-tight focus:outline-none focus:shadow-outline resize-none overflow-hidden rounded-lg transition ease-in-out"
                  :
                  "shadow appearance-none bg-inherit border-2 dark:border-neutral-600 w-full py-2 px-3 text-gray-700 dark:text-white dark:placeholder-neutral-300 leading-tight focus:outline-none focus:shadow-outline resize-none overflow-hidden rounded-lg transition ease-in-out dark:bg-neutral-600"
                }
                defaultValue={message}
                onInput={(event) => {
                  setUpdatedMessage(event.target.value);
                }}
              />
              <div
                className="w-full flex flex-row justify-end"
              >
                <button
                  className="w-max mt-2 mb-2 py-1 px-3 rounded dark:bg-neutral-600 dark:text-white dark:hover:bg-neutral-500 hover:underline font-bold text-lg"
                  onClick={() => {
                    setEditState(false)
                  }}
                >
                  Cancel
                </button>
                <button
                  className="w-max mt-2 mb-2 ml-1 py-1 px-3 rounded dark:bg-orange-500 dark:text-black dark:hover:bg-orange-400 hover:underline font-bold text-lg"
                  onClick={() => {
                    const editPost = async () => {
                      const bodyData = {
                        postId: postId,
                        message: updatedMessage
                      }
                      const data = await fetch(`http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/movies/post_forum/${movieId}`, {
                        method: 'PUT',
                        body: JSON.stringify(bodyData)
                      })
                        .then(res => res.json())
                        .then((resData) => {
                          setMessageHasBeenEdited(true);
                          console.log(resData);
                        })
                    }
                    try {
                      editPost()
                      setEditState(false)
                    } catch (err) {
                      console.log(err)
                    } 
                  }}
                >
                  Update
                </button>
              </div>
            </div>
        }
      </div>
      <DeleteModal 
        open={open} 
        setOpen={setOpen}
        postId={postId} 
        movieId={movieId}
        setMessageHasBeenDeleted={setMessageHasBeenDeleted}
      />
    </Context.Provider>
  );
}