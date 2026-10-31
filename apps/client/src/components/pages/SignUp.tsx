import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

import { createUser } from "@/services/user.service";
import { validateEmail } from "@/utils";

type SignUpFormData = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
};

type ValidationErrors = Partial<
  Record<keyof SignUpFormData, string>
>;

const initialUserData: SignUpFormData = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  password: "",
};

const validateField = (
  name: keyof SignUpFormData,
  value: string
): string => {
  const trimmedValue = value.trim();

  switch (name) {
    case "firstName":
      return trimmedValue ? "" : "First name is required.";

    case "lastName":
      return trimmedValue ? "" : "Last name is required.";

    case "userName":
      return trimmedValue ? "" : "Username is required.";

    case "email":
      if (!trimmedValue) return "Email is required.";
      if (!validateEmail(trimmedValue)) {
        return "Please enter a valid email address.";
      }
      return "";

    case "password":
      return value ? "" : "Password is required.";

    default:
      return "";
  }
};

const validateForm = (
  values: SignUpFormData
): ValidationErrors => {
  return {
    firstName: validateField("firstName", values.firstName),
    lastName: validateField("lastName", values.lastName),
    userName: validateField("userName", values.userName),
    email: validateField("email", values.email),
    password: validateField("password", values.password),
  };
};

const SignUp = () => {
  const navigate = useNavigate();

  const [userData, setUserData] =
    useState<SignUpFormData>(initialUserData);

  const [validationErrors, setValidationErrors] =
    useState<ValidationErrors>({});

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const fieldName = name as keyof SignUpFormData;

    setUserData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    setValidationErrors((prev) => ({
      ...prev,
      [fieldName]: validateField(fieldName, value),
    }));
  };

  const handleSubmit = async (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const errors = validateForm(userData);

    setValidationErrors(errors);

    if (Object.values(errors).some(Boolean)) return;

    try {
      const response = await createUser({
        ...userData,
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        userName: userData.userName.trim(),
        email: userData.email.trim(),
      });

      if (response) {
        toast.success(
          response.data.message || "User added successfully"
        );

        navigate("/auth/login", { replace: true });
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create account"
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form noValidate onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field data-invalid={!!validationErrors.firstName}>
                  <FieldLabel htmlFor="firstName">
                    First name
                  </FieldLabel>

                  <Input
                    id="firstName"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    aria-invalid={!!validationErrors.firstName}
                  />

                  {validationErrors.firstName && (
                    <FieldDescription className="text-destructive text-xs">
                      {validationErrors.firstName}
                    </FieldDescription>
                  )}
                </Field>

                <Field data-invalid={!!validationErrors.lastName}>
                  <FieldLabel htmlFor="lastName">
                    Last name
                  </FieldLabel>

                  <Input
                    id="lastName"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    aria-invalid={!!validationErrors.lastName}
                  />

                  {validationErrors.lastName && (
                    <FieldDescription className="text-destructive text-xs">
                      {validationErrors.lastName}
                    </FieldDescription>
                  )}
                </Field>
              </div>

              <Field data-invalid={!!validationErrors.userName}>
                <FieldLabel htmlFor="userName">
                  Username
                </FieldLabel>

                <Input
                  id="userName"
                  name="userName"
                  type="text"
                  value={userData.userName}
                  onChange={handleChange}
                  placeholder="John12"
                  aria-invalid={!!validationErrors.userName}
                />

                {validationErrors.userName && (
                  <FieldDescription className="text-destructive text-xs">
                    {validationErrors.userName}
                  </FieldDescription>
                )}
              </Field>

              <Field data-invalid={!!validationErrors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                  aria-invalid={!!validationErrors.email}
                />

                {validationErrors.email && (
                  <FieldDescription className="text-destructive text-xs">
                    {validationErrors.email}
                  </FieldDescription>
                )}
              </Field>

              <Field data-invalid={!!validationErrors.password}>
                <FieldLabel htmlFor="password">
                  Password
                </FieldLabel>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={userData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  aria-invalid={!!validationErrors.password}
                />

                {validationErrors.password && (
                  <FieldDescription className="text-destructive text-xs">
                    {validationErrors.password}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <Button type="submit">Sign up</Button>

                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link to="/auth/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>.
      </FieldDescription>
    </div>
  );
};

export default SignUp;