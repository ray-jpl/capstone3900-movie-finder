import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function SearchCard({ index, id, title, year, rating, image }) {
  return(
    <Link 
      href={`/movie/${id}`}
      className="w-full"
    >
      <div className={`${index == 0 ? "" : "border-t-[1px] border-neutral-100" } flex bg-inherit justify-between p-2 pr-4 dark:text-white hover:dark:bg-neutral-600`}>
        <div className="flex">
          <Image 
            src={image}
            className="aspect-[2/3] mx-2 overflow-hidden bg-gray-200 rounded-t object-cover"
            width={48}
            alt={`${title} poster thumbnail`}
          />
          <div>
            <h3>{title}</h3>
            <p className="text-sm text-gray-300">{year}</p>
          </div>
        </div>
        
        <div className="flex text-sm items-center dark:text-white">
          <svg className="w-4 h-4 pr-1" xmlns="http://www.w3.org/2000/svg" fill="#fde047" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fde047">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
          {(Math.round(rating * 10) / 10).toFixed(1)}
        </div>
      </div>
    </Link>
  );
}