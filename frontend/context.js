import React, { createContext } from 'react';

export const initialValue = {
  sessionKey: '',
  loggedInState: false,
  csrfToken: '',
  loggedInUserId: 0
};

export const Context = createContext(initialValue);
export const useContext = React.useContext;