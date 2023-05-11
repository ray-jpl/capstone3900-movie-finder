import React, { useState, useEffect, useRef } from "react";


export default function ReviewInput({ movieId, reviewerId, getReviews, setReviewInputVisible }) {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef.current) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.current.style.height = "0px";
      const scrollHeight = textAreaRef.current.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.current.style.height = scrollHeight + "px";
    }
  }, [textAreaRef.current, review]);
  

  return(
    <div className="flex p-2 mb-3">
      <div className="mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 p-1 rounded-full border">
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="w-full flex flex-col">
        <h1 className="font-bold"></h1> 
        <form 
          action="POST" 
          className="flex flex-col" 
          onSubmit={(e) => {
            e.preventDefault();
            postReview(movieId, reviewerId, review, rating, getReviews);
          }}
        >
          <textarea 
            name="review"
            id="review"
            ref={textAreaRef} 
            className="no-scrollbar mb-2 p-1 border-b-2 dark:border-white dark:bg-inherit focus:ring-0 focus:outline-none" 
            rows="1" 
            placeholder="Write your review here!" 
            onInput={(e) => setReview(e.target.value)}> 
          </textarea>
          
          <div className="w-full flex flex-row justify-end items-center">
            <label for="rating">Rating (0-5)</label>
            <input 
              name="rating" 
              className="ml-1 mb-1 p-1 border-b-2 dark:border-white bg-inherit focus:ring-0 focus:outline-none" 
              type="number" 
              min={0} 
              max={5} 
              onInput={(e) => setRating(e.target.value)}
            />
          </div>
          <div className="w-full mt-4 flex flex-row justify-end items-center">
            <button 
              className="mx-1 px-2 py-1 bg-inherit dark:text-white hover:text-gray-200 hover:underline"
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                setReviewInputVisible(false);
              }}
            >
              Cancel
            </button>
            
            <button className="mx-1 px-2 py-1 rounded bg-orange-500 border border-orange-500 text-black hover:bg-orange-400 hover:underline" type="submit">Submit</button>
          </div>
        </form>
      </div>
      
    </div>
  );
}

const postReview = async ( movieId, reviewerId, review, rating, getReviews ) => {
  console.log("submitting...")
  const url = `http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/reviews/post_review`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
              'movieId' : movieId,
              'reviewerId' : reviewerId,
              'review': review,
              "rating": rating,
            })
    });
    const data = await res.json();
    if (data.success) {
      // Need to wait as calling immediately results in no update
      // as function is called before data is fully written to db
      setTimeout(getReviews, 500);
      return (true);
    }
  } catch (err) {
    console.log(err);
    return (false);
  }
}