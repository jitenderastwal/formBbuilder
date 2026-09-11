"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import {useSignup} from "~/hooks/api/auth/index"
import { useState } from "react"
import { useRouter } from "next/navigation"


type FormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const {  createUserWithEmailAndPasswordAsync,isSuccess,isError ,error} = useSignup()
  const { register, handleSubmit } = useForm<FormValues>()
const [loading,setloading] = useState(false)
const router = useRouter()
  const onSubmit = async (values: FormValues) => {
    setloading(true)
    if (values.password !== values.confirmPassword) {
      return
    }

    const { id } = await createUserWithEmailAndPasswordAsync({
      fullName: values.name,
      email: values.email,
      password: values.password,
    })
    if(isSuccess){
      console.log("User created with ID:", id)
      alert("user created")
    }
    if(isError){
      alert(`Error creating user: ${error?.message}`)
    }
setloading(false)
router.push("/dashboard")
    
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                {...register("name")}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register("email")}
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                required
                {...register("password")}
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                required
                {...register("confirmPassword")}
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>

            <FieldGroup>
              <Field>
                
                <Button type="submit">{loading ? "Loading" : "Create Account"}</Button>
                <Button variant="outline" type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="#">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}