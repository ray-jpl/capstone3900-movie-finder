import { Context, useContext } from '../context';
import { preportUrl, backendPort, frontendPort } from "../url_config";
import React from "react";
import Router from "next/router";


export const signout = async () => {
  const url = preportUrl + backendPort + "/accounts/logout/";

  const { setters, getters } = useContext(Context);

  try {
      const res = await fetch(url, {
        credentials: "include"
      });
      const data = await res.json();
      console.log(data);
      // getCSRF();
      Router.push(`/`);
  } catch (err) {
      console.log(err);
  }
}
