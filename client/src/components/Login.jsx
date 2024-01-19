import React, { useEffect, useState } from "react";

export const Login = ({ setLoggedIn, getUserInfo }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: id, password: password }),
      });
      const res = await response.json();
      if (response.status === 200) {
        localStorage.setItem("token", res.token);
        await getUserInfo(res.token);
      } else {
        alert(res.message);
      }
    } catch (error) {}
  };

  const register = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: id, password: password }),
      });
      const res = await response.json();
      if (response.status === 201) {
        localStorage.setItem("token", res.token);
        await getUserInfo(res.token);
      } else {
        alert(res.message);
      }
    } catch (error) {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "id") {
      setId(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <React.Fragment>
      <div className="grid grid-rows-2 sm:grid-cols-2 h-screen">
        <div className="flex items-center justify-center bg-blue-500 h-1/2vw sm:h-screen">
          <div className="bg-blue-400 px-12 py-4 rounded-xl space-y-4 flex flex-col items-center justify-center content-center">
            <div className="text-white">
              <label htmlFor="id">Username (@stud.ase.ro)</label>
              <input
                name="id"
                type="text"
                onChange={handleChange}
                required
                className="text-black mt-1 p-2 block border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="text-white">
              <label htmlFor="password">Password</label>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                required
                className="text-black mt-1 p-2 block border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => login()}
                type="submit"
                className="inline-flex py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Login
              </button>
              <button
                onClick={() => register()}
                type="button"
                className="inline-flex py-2 px-4 rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Register
              </button>
            </div>
          </div>
        </div>
        <div className="bg-red-100 h-1/2vw sm:h-screen flex flex-col items-center justify-center text-xl md:text-4xl text-white">
          <div className="bg-red-300 px-8 py-2 rounded-3xl">
            <p className="font-bold">PROIECT TEHNOLOGII WEB</p>
            <p>MILEA SERGIU ANDREI</p>
            <p>MARTINESCU ANDREI</p>
            <p>MIJA ROBERT</p>
            <p className="font-bold">1091D</p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
