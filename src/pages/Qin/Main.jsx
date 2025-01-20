import React, { useState } from "react";
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Welcome Qin!</h1>
                <p className="text-gray-600 mb-6">Please enter the secret password to continue:</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        id="pwd"
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Submit
                    </button>
                </form>
                {isValid === false && (
                    <div className="mt-4 text-red-500 text-sm">Wrong password, please try again.</div>
                )}
                {isValid === true && (
                    <div className="mt-6 transition-opacity duration-500 ease-in-out">
                        <AfterLogin />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Main;