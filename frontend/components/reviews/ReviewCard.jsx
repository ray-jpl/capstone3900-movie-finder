import Link from "next/link";
import React, { useState } from "react";
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

import { Context, useContext } from '../../context'
import BlacklistModal from "../modals/BlacklistModal";

export default function ReviewCard({ name, reviewerId, review, rating, title, getReviews }) {
  const { getters, setters } = useContext(Context);
  const[open, setOpen] = useState(false);

  var stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(<svg className={`${i <= rating ? 'stroke-yellow-300 fill-yellow-300' : 'stroke-gray-300 fill-gray-300'} w-4 h-4`} xmlns="http://www.w3.org/2000/svg" fill="#fde047" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fde047">
      <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>);
  }

  return(
    <div className="group flex p-2 mb-5">
      <div className="mr-4">
        <Link href={`/profile/${reviewerId}`}> 
          <div className={`
              ${title === "Beginner Reviewer"
                  ? "bg-[#967444]"
                  : title === "Intermediate Reviewer"
                    ? "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
                    : title == "Expert Reviewer"
                      ? "bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
                      : ""
              } w-9 h-9 rounded-full flex justify-center items-center
            `}
          >
            <svg 
              className="w-8 h-8 p-1 rounded-full bg-neutral-700 border cursor-pointer"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          </div>
          
        </Link>
      </div>
      <div className="w-11/12 flex flex-col break-words">
        <div className="flex justify-between">
          <Link href={`/profile/${reviewerId}`}><h1 className="font-bold cursor-pointer hover:underline">{name} <span className="text-neutral-400 font-normal"> - {title}</span></h1></Link>

          <Menu 
            as="div" 
            className="relative inline-block text-left"
            style={{
              display: getters.loggedInState ? (getters.loggedInUserId != reviewerId ? 'block' : 'none') : 'none'
            }}
          >
            <div>
              <Menu.Button className="p-1 rounded-full bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="none" className="w-6 h-6 stroke-white md:stroke-none group-hover:stroke-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="z-50 absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-black  shadow-lg ring-1 ring-black dark:ring-neutral-700 ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={`${
                          active ? 'bg-accent text-red-500 dark:bg-neutral-800 dark:text-red-500'  : 'text-gray-900 dark:text-white'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        onClick={() => {
                          setOpen(true);
                        }}
                      >
                          Blacklist User
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        
        <p className="break-words">{ review }</p>
        <div className="mt-1 flex justify-start items-center">
          <p>
            <span className="font-bold">{ Math.trunc(rating) }</span>
            <span className="mr-1 text-xs align-bottom text-gray-300">/5</span>
          </p>
          { stars }       
        </div>  
      </div>
      <BlacklistModal 
        open={open} 
        setOpen={setOpen} 
        title={'Blacklist user'} 
        msg={"Are you sure you want to blacklist this user?"} 
        btnMsg={"Blacklist"} 
        reviewerId={reviewerId}
        getReviews={getReviews}
      />
    </div>
  );
}