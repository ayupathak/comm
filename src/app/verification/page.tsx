import { Fragment } from "react";
import VerifyTokenForm from "../components/forms/verifyToken.form";
import Navbar from "../components/ui/nav-bar";

export default async function VerifyToken() {
  return (
    <Fragment>
      <Navbar />

      <main className="container mx-auto my-4 flex min-h-screen w-full items-start justify-center">
        <VerifyTokenForm />
      </main>
    </Fragment>
  );
}
