"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import React, { useState } from 'react'
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { RegisterUserInputType, RegisterUserSchema } from '~/lib/schema'
import { trpc } from '~/trpc/trpc'
import Link from 'next/link';
import FormInput from '../ui/form-input';
import FormButton from '../ui/form-button';

const RegisterForm = () => {
  const router = useRouter() 
  const [submitting, setSubmitting] = useState(false)

  const methods = useForm<RegisterUserInputType>({
    resolver: zodResolver(RegisterUserSchema),
    mode: "onChange"
  })

  const {reset, handleSubmit, formState, getValues} = methods

  const {mutate: registerhandler} = trpc.registerUser.useMutation({
    onMutate(){
      setSubmitting(true)
    },
    onSettled(){
      setSubmitting(false)
    },
    onError(error){
      reset({password: ""});
      toast.error(error.message)
      console.log("Error Message", error.message)
    },
    onSuccess(){
      toast.success("Signup Successful", {description: "Please check your inbox for verification token"})
      const userEmail = getValues("email")
      router.push(`/verification?email=${userEmail}`)
    }
  })


  const onSubmitHandler: SubmitHandler<RegisterUserInputType> = (values) => {
    registerhandler(values)
  }

  return (
    <FormProvider {...methods}>
          <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="bg-ct-dark-200 mx-auto flex w-full max-w-md flex-col items-center justify-center gap-1 space-y-5 overflow-hidden rounded-xl p-4 border"
      >
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <FormInput label="Name" name="name" type="text" />
        <FormInput label="Email" name="email" type="email" />
        <FormInput label="Password" name="password" type="password" />
        <FormButton disabled={!formState.isValid} loading={submitting} className="text-ct-blue-600 uppercase font-normal tracking-wide">
          Create Account 
        </FormButton>
        <hr className="w-full" />
        <span className="block">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-ct-blue-600 font-bold uppercase tracking-wide"
          >
            Login
          </Link>
        </span>
      </form>
    </FormProvider>
  )
}

export default RegisterForm