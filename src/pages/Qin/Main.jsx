import React, {useState} from "react";
import AfterLogin from "./AfterLogin";

function Main() {
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(null);
  const correctPassword = process.env.REACT_APP_QIN_PASS

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (password === correctPassword) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }

  return (
    <div className="h-full space-x-5 bg-blue-100 flex flex-col items-center justify-center">
      <p>Please enter the password:</p>
      <form onSubmit={handleSubmit}>
        <input
          id="pwd"
          type="password"
          className="rounded-md text-center"
          value={password}
          onChange={handlePasswordChange}
        />
        <input
          className="ml-3 p-0.5 rounded-md bg-blue-300"
          type="submit"
          value="Submit"
        />
      </form>
      {isValid === false && <div className="mt-3 text-red-500">Wrong password, please try again.</div>}
      {isValid === true && <AfterLogin/>}
    </div>
  );
}

export default Main;