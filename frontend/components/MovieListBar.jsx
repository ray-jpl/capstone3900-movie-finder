import React from "react";
import Image from 'next/image'
import Link from "next/link";

export default function MovieListBar( {id, title, rating, src} ) {
  return (
    <Link href={`/movie/${id}`}>
      <div className="max-width cursor-pointer transition ease-in-out scale-100 hover:scale-105 duration-300 flex flex-row">
        <div>
          <Image 
          src={src}
          className="aspect-[2/3] overflow-hidden bg-gray-200 rounded-xl object-cover"
          width={180}
          alt={`${title} poster thumbnail`}
          />
        </div>

        <div className="flex flex-row">
          <p className="text-subtext text-base">{title}</p>

          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#fde047" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fde047" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            {rating}
          </div>
          
        </div>
      </div>
    </Link>
  );
};