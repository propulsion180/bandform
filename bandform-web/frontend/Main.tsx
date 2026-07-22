import React from "react";
import { useNavigate } from "react-router-dom";
import { LoginMutation } from "./gql/graphql";

interface MainProps {
  user: LoginMutation['login']['user'] | null;
}



export default function Main({ user }: MainProps) {


  return (
    <></>
  );
}
