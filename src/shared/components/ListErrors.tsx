import React from "react";
import { Errors } from "../../types";

interface ListErrorsProps {
  errors: Errors;
}

const ListErrors: React.FC<ListErrorsProps> = ({ errors }) => {
  const errorList = Object.keys(errors.errors || {}).reduce(
    (acc: string[], key) => {
      const messages = errors.errors[key];
      const formattedMessages = messages.map((message) =>
        key === "" ? message : `${key} ${message}`,
      );
      return [...acc, ...formattedMessages];
    },
    [],
  );

  if (errorList.length === 0) {
    return null;
  }

  return (
    <ul className="error-messages">
      {errorList.map((error, index) => (
        <li key={index}>{error}</li>
      ))}
    </ul>
  );
};

export default ListErrors;
