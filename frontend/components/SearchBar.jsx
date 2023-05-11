import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from '@headlessui/react' // Dropdown menu from https://headlessui.com/react/menu
import { useRouter } from "next/router";
import SearchCard from "./SearchCard";
import Link from "next/link";

export default function SearchBar() {
  const [search, setSearch] = useState("Title");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  const router = useRouter()

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
      console.log(data)
      setResults(data.result[search.toLowerCase()]);
      if (data.result[search.toLowerCase()].length == 0) {
        setIsEmpty(true);
      } else {
        setIsEmpty(false);
      }   
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (query === "") {
      setIsEmpty(false);
      setResults([]);
      console.log("resetting")
    } else {
      getSearches(query);
      console.log("updating search")
    }
  },[query])

  const redirect = () => {
    switch (search) {
      case "Genre":
        if (Object.keys(results[0]).length == 1) {
          
          router.push({
            pathname: `/genre/${Object.keys(results[0])[0]}`,
          })
        }
        break;
      default:
        router.push({
          pathname: '/search/[type]',
          query: { 
            type: search,
            query: query 
          },
        })
        break;
    }
  }

  return(
    <div className="w-full relative">
      <div className="flex">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="flex-shrink-0 justify-center z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100">
              {search} <svg aria-hidden="true" class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
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
            <Menu.Items className="z-50 absolute left-0 sm:right-0 sm:left-auto mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-black shadow-lg ring-1 ring-black dark:ring-neutral-700 ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`
                        ${active ? 'bg-accent text-white dark:bg-neutral-800 dark:text-orange-500' : 'text-gray-900'} 
                        ${search == "Title" ? "dark:text-orange-500" : "dark:text-white"}
                        group flex w-full items-center rounded-md px-2 py-2 text-sm`
                      }
                      onClick={() => {
                        setResults([]);
                        setSearch("Title");
                        setQuery("");
                        document.getElementById("searchbar").value = "";
                      }}
                    >
                      Title
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`
                        ${active ? 'bg-accent text-white dark:bg-neutral-800 dark:text-orange-500' : 'text-gray-900'} 
                        ${search == "Description" ? "dark:text-orange-500" : "dark:text-white"}
                        group flex w-full items-center rounded-md px-2 py-2 text-sm`
                      }
                      onClick={() => {
                        setResults([]);
                        setSearch("Description");
                        setQuery("");
                        document.getElementById("searchbar").value = "";
                      }}
                    >
                      Description
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`
                        ${active ? 'bg-accent text-white dark:bg-neutral-800 dark:text-orange-500' : 'text-gray-900'} 
                        ${search == "Genre" ? "dark:text-orange-500" : "dark:text-white"}
                        group flex w-full items-center rounded-md px-2 py-2 text-sm`
                      }
                      onClick={() => {
                        setResults([]);
                        setSearch("Genre");
                        setQuery("");
                        document.getElementById("searchbar").value = "";
                      }}
                    >
                      Genre
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        <div className="relative w-full">
          <input 
            type="search"
            id="searchbar" 
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300" 
            placeholder={`Search by ${search}`} 
            onInput={(e) => setQuery(e.target.value)} 
          />
          
          <button 
            type="submit" 
            className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-orange-500 rounded-r-lg border border-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300"
            onClick={() => {
              redirect();
            }}
          >
            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
      <div className="absolute z-50 w-full dark:bg-neutral-700 flex flex-col rounded">
        { search === "Genre" 
          ? (results.length > 0 && typeof results[0] === 'object' && Object.keys(results[0]).length > 0
              ? Object.keys(results[0]).map((genre, index) => {
                  return(
                    <Link 
                      href={`/genre/${genre}`}
                      className={`${index == 0 ? "" : "border-t-[1px] border-neutral-100"} flex justify-between py-2 px-4 dark:text-white hover:dark:bg-neutral-600`}
                    >
                      <h3>{genre}</h3>
                      <p className="text-sm text-gray-300">{results[0][genre].movies.length} movies</p>
                    </Link>
                  );
                })
              : query === "" ? <></> : <div className="py-2 px-4 dark:text-white">No matching results</div>
            )
          : isEmpty 
            ? <div className="py-2 px-4 dark:text-white">No matching results</div> 
            : results.map((movie, index) => {
                return (<SearchCard index={index} id={movie.id} title={movie.title} year={movie.year} image={movie.image} rating={movie.rating}/>);
              })
        }
      </div>
    </div>
  );
}