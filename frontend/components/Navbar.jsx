import { Context, useContext } from '../context'
import React from "react";
import { Menu, Transition } from '@headlessui/react' // Dropdown menu from https://headlessui.com/react/menu
import { Fragment } from 'react'
import Link from "next/link";
import SearchBar from './SearchBar';

import { signout } from "../utils/sign_out"

export default function Navbar() {
  
  const { getters, setters } = useContext(Context);

  return (
    <Context.Provider value={{ getters, setters }}>
      <nav className="w-full px-2 md:px-4 py-2 flex flex-row justify-between items-center bg-accent-muted dark:bg-black">
        <div className="px-4 py-2 rounded-md flex items-center dark:hover:bg-opacity-80">
          <Link href="/">
            <svg className="w-8 h-8 sm:mr-1" xmlns="http://www.w3.org/2000/svg" fill="#f97316" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#f97316">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
            </svg>
          </Link>

          <Link
            href="/"
            className="hidden sm:flex text-white text-lg font-bold scale-100 hover:scale-105 duration-300" 
          >
            Movie Finder
          </Link>
        </div>

        <div className='w-full md:w-[700px]'>
          <SearchBar/>
        </div>

        <div className='ml-1 sm:ml-0'>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="p-1 rounded-full bg-accent bg-opacity-20 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
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
                  <Menu.Item
                    style={{
                      display: !getters.loggedInState ? 'block' : 'none'
                    }}
                  >
                    {({ active }) => (
                      <Link
                        href="/auth/login"
                        className={`${
                          active ? 'bg-accent text-white dark:bg-neutral-800 dark:text-orange-500'  : 'text-gray-900 dark:text-white'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Login
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item
                    style={{
                      display: !getters.loggedInState ? 'block' : 'none'
                    }}
                  >
                    {({ active }) => (
                      <Link
                        href="/auth/sign_up"
                        className={`${
                          active ? 'bg-accent text-white dark:bg-neutral-800 dark:text-orange-500'  : 'text-gray-900 dark:text-white'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Sign up
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item
                    style={{
                      display: getters.loggedInState ? 'block' : 'none'
                    }}
                  >
                    {({ active }) => (
                      <Link
                        href={`/profile/${getters.loggedInUserId}`}
                        className={`${
                          active ? 'bg-accent text-white dark:bg-neutral-800 dark:text-orange-500'  : 'text-gray-900 dark:text-white'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        My profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item
                    style={{
                      display: getters.loggedInState ? 'block' : 'none'
                    }}
                  >
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-accent text-white dark:bg-neutral-800 dark:text-orange-500'  : 'text-gray-900 dark:text-white'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm text-left`}
                        onClick={() => {
                          signout()
                          setters.setLoggedInState(false);
                          setters.setSessionKey('');
                          setters.setCsrfToken('');
                          setters.setLoggedInUserId(-1);
                        }}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </nav>
    </Context.Provider>
  );
}