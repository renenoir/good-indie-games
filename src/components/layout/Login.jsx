import React, { useState } from "react";
import { Modal } from "react-responsive-modal";
import styled, { createGlobalStyle } from "styled-components";
import TextField from "@atlaskit/textfield";
import { useForm } from "react-hook-form";
import Button from "@atlaskit/button";

function Login({ isOpen, setIsOpen }) {
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
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
