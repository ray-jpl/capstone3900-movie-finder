import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

export default function Recommended({ movieId }) {
  const [movies, setMovies] = useState([]);
  
  const getRecommended = async() => {
    const url = `http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/movies/recommendations/${movieId}`;
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
      let arr = []
      for (let i = 0; i < data.result.length; i++) {
        let info = await getMovieInfo(data.result[i]);
        arr.push(info);
      }
      setMovies(arr);
    } catch (error) {
      console.log(error);
      setMovies([]);
    } 
  }

  const getMovieInfo = async (id) => {
    const url = `http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/movies/get_details/${id}`;
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
      return data;
    } catch (error) {
      console.log(error);
    } 
  }

  useEffect(() => {
    getRecommended();
  },[movieId])
  
  return (
    <div className="w-full">
      <h1 className='text-lg font-bold border-l-4 dark:text-white border-orange-500 pl-3'>Recommendations</h1>
      <div className="mt-6 flex flex-col w-full justify-center items-center text-center">
          {movies.length != 0
            ? movies.map((movie) => {
                return (
                  <MovieCard id={movie.id} title={movie.title} rating={movie.rating} src={movie.image}/>
                );
              })
            : <p className="dark:text-white">No recommendations</p>
          }
      </div>
    </div>
    
  );
}