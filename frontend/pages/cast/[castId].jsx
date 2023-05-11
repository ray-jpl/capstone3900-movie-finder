
import Layout from "../../components/Layout";
import MovieCard from "../../components/MovieCard";

export default function topDirectorMovies({ movieData }) {
  return (
    <div>
      <Layout>
        <h1 className='text-2xl font-bold border-l-4 dark:text-white border-orange-500 pl-3'>Top Movies from {movieData.cast}</h1>
        <div className="grid gap-6 grid-cols-auto-fill p-4 justify-center">
          {movieData.result.map((movie) => {
            return (
              <MovieCard id={movie.id} title={movie.title} rating={movie.rating} src={movie.image}/>
            );
          })}
        </div>
      </Layout>
    </div>
  )
}

export async function getServerSideProps({ params }) {
  // Fetch data from external BE
  const movieData = await fetch(`http://${process.env.BE_SERVERSIDE_HOST}:${process.env.BE_SERVERSIDE_PORT}/movies/top_cast/${params.castId}`)
    .then(res => res.json())
    
  // Pass data to the page via props
  return { props: { movieData } }
}