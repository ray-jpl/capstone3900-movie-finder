import '../styles/globals.css'
import { Context, initialValue } from '../context'
import React from "react"

function MyApp({ Component, pageProps }) {
  const [sessionKey, setSessionKey] = React.useState(initialValue.sessionKey);
  const [loggedInState, setLoggedInState] = React.useState(initialValue.loggedInState);
  const [csrfToken, setCsrfToken] = React.useState(initialValue.csrfToken);
  const [loggedInUserId, setLoggedInUserId] = React.useState(initialValue.loggedInUserId);

  const getters = {
    sessionKey,
    loggedInState,
    csrfToken,
    loggedInUserId
  }

  const setters = {
    setSessionKey,
    setLoggedInState,
    setCsrfToken,
    setLoggedInUserId
  }

  return (
    <Context.Provider value={{ getters, setters }}>
      <Component {...pageProps} />
    </Context.Provider>
  )
}

export default MyApp
