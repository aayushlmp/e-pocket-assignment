import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "cn";
import { toast } from "sonner";

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

import { signIn } from "@/services/auth.service";
import { validateEmail } from "@/utils";
import { useAuth } from "@/contexts/AuthContext";

type ValidationErrors = {
  email: boolean;
  password: boolean;
};

const initialErrors: ValidationErrors = {
  email: false,
  password: false,
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrors>(initialErrors);

  const { signInSuccessHandler } = useAuth();

  // Validate the supplied values, not the component state.
  const validate = (
    email: string,
    password: string
  ): ValidationErrors => ({
    email: !email.trim() || !validateEmail(email.trim()),
    password: !password,
  });

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setEmail(value);

    setValidationErrors((prev) => ({
      ...prev,
      email: !value.trim() || !validateEmail(value.trim()),
    }));
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setPassword(value);

    setValidationErrors((prev) => ({
      ...prev,
      password: !value,
    }));
  };

  const handleLogin = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validate(email, password);

    setValidationErrors(errors);

    if (errors.email || errors.password) return;

    try {
      const response = await signIn({
        email: email.trim(),
        password,
      });

      if (response) {
        toast.success(response.data.message || "Login successful");
        signInSuccessHandler(response.data.data);
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to login"
      );
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
              <Field data-invalid={validationErrors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>

                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={handleEmail}
                  aria-invalid={validationErrors.email}
                />

                {validationErrors.email && (
                  <FieldDescription className="text-destructive text-xs">
                    Please enter a valid email address.
                  </FieldDescription>
                )}
              </Field>

              <Field data-invalid={validationErrors.password}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>

                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePassword}
                  aria-invalid={validationErrors.password}
                />

                {validationErrors.password && (
                  <FieldDescription className="text-destructive text-xs">
                    Password is required.
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <Button type="submit">Login</Button>

                <FieldDescription className="text-center">
                  Don't have an account?{" "}
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