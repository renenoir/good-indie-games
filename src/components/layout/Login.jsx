import React, { useState } from "react";
import { Modal } from "react-responsive-modal";
import styled, { createGlobalStyle } from "styled-components";
import TextField from "@atlaskit/textfield";
import { useForm } from "react-hook-form";
import Button from "@atlaskit/button";

async function makeRequest(method, data) {
  const url = `${process.env.REACT_APP_API_ENDPOINT}/user/${method}/`;
  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return await result.json();
}

function Login({ open, setOpen }) {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {
    try {
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

      localStorage.setItem("token", token);

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
      <Header>{isLogin ? "Login" : "Register"}</Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isLogin || (
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
              pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              required: true,
            })}
            isInvalid={!!errors.email}
          />
        </FieldWrap>
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
        <Button type="submit" appearance="primary">
          {isLogin ? "Login" : "Register"}
        </Button>
        <Button
          appearance="link"
          onClick={() => {
            setIsLogin((prev) => !prev);
          }}
        >
          {isLogin ? "Register" : "Login"}
        </Button>
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
