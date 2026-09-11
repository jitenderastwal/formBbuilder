"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { cn } from "cn"
import { useSignIn } from "~/hooks/api/auth"

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

type FormValues = {
  email: string
  password: string
}


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signInUserWithEmailAndPasswordAsync, status } = useSignIn()
  const isPending = status === "pending"
  const { register, handleSubmit } = useForm<FormValues>()
  const router = useRouter()

  const onSubmit = async (values: FormValues) => {
    try {
      const { id } = await signInUserWithEmailAndPasswordAsync(values)
      console.log("User signed in with ID:", id)

      router.push("/dashboard")
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to sign in")
    }

  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Logging in..." : "Login"}
                </Button>
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
