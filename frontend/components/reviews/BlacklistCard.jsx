import React from "react";
import { Context, useContext } from '../../context'
import Link from "next/link";

export default function BlacklistCard({ userId, name, email, getBlacklist }) {
  const { getters, setters } = useContext(Context);
  
  const delBlacklist = async () => {
    const url = `http://${process.env.NEXT_PUBLIC_BE_HOST}:${process.env.NEXT_PUBLIC_BE_PORT}/accounts/blacklist`;
    const params = {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'userId': getters.loggedInUserId,
        'banId': userId,
      })
    }
    try {
      const res = await fetch(url, params);
      const data = await res.json();
      if (data.error) throw Error(data.error);
      getBlacklist();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  
  return(
      <div className="group my-2 w-full flex justify-between dark:bg-neutral-800 py-4 px-6">
        <div className="flex flex-col">
          <Link className="font-bold" href={`./../../../profile/${userId}`}>{name}</Link>
          <p className="text-neutral-400">{email}</p>
        </div>
        <div className="flex items-center">
          <button
            className="p-1 rounded-full bg-inherit text-sm font-medium text-white group-hover:bg-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            type="button"
            onClick={() => {
              delBlacklist()
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="none" className="w-6 h-6 stroke-white md:stroke-none group-hover:stroke-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
  );
}