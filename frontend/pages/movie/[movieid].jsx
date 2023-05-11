import React, { useEffect, useState } from "react";
import { Context, useContext } from '../../context'

import Image from "next/image";
import Layout from "../../components/Layout";
import Link from "next/link";
import Recommended from "../../components/Recommended";
import ReviewCard from "../../components/reviews/ReviewCard";
import ReviewInput from "../../components/reviews/ReviewInput";
import RedirectModal from "../../components/modals/RedirectModal";
import { useRouter } from "next/router";

export default function MoviePage({ movieData, params }) {
  const { getters, setters } = useContext(Context);
  
  const [open, setOpen] = useState(false)

  const [movieInWishlist, setMovieInWishlist] = useState(false);

  const [redirectMsg, setRedirectMsg] = useState("");
  const [rating, setRating] = useState(movieData.rating);

  const [fetchError, setFetchError] = useState(null);
  
  const [reviewData, setReviewData] = useState(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [reviewInputVisible, setReviewInputVisible] = useState(false);

  const [expandCast, setExpandCast] = useState(false);

  const router = useRouter()

  const toggleReviewInputVisibility = () => {
    if (getters.loggedInState == true) {
      if (!reviewInputVisible) {
        document.getElementById('reviewSection').scrollIntoView();
      }
      setReviewInputVisible(!reviewInputVisible);
    } else {
      setRedirectMsg("Login to your account to write reviews! If you do not have an account then register for one below")
      setOpen(true);
    }
  }
  
  const getReviews = async () => {
    const url = `http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/reviews/get_review/${movieData.id}/${getters.loggedInUserId}`;
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    try {
      const res = await fetch(url, params);
      const data = await res.json();
      if (data.error) throw Error(data.error);
      setReviewData(data);
      getRating();
    } catch (error) {
      setReviewData(null);
      setFetchError(error.msg);
    } finally {
      setIsLoadingReviews(false);
    }
  }
  
  const getRating = async () => {
    try {
      const res = await fetch(`http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/reviews/get_rating/${movieData.id}/${getters.loggedInUserId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json();
      setRating(data.rating);
    } catch (error) {
      console.log(error)
    }
  }

  const addToWishList = async () => {
    try {
      const res = await fetch(`http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/accounts/watchlist/${getters.loggedInUserId}`, {
        method: "POST",
        body: JSON.stringify({'movie': params['movieid']})
      })
      const data = await res.json();
      if (data.error) throw Error(data.error);
    } catch (error) {
      console.log(error)
    }
  } 

  const removeFromWishList = async () => {
    try {
      const res = await fetch(`http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/accounts/watchlist/${getters.loggedInUserId}`, {
        method: "DELETE",
        body: JSON.stringify({'movie': params['movieid']})
      })
      const data = await res.json();
      if (data.error) throw Error(data.error);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getReviews();
    getRating();
  },[movieData]);

  useEffect(() => {
    if (getters.loggedInUserId > 0) {
      const determineMovieInWishlist = async (id) => {
        try {
          const res = await fetch(`http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/accounts/watchlistIdsOnly/${getters.loggedInUserId}`, {
            method: 'GET'
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          setMovieInWishlist(data["result"].includes(Number(id)))
        } catch (error) {
          console.log(error)
        }   
      }
      determineMovieInWishlist(params['movieid']);
    } else {
      setMovieInWishlist(false)
    }
  },[router.asPath])
  
  if (movieData == null || movieData.error) {
    return(<Layout>
      <div className="flex justify-center items-center">
        <p>{movieData ? movieData.error : "Invalid Movie"}</p>
      </div>
    </Layout>);
  }
  return(
    <Context.Provider value={{ getters, setters }}>
      <Layout>
        <div className="flex flex-col dark:text-white mb-24">
          <div className="w-full my-2 mt-6 flex justify-between">
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold dark:text-white">{movieData.title}</h1>
              <h3 className="text-lg text-gray-600 dark:text-neutral-300"> {movieData.year} | {movieData.runtime} mins</h3>
            </div>
            
            <div className="flex">
              { getters.loggedInState
                ? <button 
                    className="mx-1" 
                    title={movieInWishlist ? "Remove from wish list" : "Add to wish list"} 
                    onClick={() => {
                      if (getters.loggedInState) {
                        setMovieInWishlist(!movieInWishlist);
                        !movieInWishlist ? addToWishList() : removeFromWishList();
                      } else {
                        setRedirectMsg("Login to your account to view the discussion forum! If you do not have an account then register for one below");
                        setOpen(true);
                      }
                    }}
                  >
                    <svg className={`w-6 h-6 stroke-orange-500 ${movieInWishlist ? "fill-orange-500 hover:fill-none focus:fill-none" : "fill-none hover:fill-orange-500 focus:fill-orange-500"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                  </button>
                : null
              }
              <div className="flex flex-col justify-center items-center">
                <div className="text-sm font-semibold dark:text-neutral-300">Review Rating</div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#fde047" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fde047" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  <p className="dark:text-white font-bold">{(Math.round(rating * 10) / 10).toFixed(1)}<span className="dark:text-neutral-300 font-normal">/5</span></p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center"> 
            <Image 
              src={movieData.image}
              className="w-full aspect-[16/9] overflow-hidden bg-gray-200 rounded object-cover"
              alt={`${movieData.title} thumbnail`}
              priority
            />
          </div>
          
          <div className="my-4 px-4">
            {movieData.genreList.map((genre) => {
              return(
              <button 
                className="px-2 py-1 mx-2 rounded-full border text-sm dark:border-white dark:text-white bg-opacity-20 hover:bg-neutral-500 hover:underline"
              >
                <Link href={`/genre/${genre}`}>{genre}</Link>
              </button>);
            })}
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="md:basis-2/3">
              <div className="p-4 mb-4 bg-gray-100 dark:bg-neutral-800 rounded">
                <p className="px-2 mb-4">{movieData.description}</p>
                
                <hr/>
                
                <div className="px-2 my-4 flex">
                  <p className="pr-1 font-bold">Director:</p>
                  <Link href={`/director/${movieData.directorId}`}><p className="text-blue-300 hover:text-blue-600 hover:underline">{movieData.director}</p></Link>
                </div>

                <hr/>

                <div className="px-2 my-4 flex">
                  <p className="pr-1 font-bold">Writers:</p>
                  <p>{movieData.writerList.map((writer, index) => {return(<span>{(index ? ', ' : '')}<span className="text-blue-300 hover:text-blue-600 hover:underline"><Link href={`/writer/${writer[1]}`}>{writer[0]}</Link></span> </span>)})}</p>
                </div>

                <hr/>

                <div className="px-2 mt-4 flex justify-between">
                  <div className="flex">
                    <p className="pr-1 font-bold">Starring:</p>
                    <p className={`${expandCast ? "" : "line-clamp-1"}`}>{movieData.castList.map((cast, index) => {return(<span>{(index ? ', ' : '')}<span><Link href={`/cast/${cast[1]}`} className="text-blue-300 hover:text-blue-600 hover:underline">{cast[0]}</Link></span></span>)})}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setExpandCast(!expandCast);
                    }}
                  >
                    <svg className="w-6 h-6 pl-2 hover:translate-x-2 transition duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#d4d4d4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 md:px-12 flex flex-col items-center md:basis-1/3">
              <button className="w-full mb-2 py-2 px-4 rounded dark:bg-orange-500 dark:text-black dark:hover:bg-orange-400 hover:underline" onClick={() => {toggleReviewInputVisibility()}}><a href="#review">Write a review</a></button>
              <button 
                className={!movieInWishlist ? "w-full mb-2 py-2 px-4 rounded dark:bg-neutral-700 dark:text-white transition ease-in-out dark:hover:bg-neutral-600 dark:active:bg-red-900 hover:underline" : "w-full mb-2 py-2 px-4 rounded dark:bg-red-700 dark:text-white transition ease-in-out dark:hover:bg-red-500 dark:active:bg-neutral-800 hover:underline"}
                onClick={() => {
                  if (getters.loggedInState) {
                    setMovieInWishlist(!movieInWishlist);
                    !movieInWishlist ? addToWishList() : removeFromWishList();
                  } else {
                    setRedirectMsg("Want to add to a wishlist?\nCreate an account or log in!")
                    setOpen(true);
                  }
                }}
              >
                {!movieInWishlist ? "+ Add to Wishlist" : "- Remove from Wishlist"}
              </button>
              {
                getters.loggedInState 
                ? <Link
                    className="w-full"
                    href={`/movie/forum/${params['movieid']}/${getters.loggedInUserId}`}
                  >
                    <button className="w-full mb-2 py-2 px-4 rounded dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600 hover:underline">View Discussion Forum</button>
                  </Link>
                : <button 
                    className="w-full mb-2 py-2 px-4 rounded dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600 hover:underline"
                    onClick={() => {
                      setRedirectMsg("Login to your account to view the discussion forum! If you do not have an account then register for one below");
                      setOpen(true);
                    }}
                  >
                    View Discussion Forum
                  </button>
              }
              <div className="w-full mt-4">
                <p><span className="font-bold">{reviewData != null ? reviewData.length : 0}</span> reviews</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row">
            <div className="overflow-x-auto md:basis-2/3">
              <h2 id="reviewSection" className="my-2 text-lg font-bold border-l-4 border-orange-500 pl-3">Reviews</h2>       
              { reviewInputVisible 
                ? <ReviewInput movieId={movieData.id} reviewerId={getters.loggedInUserId} getReviews={getReviews} setReviewInputVisible={setReviewInputVisible}/> 
                : null }

              <div className="px-2">
                {isLoadingReviews || fetchError || (reviewData == null)
                  ? <p>{fetchError ? fetchError : 'No reviews' }</p>
                  : reviewData.map((review) => {
                      return (
                        <ReviewCard 
                          name={review.name} 
                          reviewerId={review.reviewerId} 
                          review={review.review} 
                          rating={review.rating}
                          title={review.title} 
                          getReviews={getReviews}
                        />
                      );
                    })
                }
              </div>
            </div>
            <div className="flex md:px-12 md:basis-1/3 ">
              <Recommended movieId={movieData.id}></Recommended>
            </div>
          </div>
        </div>
        <RedirectModal 
          open={open} 
          setOpen={setOpen} 
          title={"Make an Account"} 
          msg={redirectMsg}
          btnMsg={"Login"} 
          href={"/auth/login"}
        /> 
      </Layout>
    </Context.Provider>
  );
}

// Potentially could be thousands of movies in db so generate on load
// Rather than generate all possible pages on build through getStaticPaths/getStaticProps
export async function getServerSideProps({ params }) {
  // Fetch data from external BE
  const movieData = await fetch(`http://${process.env.BE_SERVERSIDE_HOST}:${process.env.BE_SERVERSIDE_PORT}/movies/get_details/${params.movieid}`)
    .then(res => res.json())

  // Pass data to the page via props
  return { props: { movieData, params } }
}