import BlacklistCard from '../../components/reviews/BlacklistCard';
import { Context, useContext } from '../../context'
import Layout from "../../components/Layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'

export default function Blacklist( { params, profileData } ) {
  const router = useRouter()
  const { userId } = router.query
  const { getters, setters } = useContext(Context);
  const [list, setList] = useState([]);

  const getBlacklist = async () => {
    const url = `http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/accounts/blacklist/${userId}`;
    const params = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    }
    try {
      const res = await fetch(url, params);
      const data = await res.json();
      if (data.error) throw Error(data.error);
      setList(data.result);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getBlacklist();
  },[])

  return(
    <Context.Provider value={{ getters, setters }}>
      <Layout>
        <Link href={`/profile/${params['userId']}`}>
          <h1 className='text-xl dark:text-orange-500 transition hover:-translate-x-4 mb-2'>
            ← Go back to {profileData.info.name}'s profile
          </h1>
        </Link> 
        <h1 className='text-2xl font-bold border-l-4 dark:text-white border-orange-500 pl-3'>Blacklisted Users</h1>
        <div className='mt-4 flex justify-center dark:text-white'>
          <div className='w-full md:w-[500px] flex flex-col'>
            {list.map((user) => {
              return(<BlacklistCard userId={user.id} name={user.name} email={user.email} getBlacklist={getBlacklist}/>)
            })}
          </div>
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
  return { props: { params, profileData } }
} 