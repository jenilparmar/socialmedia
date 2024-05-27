import React, { useState } from "react";

export default function AuthenticationPage({setAuthenticated}) {
  const [user, setUser] = useState("Login");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoToLogin = () => {
    fetch(`/Auth/${email}/${password}`)
      .then(res => {
        if (!res.ok) {
          return Promise.reject(res.status);
        } else return res.json();
      })
      .then(data => {
        const arrayOfValue = Object.values(data)[0];
        const arrayOfKey = Object.keys(data)[0];
        if (arrayOfKey === "404") {
          alert(arrayOfValue);
        } else {
          localStorage.setItem('isAuthenticated', 'true'); // Save authentication status in local storage
          setAuthenticated(true);
        }
      })
      .catch(error => {
        if (error === 404) {
          alert("User not found");
        } else {
          console.log(error);
        }
      });
  };
  
  const handleLogin = () => {
    setUser(user === "Login" ? "Signin" : "Login");
  };

  return (
    <>
   

      <div
        className="flex flex-col w-screen justify-center h-screen"
        style={{
          backgroundColor: "#191919",
          // filter: "drop-shadow(0 0 0.75rem red)"

}}>
        <div className="self-center bg-tranperent w-64 h-80 border-2 border-yellow-500 rounded-lg flex flex-col"
        >
          <div className="text-center self-center relative top-5 text-yellow-300 text-2xl font-bold">
            {user === "Signin" ? "Sign-in" : "Login"}
          </div>
          <input
            type="email"
            placeholder={!isEmailFocused ? "Email" : ""}
            className="text-left w-48 text-white text-xs self-center placeholder:text-left bg-inherit my-3 p-2 placeholder:relative focus:text-white placeholder:-left-1 placeholder:bottom-0.5  focus:border-transparent placeholder:text-sm focus:bg-tr"
            name="email"
            required
            style={{
              border: "0.2vh solid white",
              padding: "0 1em",
              marginTop: "4em",
              borderRadius: "10px",
              height: "7vh",
            }}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder={!isPasswordFocused ? "Password" : ""}
            className="text-left w-48 text-white text-xs placeholder:text-sm placeholder:text-left placeholder:relative placeholder:bottom-0.5 placeholder:-left-1 focus:text-white self-center bg-inherit my-3 p-2 focus:border-transparent focus:bg-tr"
            name="password"
            required
            style={{
              border: "0.2vh solid white",
              padding: "0 1em",
              borderRadius: "10px",
              height: "7vh",
            }}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="cursor-pointer text-xs text-right relative right-10 hover:text-blue-700 text-white">
            Forgot password?
          </div>
          <div
            className="text-sm h-8 flex flex-col justify-center align-middle self-center bg-yellow-300 cursor-pointer border-2 border-black w-48 my-4 text-center font-semibold rounded-2xl"
            onClick={handleGoToLogin}>
            <div>{user === "Signin" ? "Sign-in" : "Login"}</div>
          </div>
          <div className="text-white flex flex-row text-xs text-center self-center">
            {user === "Login" ? "Don't Have an account?" : "Already have account? "}
            <p
              className="hover:text-blue-700 font-bold cursor-pointer"
              style={{ marginLeft: "5px" }}
              onClick={handleLogin}>
              {user === "Login" ? "Sign-in" : "Login"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}