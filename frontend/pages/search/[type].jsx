import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import MovieCard from "../../components/MovieCard";

export default function SearchResults() {
  const router = useRouter();
  const [results, setResults] = useState([])

  const getSearches = async ( query ) => {
    const url = `http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/movies/search/${query}`;
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
      setResults(data.result[router.query.type.toLowerCase()]);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getSearches(router.query.query);
  },[]);

  return(
      <Layout>
        <h1 className='text-2xl font-bold border-l-4 dark:text-white border-orange-500 pl-3'>Search results for {router.query.query}</h1>
        <div className="grid gap-6 grid-cols-auto-fill p-4 justify-center">
          {results.map((movie) => {
            return (
              <MovieCard id={movie.id} title={movie.title} rating={movie.rating} src={movie.image}/>
            );
          })}
        </div>
      </Layout>

  );
}
