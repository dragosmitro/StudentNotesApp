import React from "react";
import classNames from "classnames";

export const Label = ({ label, outlined = false }) => {
  return (
    <React.Fragment>
      <p
        className={classNames("text-sm text-gray-200", {
          "px-4 py-1 bg-gray-500 rounded-xl": outlined,
        })}
      >
        {label}
      </p>
    </React.Fragment>
  );
};
