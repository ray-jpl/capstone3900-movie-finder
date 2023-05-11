import { Context, useContext } from '../../context'
import Layout from "../../components/Layout";
import Link from "next/link";
import MovieCard from "../../components/MovieCard";
import React from "react";

export default function UserWishlist( { params, profileData, movieData } ) {
  
  const { getters, setters } = useContext(Context);

  return(
    <Context.Provider value={{ getters, setters }}>
      <Layout>
        <Link href={`/profile/${params['userId']}`}>
          <h1 className='text-xl dark:text-orange-500 transition hover:-translate-x-4 mb-2'>
            ← Go back to {profileData.info.name}'s profile
          </h1>
        </Link> 
        <h1 className='text-2xl font-bold border-l-4 dark:text-white border-orange-500 pl-3'>{profileData.info.name}'s Wishlist</h1>
        <div className="grid gap-6 grid-cols-auto-fill p-4 justify-center">
          {movieData['result'].map((movie) => {
            return (
              <MovieCard id={movie.id} title={movie.title} rating={movie.rating} src={movie.image}/>
            );
          })}
        </div>
      </Layout>
    </Context.Provider>
  )
}

export async function getServerSideProps( { params } ) {

  const profileData = await fetch(`http://${process.env.BE_SERVERSIDE_HOST}:${process.env.BE_SERVERSIDE_PORT}/accounts/profile/${params['userId']}`, {
    method: 'GET'
  })
    .then(res => res.json())
    .catch(err => console.error(err))

  const movieData = await fetch(`http://${process.env.BE_SERVERSIDE_HOST}:${process.env.BE_SERVERSIDE_PORT}/accounts/watchlist/${params['userId']}`, {
    method: 'GET'
  })
    .then(res => res.json())
    .catch(err => console.error(err))

  // console.log(profileData)
  // console.log(movieData)

  return { props: { params, profileData, movieData } }
} 