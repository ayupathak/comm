import { Fragment } from "react";
import RegisterForm from "../components/forms/register.form";
import Navbar from "../components/ui/nav-bar";

export default async function Login() {
  return (
    <Fragment>
      <Navbar />
      <main className="container mx-auto my-4 flex min-h-screen w-full items-start justify-center">
        <RegisterForm />
      </main>
    </Fragment>
  );
}
