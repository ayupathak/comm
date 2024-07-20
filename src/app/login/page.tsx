import { Fragment } from "react";
import LoginForm from "../components/forms/login.form";
import Navbar from "../components/ui/nav-bar";

export default async function Login() {
  return (
    <Fragment>
      <Navbar />

      <main className="container mx-auto my-4 flex min-h-screen w-full items-start justify-center">
        <LoginForm />
      </main>
    </Fragment>
  );
}
