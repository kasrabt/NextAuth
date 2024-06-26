import { useRef, useState } from "react";
import classes from "./auth-form.module.css";
import { signIn } from "next-auth/client";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
function AuthForm() {
  const createUser = async (email, password) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = (await res).json();

    return data;
  };
  const [isLogin, setIsLogin] = useState(true);
  const emailInput = useRef();
  const passwordInput = useRef();
  const router = useRouter();
  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }
  const SubmitHandler = async (e) => {
    e.preventDefault();
    const email = emailInput.current.value;
    const password = passwordInput.current.value;
    if (!isLogin) {
      try {
        toast("sending ...");
        await createUser(email, password);
        toast.success("your account created");
      } catch (err) {
        toast.error("somthing went wrong!!");
      }
    } else {
      try {
        toast("sending ...");
        await signIn("credentials", {
          redirect: false,
          email: email,
          password: password,
        });
        toast.success(" you are logged in");
        router.replace("/profile");
      } catch (err) {
        toast.error("somthing went wrong!!");
      }
    }
  };

  return (
    <>
      <Toaster />
      <section className={classes.auth}>
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        <form onSubmit={SubmitHandler}>
          <div className={classes.control}>
            <label htmlFor="email">Your Email</label>
            <input type="email" id="email" required ref={emailInput} />
          </div>
          <div className={classes.control}>
            <label htmlFor="password">Your Password</label>
            <input type="password" id="password" required ref={passwordInput} />
          </div>
          <div className={classes.actions}>
            <button>{isLogin ? "Login" : "Create Account"}</button>
            <button
              type="button"
              className={classes.toggle}
              onClick={switchAuthModeHandler}
            >
              {isLogin ? "Create new account" : "Login with existing account"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default AuthForm;
