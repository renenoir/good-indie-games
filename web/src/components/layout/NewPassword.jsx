import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { parse } from "query-string";
import { useForm } from "react-hook-form";
import Modal from "react-responsive-modal";
import TextField from "@atlaskit/textfield";

import Button from "../common/Button";
import { makeRequest } from "../../utils/makeRequest";

const NewPassword = () => {
  const location = useLocation();
  const history = useHistory();
  const { register, handleSubmit, errors: formErrors } = useForm();

  const [open, setOpen] = useState(false);
  const [token, setToken] = useState();
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (errors.length) {
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  }, [errors.length]);

  useEffect(() => {
    const query = parse(location.search);
    if (query?.reset === "y") {
      setOpen(true);
      setToken(query.token);
    }
  }, []);

  const onClose = () => {
    setOpen(false);
    history.push(`/`);
  };

  const onSubmit = async (data) => {
    try {
      const result = await makeRequest("password_reset/confirm", {
        token,
        password: data.password,
      });

      if (result?.status === "OK") {
        onClose();
      } else {
        setErrors(
          result?.password || [result?.detail || "Failed to fetch token"]
        );
        throw new Error("Failed to fetch token");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      classNames={{
        modal: "loginModal",
      }}
    >
      {errors.length ? (
        errors.map((err) => <Header key={err}>{err}</Header>)
      ) : (
        <>
          <Header>New password</Header>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                isInvalid={!!formErrors.password}
              />
            </FieldWrap>

            <Button type="submit" appearance="primary">
              Save
            </Button>
          </form>
        </>
      )}
      <ModalStyles />
    </Modal>
  );
};

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

export default NewPassword;
