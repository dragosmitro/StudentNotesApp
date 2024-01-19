import React, { useEffect, useState } from "react";
import { Login } from "./Login";
import { MainPage } from "./MainPage";

export const Page = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserInformation(token);
    }
  }, []);

  async function getUserInformation(token) {
    const response = await fetch("http://localhost:3001/api/user/authToken", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data);
      setLoggedIn(true);
    }
  }

  return (
    <React.Fragment>
      {loggedIn ? (
        <MainPage setLoggedIn={setLoggedIn} user={user} />
      ) : (
        <Login setLoggedIn={setLoggedIn} getUserInfo={getUserInformation}/>
      )}
    </React.Fragment>
  );
};
