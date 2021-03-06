import React, { useState } from "react";
import { Box, Paper, Stack, TextField, Typography, Icon } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import { AuthLayout } from "@components/templates";
import { Button, Link } from "@components/atoms";

import { registerValidationSchema } from "@client/definitions/validationSchema";

import { NextPageWithLayout } from "@client/types";
import { useRegisterMutation } from "@client/redux/modules/auth";

type RegisterFormValues = {
  email: string;
  password: string;
  confirmationPassword: string;
};

const RegisterPage: NextPageWithLayout = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerValidationSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleToggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const [registerMutation, { isLoading }] = useRegisterMutation();

  const handleSubmitRegisterForm: SubmitHandler<RegisterFormValues> = async (
    data
  ) => {
    const { meta } = await registerMutation(data).unwrap();

    if (meta.status === "success") {
      router.push("/login");
    } else if (meta.status === "error" && meta.message === "EMAIL_IS_USED") {
      setError("email", {
        message: "Email you try to register already in used",
      });
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Paper component={Box} width="100%" maxWidth={400}>
        <Box mb={4}>
          <Typography variant="h4" textAlign="center">
            Sign Up
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(handleSubmitRegisterForm)}>
          <Stack spacing={2.5} mb={3}>
            <TextField
              {...register("email")}
              label="Email"
              placeholder="email@email.com"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
            />
            <TextField
              {...register("password")}
              label="Password"
              placeholder="**************"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: showPassword ? (
                  <Icon
                    sx={{ cursor: "pointer" }}
                    onClick={handleToggleShowPassword}
                  >
                    visibility
                  </Icon>
                ) : (
                  <Icon
                    sx={{ cursor: "pointer" }}
                    onClick={handleToggleShowPassword}
                  >
                    visibility_off
                  </Icon>
                ),
              }}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
            />
            <TextField
              {...register("confirmationPassword")}
              label="Confirmation Password"
              placeholder="Retype Password"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: showPassword ? (
                  <Icon
                    sx={{ cursor: "pointer" }}
                    onClick={handleToggleShowPassword}
                  >
                    visibility
                  </Icon>
                ) : (
                  <Icon
                    sx={{ cursor: "pointer" }}
                    onClick={handleToggleShowPassword}
                  >
                    visibility_off
                  </Icon>
                ),
              }}
              error={!!errors.confirmationPassword}
              helperText={errors.confirmationPassword?.message}
              disabled={isLoading}
            />

            <Typography variant="body2">
              Already have an account?{" "}
              <Link href="/login" fontWeight="bold">
                Sign In
              </Link>
            </Typography>
          </Stack>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            isLoading={isLoading}
          >
            SUBMIT
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

RegisterPage.getLayout = (page) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default RegisterPage;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const token = (req.cookies as { "ngelink-token": string })["ngelink-token"];

  if (token) {
    res.writeHead(307, { Location: "/" });
    res.end();
    return { props: {} };
  }

  return {
    props: {},
  };
};
