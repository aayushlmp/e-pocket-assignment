import { Link } from "react-router-dom";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { signIn } from "@/services/auth.service";
import { toast } from "sonner";
import type { LoginResponseDto } from "@e-pocket-assignment/shared/interfaces";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {signInSuccessHandler} = useAuth()

  const handleSuccessHandler = (loginResponseDto: LoginResponseDto) => {
    signInSuccessHandler(loginResponseDto)
  }
  const handleLogin = async (event: React.SubmitEvent) => {
    event.preventDefault();
    try {
      const response = await signIn({email, password});
      if(response) {
        toast.success(response.data.message || "Login successfully");
        handleSuccessHandler(response.data.data)
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Email</CardDescription>
        </CardHeader>
        <CardContent>
          <form noValidate onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                {/* <FieldDescription data-invalid>
                  This is required field.
                </FieldDescription> */}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {/* <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="**********"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link to="/auth/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default Login;
