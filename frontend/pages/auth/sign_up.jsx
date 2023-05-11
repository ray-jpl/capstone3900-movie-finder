import { Context, useContext } from '../../context'
import Layout from "../../components/Layout";
import Link from "next/link";
import { preportUrl, backendPort, frontendPort } from "../../url_config";
import React, { useState } from "react";
import Router from "next/router";
import ErrorModal from '../../components/modals/ErrorModal';

export default function Register() {

  const { getters, setters } = useContext(Context);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');

  const [open, setOpen] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [open2, setOpen2] = useState(false);

  const signup = async (name, email, password, passwordConf) => {
    const url = preportUrl + backendPort + "/accounts/register/"; //! Change this based on our API function

    if (password !== passwordConf) {
      setOpen2(true);
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password1', password);
    formData.append('password2', passwordConf);

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      console.log(data);
      if (data.result == "Success") {
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
        <ErrorModal 
          open={open} 
          setOpen={setOpen} 
          title={"An error occured"} 
          msg={fetchError} 
          btnMsg={"Dismiss"}
        />
        <ErrorModal 
          open={open2} 
          setOpen={setOpen2} 
          title={"An error occured"} 
          msg={"Passwords do not match"} 
          btnMsg={"Dismiss"}
        />
        <div className="flex justify-center">
          <form 
            className="bg-inherit rounded px-8 pt-6 pb-8 mb-4 w-full md:w-[500px]"
            onSubmit={(event) => {
              event.preventDefault()
              signup(name, email, password, passwordConf)
            }}
          >
            <div className="mb-6">
              <label 
                className="block text-gray-700 dark:text-white font-bold mb-2" 
                for="name"
              >
                Name
              </label>
              <input 
                className="shadow appearance-none bg-inherit border-2 dark:border-neutral-600 w-full py-2 px-3 text-gray-700 dark:text-white dark:placeholder-neutral-300 leading-tight focus:outline-none focus:shadow-outline" 
                id="name" 
                type="text" 
                placeholder="Name"
                required
                onInput={(event) => {setName(event.target.value)}}  
              />
            </div>
            <div className="mb-6">
              <label 
                className="block text-gray-700 dark:text-white font-bold mb-2" 
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
                onInput={(event) => {setEmail(event.target.value)}}
              />
            </div>
            <div className="mb-6">
              <label 
                className="block text-gray-700 dark:text-white font-bold mb-2" 
                for="password"
              >
                New Password
              </label>
              <input 
                className="shadow appearance-none bg-inherit border-2 dark:border-neutral-600 w-full py-2 px-3 text-gray-700 dark:text-white dark:placeholder-neutral-300 leading-tight focus:outline-none focus:shadow-outline" 
                id="password" 
                type="password" 
                placeholder="Password"
                pattern='^(?=.*\d)(?=.*[A-Z]).{8,}$'
                required
                onInput={(event) => {setPassword(event.target.value)}}
              />
            </div>
            <div className="mb-6">
              <label 
                className="block text-gray-700 dark:text-white font-bold mb-2" 
                for="password_confirm"
              >
                Confirm Password
              </label>
              <input 
                className="shadow appearance-none bg-inherit border-2 dark:border-neutral-600 w-full py-2 px-3 text-gray-700 dark:text-white dark:placeholder-neutral-300 leading-tight focus:outline-none focus:shadow-outline" 
                id="password_confirm" 
                type="password" 
                placeholder="Confirm password"
                pattern='^(?=.*\d)(?=.*[A-Z]).{8,}$'
                required
                onInput={(event) => {setPasswordConf(event.target.value)}}
              />
            </div>
            <div className='mb-4 dark:text-white'>
              Password must:
              <ul className='list-disc pl-8'>
                <li>Be at least 8 characters long</li>
                <li>Contain at least 1 uppercase letter</li>
                <li>Contain at least 1 number</li>
              </ul>
            </div>


            <div className="flex flex-col justify-between md:flex-row">
              <Link href="/auth/login" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" >
                Already have an account? Login here!
              </Link>
              <button 
                className="mt-4 md:mt-0 bg-orange-500 hover:bg-orange-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </Context.Provider>
  );
}