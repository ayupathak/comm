import { Fragment } from "react";
import { getAuthUser } from "~/trpc/get-auth-user";
import Navbar from "../components/ui/nav-bar";
import CategorySelectionForm from "../components/forms/category-selection.form";

export default async function OnboardUser() {
  const user = await getAuthUser();

  return (
    <Fragment>
      <Navbar />

      <main className="container mx-auto my-4 flex min-h-screen w-full items-start justify-center">
        <CategorySelectionForm/>
      </main>
    </Fragment>
  );
}
