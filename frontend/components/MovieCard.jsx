import { Context, useContext } from '../context'
import RedirectModal from './modals/RedirectModal';
import React, { useEffect, useState} from "react";
import Image from 'next/image'
import Link from "next/link";

export default function MovieCard( {id, title, rating, src}) {

  const { getters } = useContext(Context);

  const [movieInWishlist, setMovieInWishList] = useState(false);

  const [open, setOpen] = useState(false);
  const [fetchError, setFetchError] =useState("");

  const [trueRating, setTrueRating] = useState(rating);

  const getRating = async () => {
    try {
      const res = await fetch(`http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/reviews/get_rating/${id}/${getters.loggedInUserId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json();
      if (data.error) throw Error(data.error);
      setTrueRating(data.rating);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (getters.loggedInUserId > 0) {
      const determineMovieInWishlist = async (id) => {
        try {
          const res = await fetch(`http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/accounts/watchlistIdsOnly/${getters.loggedInUserId}`, {
            method: 'GET'
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          
          setMovieInWishList(data["result"].includes(Number(id)))
        } catch (error) {
          console.log(error)
        }   
      }
      determineMovieInWishlist(id);
      getRating();
    } else {
      setMovieInWishList(false)
    }
  }, []);

  useEffect(() => {
    if (!getters.loggedInState) {
      setMovieInWishList(false)
    }
  }, [getters.loggedInState])

  const addToWishList = async () => {
    try {
      const res = await fetch(`http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/accounts/watchlist/${getters.loggedInUserId}`, {
        method: "POST",
        body: JSON.stringify({'movie': id})
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
        body: JSON.stringify({'movie': id})
      })
      const data = await res.json();
      if (data.error) throw Error(data.error);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-[198px] cursor-pointer mb-3 shadow-lg rounded">
      <RedirectModal open={open} setOpen={setOpen} title={"You are not logged in"} msg={fetchError} btnMsg={"Login"} href={"/auth/login"}/>
      <Link href={`/movie/${id}`}>
        <Image 
          src={src}
          className="aspect-[2/3] overflow-hidden bg-gray-200  rounded-t object-cover transition ease-in-out scale-100 hover:scale-105 duration-300"
          width={198}
          alt={`${title} poster thumbnail`}
        />
      </Link>
        

      <div className="pt-3 p-2 dark:bg-neutral-800 rounded-b">
        <Link href={`/movie/${id}`}>
          <div className="flex text-sm items-center dark:text-white">
            <svg className="w-4 h-4 pr-1" xmlns="http://www.w3.org/2000/svg" fill="#fde047" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fde047">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            {(Math.round(trueRating * 10) / 10).toFixed(1)}
          </div>
          
          <p className="h-12 my-1 text-left dark:text-white hover:underline line-clamp-2" title={title}>{title}</p>
        </Link>
          <button       
            className={`${
              !movieInWishlist 
                ? 'dark:bg-neutral-700 dark:hover:bg-neutral-500 dark:active:bg-red-900'
                : 'dark:bg-red-700  dark:hover:bg-red-500 dark:active:bg-neutral-900'
            } w-full py-2 px-4 rounded dark:text-white z-10 text-base transition ease-in-out`}
            
            onClick={() => {
              if (getters.loggedInState) {
                setMovieInWishList(!movieInWishlist);
                !movieInWishlist ? addToWishList() : removeFromWishList();
              } else {
                setOpen(true);
                setFetchError("Want to add to a wishlist?\nCreate an account or log in!");
              }
            }}
          >
            {!movieInWishlist ? "+ Wishlist" : "- Wishlist"}
          </button>
      </div>
    </div>
  );
};