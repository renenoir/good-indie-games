import React, { useState } from "react";
import { Modal } from "react-responsive-modal";
import styled, { createGlobalStyle } from "styled-components";
import TextField from "@atlaskit/textfield";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@atlaskit/button";

function Login({ isOpen, setIsOpen }) {
  const [isRegister, setIsRegister] = useState(true);

  const loginSchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().min(5).required(),
    name: isRegister ? Yup.string() : Yup.string().required(),
  });

  const { values, errors, handleSubmit, handleChange } = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  console.log(errors);

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      center
      classNames={{
        modal: "loginModal",
      }}
    >
      <Header>{isRegister ? "Login" : "Register"}</Header>
      <form onSubmit={handleSubmit}>
        {isRegister || (
          <FieldWrap>
            <label htmlFor="name">Name</label>
            <TextField
              id="name"
              name="name"
              isInvalid={!!errors.name}
              value={values.name}
              onChange={handleChange}
            />
          </FieldWrap>
        )}
        <FieldWrap>
          <label htmlFor="email">Email</label>
          <TextField
            id="email"
            name="email"
            isInvalid={!!errors.email}
            value={values.email}
            onChange={handleChange}
          />
        </FieldWrap>
        <FieldWrap>
          <label htmlFor="password">Password</label>
          <TextField
            type="password"
            id="password"
            name="password"
            isInvalid={!!errors.password}
            value={values.password}
            onChange={handleChange}
          />
        </FieldWrap>
        <Button type="submit" appearance="primary">
          {isRegister ? "Login" : "Register"}
        </Button>
        <Button
          appearance="link"
          onClick={() => {
            setIsRegister((prev) => !prev);
          }}
        >
          {isRegister ? "Register" : "Login"}
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
