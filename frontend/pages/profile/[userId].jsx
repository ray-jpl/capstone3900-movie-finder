import { Context, useContext } from '../../context'
import Layout from "../../components/Layout";
import Link from "next/link";
import React, { useEffect } from "react";

export default function UserProfile( { params, profileData, profileTitleData } ) {
  
  const { getters, setters } = useContext(Context);

  const [userIsBanned, setUserIsBanned] = React.useState(false);
  const [firstLoad, setFirstLoad] = React.useState(true);

  const getBannedData = async () => {
    try {
      await fetch(`http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/accounts/blacklist/${Number(getters.loggedInUserId)}`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          for (var user of data['result']) {
            if (params['userId'] === user.id) {
              setUserIsBanned(true);
              console.log("user already banned");
              break;
            }
          }
        });
    } catch (err) {
      console.log(err);
    }
  }

  if (firstLoad && getters.loggedInState && Number(getters.loggedInUserId) !== Number(params['userId'])) {
    getBannedData();
    setFirstLoad(false);
  }

  useEffect(() => {
    // !!! Do NOT Delete
    // Rerenders the page if banned
  }, [userIsBanned]);

  return(
    <Context.Provider value={{ getters, setters }}>
      <Layout>
        <div> 
          <h1 className='mb-2 text-2xl font-bold border-l-4 dark:text-white border-orange-500 pl-3'>{profileData.info.name}'s Profile</h1>
        </div>
        <div
          className='w-full mt-1 mb-2 py-2 px-4 flex flex-col rounded-xl dark:bg-neutral-700'
        >
          <div 
            className='flex flex-col mt-1 mb-1 pt-2 pb-2 w-full dark:bg-neutral-800 rounded-xl items-center'
          >
            {/* This section is to display the profile details */}
            {/* Profile Picture */}
            <div className='mt-2 p-3 rounded-full bg-neutral-900'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-40 h-40">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Name */}
            <h1 className='text-2xl mt-1 mb-1 font-bold dark:text-white'>{profileData.info.name}</h1>

            {/* Title */}
            <h1 className='text-lg mb-1 dark:text-neutral-300'>{profileTitleData.title}</h1>

            {/* Number of Reviews */}
            <h1 className='text-sm mt-1 mb-2 dark:text-neutral-400'>Reviews written: {profileTitleData.numMovies}</h1>

          </div>
          <div className='mt-1 mb-2 flex flex-col sm:flex-row justify-center'>
            {/* This section is for buttons to redirect to other places such as wishlist, etc. */}
            <Link
              href={`/wishlist/${params['userId']}`}
              className='rounded-lg p-2 mx-1 mb-2 sm:mb-0 text-xl text-center font-bold dark:bg-orange-500 dark:text-black dark:hover:bg-orange-400 hover:underline transition ease-in-out'
            >
              View Wishlist
            </Link>

            {params.userId == getters.loggedInUserId ? 
              <Link 
                href={`/blacklist/${getters.loggedInUserId}`}
                className='rounded-lg p-2 mx-1 text-xl text-center font-bold dark:bg-orange-500 dark:text-black dark:hover:bg-orange-400 hover:underline transition ease-in-out'
              >
                Blacklisted Users
              </Link>
            : 
              getters.loggedInState ?
                !userIsBanned ? 
                  <button
                    className="rounded-lg p-2 ml-1 mr-1 text-xl font-bold dark:bg-neutral-700 dark:text-white dark:hover:bg-red-900 hover:underline transition ease-in-out"
                    onClick={() => {
                      const banUser = async () => {
                        const bodyData = {
                          userId: getters.loggedInUserId,
                          banId: params["userId"]
                        }
                        try {
                          const data = await fetch(`http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/accounts/blacklist`, {
                            method: 'POST',
                            body: JSON.stringify(bodyData)
                          })
                            .then(res => res.json())
                          console.log(data)
                        } catch (err) {
                          console.log(err)
                        }
                      }
                      banUser()
                      setUserIsBanned(true)
                    }}
                  >
                    Block user
                  </button>
                :
                  <button
                    className="rounded-lg p-2 ml-1 mr-1 text-xl font-bold dark:bg-red-600 dark:text-white dark:hover:bg-red-900 hover:underline transition ease-in-out"
                    onClick={() => {
                      const unBanUser = async () => {
                        const bodyData = {
                          userId: getters.loggedInUserId,
                          banId: params["userId"]
                        }
                        try {
                          const data = await fetch(`http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/accounts/blacklist`, {
                            method: 'DELETE',
                            body: JSON.stringify(bodyData)
                          })
                            .then(res => res.json())
                          console.log(data)
                        } catch (err) {
                          console.log(err)
                        }
                      }
                      unBanUser()
                      setUserIsBanned(false)
                    }}
                  >
                    Unblock user
                  </button>
              :
                null
            }       
          </div>
        </div>
      </Layout>
    </Context.Provider>
  );
}

export async function getServerSideProps( { params } ) {

  const profileData = await fetch(`http:${process.env.BE_SERVERSIDE_HOST}:${process.env.BE_SERVERSIDE_PORT}/accounts/profile/${params["userId"]}`)
    .then(res => res.json())

  const profileTitleData = await fetch(`http:${process.env.BE_SERVERSIDE_HOST}:${process.env.BE_SERVERSIDE_PORT}/accounts/profileTitle/${params["userId"]}`)
    .then(res => res.json())

  return { props: { params, profileData, profileTitleData } }
} 