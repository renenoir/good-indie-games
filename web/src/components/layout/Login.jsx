import React, { useState } from "react";
import { Modal } from "react-responsive-modal";
import styled, { createGlobalStyle } from "styled-components";
import TextField from "@atlaskit/textfield";
import { useForm } from "react-hook-form";
import Button from "../common/Button";
import useUser from "../../hooks/useUser";
import { makeRequest } from "../../utils/makeRequest";

function Login({ open, setOpen }) {
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, errors } = useForm();
  const { setToken } = useUser();

  const onSubmit = async (data) => {
    try {
      if (isResetPassword) {
        const result = await makeRequest("password_reset", {
          email: data.email,
        });
        if (result?.status === "OK") {
          setOpen(false);
        } else {
          throw new Error("Password reset is failed");
        }
        return;
      }

      if (!isLogin) {
        const { name } = await makeRequest("create", {
          email: data.email,
          name: data.name,
          password: data.password,
        });

        if (!name) {
          throw new Error("Register is failed");
        }
      }

      const { token } = await makeRequest("token", {
        email: data.email,
        password: data.password,
      });

      if (!token) {
        throw new Error("Failed to fetch token");
      }

      setToken(token);
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      center
      classNames={{
        modal: "loginModal",
      }}
    >
      <Header>
        {isResetPassword ? "Reset password" : isLogin ? "Login" : "Register"}
      </Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isLogin || isResetPassword || (
          <FieldWrap>
            <label htmlFor="name">Name</label>
            <TextField
              id="name"
              name="name"
              ref={register({
                required: true,
              })}
              isInvalid={!!errors.name}
            />
          </FieldWrap>
        )}
        <FieldWrap>
          <label htmlFor="email">Email</label>
          <TextField
            id="email"
            name="email"
            ref={register({
              pattern:
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              required: true,
            })}
            isInvalid={!!errors.email}
          />
        </FieldWrap>
        {isResetPassword || (
          <FieldWrap>
            <label htmlFor="password">Password</label>
            <TextField
              type="password"
              id="password"
              name="password"
              ref={register({
                required: true,
                minLength: 5,
              })}
              isInvalid={!!errors.password}
            />
          </FieldWrap>
        )}

        {isResetPassword ? (
          <>
            <Button type="submit" appearance="primary">
              Reset password
            </Button>
            <Button
              appearance="link"
              onClick={() => {
                setIsResetPassword(false);
                setIsLogin(true);
              }}
            >
              Login
            </Button>
          </>
        ) : (
          <Button type="submit" appearance="primary">
            {isLogin ? "Login" : "Register"}
          </Button>
        )}

        <Button
          appearance="link"
          onClick={() => {
            setIsLogin((prev) => !prev);
            setIsResetPassword(false);
          }}
        >
          {isLogin ? "Register" : "Login"}
        </Button>
        {isResetPassword || (
          <Button
            appearance="link"
            onClick={() => {
              setIsLogin(true);
              setIsResetPassword(true);
            }}
          >
            Reset password
          </Button>
        )}
      </form>
      <ModalStyles />
    </Modal>
  );
}

const ModalStyles = createGlobalStyle`
  .loginModal {
    width: 500px;
  }
`;

const Header = styled.h2`
  margin-top: 0.5rem;
`;

const FieldWrap = styled.div`
  &:not(:last-child) {
    margin-bottom: 1.25rem;
  }
`;

export default Login;
