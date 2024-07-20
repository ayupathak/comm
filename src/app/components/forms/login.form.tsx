"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { LoginUserInputType, LoginUserSchema } from "~/lib/schema";
import { trpc } from "~/trpc/trpc";
import Link from "next/link";
import FormInput from "../ui/form-input";
import FormButton from "../ui/form-button";

const LoginForm = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<LoginUserInputType>({
    resolver: zodResolver(LoginUserSchema),
  });

  const { reset, handleSubmit, formState } = methods;

  const { mutate: loginHandler } = trpc.loginUser.useMutation({
    onMutate() {
      setSubmitting(true);
    },
    onSettled() {
      setSubmitting(false);
    },
    onError(error) {
      reset({ password: "" });
      toast.error(error.message);
      console.log("Error Message", error.message);
    },
    onSuccess() {
      toast.success("Login Successful");
      router.push("/onboard");
    },
  });

  const onSubmitHandler: SubmitHandler<LoginUserInputType> = (values) => {
    loginHandler(values);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="bg-ct-dark-200 mx-auto flex w-full max-w-md flex-col items-center justify-center gap-1 space-y-5 overflow-hidden rounded-xl border p-4"
      >
        <h1 className="text-2xl font-semibold">Login</h1>
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-lg">Welcome back to ECOMMERCE</h1>
          <p className="text-sm">The next gen business marketplace</p>
        </div>
        <FormInput label="Email" name="email" type="email" />
        <FormInput label="Password" name="password" type="password" />
        <FormButton
          disabled={!formState.isValid}
          loading={submitting}
          className="text-ct-blue-600 font-normal uppercase tracking-wide"
        >
          Login
        </FormButton>
        <hr className="w-full" />
        <span className="block">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-ct-blue-600 font-bold uppercase tracking-wide"
          >
            Sign Up
          </Link>
        </span>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
