import React from "react";

export const Header = ({ setLoggedIn, username }) => {
  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <React.Fragment>
      <div className="bg-gray-800 flex flex-row justify-between items-center px-12 py-3">
        <p className="text-2xl text-white"> Hello, {username}</p>
        <button
          onClick={() => logout()}
          className="inline-flex py-2 px-4 rounded-xl bg-gray-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Logout
        </button>
      </div>
    </React.Fragment>
  );
};
