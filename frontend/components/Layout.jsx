import React from "react";
import Head from 'next/head';
import Navbar from "./Navbar";

export default function Layout( {children} ) {
  return (
    <div className="dark">
      <div className="min-h-screen w-full flex flex-col items-center bg-gray-200 dark:bg-neutral-900 ">
        <Head>
          <title>Movie Finder</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <meta
          name="description"
          content="A website to find and review movies"
        />

        <Navbar/>

        <div className="w-full lg:w-[1000px] xl:w-[1200px] 2xl:w-[1400px] bg-white dark:bg-neutral-900 flex-grow">
          <main className="px-4 pt-4">{children}</main>
        </div>
      </div>
    </div>
  );
}