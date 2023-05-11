import { Context, useContext } from '../../context'
import Layout from "../../components/Layout";
import Link from "next/link";
import { preportUrl, backendPort, frontendPort } from "../../url_config";
import React, { useState } from "react";
import Router from "next/router";
import ErrorModal from '../../components/modals/ErrorModal';

export default function Login() {
  
  const { getters, setters } = useContext(Context);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [fetchError, setFetchError] = useState("");
  
  const login = async (email, password) => {
    const url = preportUrl + backendPort + "/accounts/login/";

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const res = await fetch(url, {
        method: 'POST',
        credentials: "include",
        body: formData
      });
      const data = await res.json();
      console.log(data);
      if (data.result == "Success") {
        setters.setSessionKey(data.session_key);
        setters.setLoggedInState(true);
        setters.setLoggedInUserId(data.user_id);
        Router.push(`/`);
      } else {
        setOpen(true);
        setFetchError(data.error);
        throw new Error(data.error);
      }
    } catch (err) {
      console.log(err);
    }

  }
  
  return(
    <Context.Provider value={{ getters, setters }}>
      <Layout>
        <div className="flex justify-center">
          <ErrorModal open={open} setOpen={setOpen} title={"An error occurred"} msg={fetchError} btnMsg={"Dismiss"}/>
          <form 
            className="bg-inherit rounded px-8 pt-6 pb-8 mb-4 w-full md:w-[500px]"
            onSubmit={(event) => {
              event.preventDefault()
              login(email, password)
            }}
          >
            <div className="mb-6">
              <label 
                className="block text-gray-700 dark:text-white font-bold" 
                for="email"
              >
                Email
              </label>
              <input 
                className="shadow appearance-none bg-inherit border-2 dark:border-neutral-600 w-full py-2 px-3 text-gray-700 dark:text-white dark:placeholder-neutral-300 leading-tight focus:outline-none focus:shadow-outline" 
                id="email" 
                type="text" 
                placeholder="Email"
                required
                onInput={event => setEmail(event.target.value)}
              />
            </div>
            <div className="mb-6">
              <label 
                className="block text-gray-700 dark:text-white font-bold" 
                for="password"
              >
                Password
              </label>
              <input 
                className="shadow appearance-none bg-inherit border-2 dark:border-neutral-600 w-full py-2 px-3 text-gray-700 dark:text-white dark:placeholder-neutral-300 leading-tight focus:outline-none focus:shadow-outline" 
                id="password" 
                type="password" 
                placeholder="Password"
                required
                onInput={event => setPassword(event.target.value)}
              />
            </div>
            <div className="flex flex-col justify-between md:flex-row">
              <Link href="/auth/sign_up" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" >
                Don't have an account? Register now!
              </Link>
              <button 
                className="mt-4 md:mt-0 bg-orange-500 hover:bg-orange-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </Context.Provider>
  )
}