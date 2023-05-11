import Layout from "../../components/Layout";
import MovieCard from "../../components/MovieCard";

export default function topWriterMovies({ movieData }) {
  return (
    <Layout>
      <h1 className='text-2xl font-bold border-l-4 dark:text-white border-orange-500 pl-3'>Top Movies Written By {movieData.writer}</h1>
      <div className="grid gap-6 grid-cols-auto-fill p-4 justify-center">
        {movieData.result.map((movie) => {
          return (
            <MovieCard id={movie.id} title={movie.title} rating={movie.rating} src={movie.image}/>
          );
        })}
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  // Fetch data from external BE
  const movieData = await fetch(`http://${process.env.BE_SERVERSIDE_HOST}:${process.env.BE_SERVERSIDE_PORT}/movies/top_writer/${params.writerId}`)
    .then(res => res.json())
    
  // Pass data to the page via props
  return { props: { movieData } }
}