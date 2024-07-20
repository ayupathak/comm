"use client";
import React, { Suspense, useState } from "react";
import FormButton from "../ui/form-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailCodeInputType, EmailCodeSchema } from "~/lib/schema";
import { trpc } from "~/trpc/trpc";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { maskEmail } from "~/lib/utils";

const UserEmail = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const maskedEmail = maskEmail(email!);

  return <span className="font-bold">{maskedEmail}</span>;
};

const VerifyTokenForm = () => {
  const router = useRouter();
  const [digits, setDigits] = useState(Array(8).fill(""));
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<EmailCodeInputType>({
    resolver: zodResolver(EmailCodeSchema),
    mode: "onChange",
  });

  const { reset, handleSubmit, formState, setValue } = methods;

  const handleInput =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDigits = [...digits];
      newDigits[index] = e.target.value;
      setDigits(newDigits);

      if (e.target.value && index < 8) {
        const nextInput = document.getElementById(
          `otp-${index + 1}`,
        ) as HTMLInputElement;
        nextInput && nextInput.focus();
      }

      const otpValue = newDigits.join("");
      setValue("code", otpValue, { shouldValidate: true });
    };

  const { mutate: verifyCodeHandler } = trpc.verifyCode.useMutation({
    onMutate() {
      setSubmitting(true);
    },
    onSettled() {
      setSubmitting(false);
    },
    onError(error) {
      reset({ code: "" });
      toast.error(error.message);
      console.log("Error Message", error.message);
    },
    onSuccess() {
      toast.success("Email Verified");
      router.push("/");
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    verifyCodeHandler(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-ct-dark-200 mx-auto flex w-full max-w-md flex-col items-center justify-center gap-5 space-y-5 overflow-hidden rounded-xl border p-4"
    >
      <h1 className="text-2xl font-semibold">Verify your email</h1>
      <p className="text-center">
        Enter the 8 digit code you have received on <br />{" "}
        <Suspense>
          <UserEmail/>
        </Suspense>
      </p>
      <div className="flex w-full flex-col items-start gap-4">
        <p>code</p>
        <div className="flex w-full justify-between gap-2">
          {digits.map((_, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              className="form-input h-10 w-10 rounded-md border border-gray-300 text-center"
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digits[index]}
              onChange={handleInput(index)}
            />
          ))}
        </div>
      </div>
      <FormButton
        disabled={!formState.isValid}
        loading={submitting}
        className="text-ct-blue-600 font-normal uppercase tracking-wide"
      >
        Verify
      </FormButton>
    </form>
  );
};

export default VerifyTokenForm;
