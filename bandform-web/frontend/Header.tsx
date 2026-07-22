import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ImageData } from "./App";
import { LoginMutation, UserType } from "./gql/graphql";
import { graphql } from "./gql";
import { useMutation } from "@apollo/client/react";
import Login from "./Login";
interface HeaderProps {
  user: LoginMutation['login']['user'] | null ;
  setUser: (value: LoginMutation['login']['user'] | null) => void;
  logout: () => Promise<void>;
}

const LOGOUT = graphql(`
    mutation Logout{
      logout
    }
  `);

export default function Header({ user, setUser }: HeaderProps) {
  const navigate = useNavigate();
  let admin: boolean = false;

  if(user != null){
    admin = user.role !== 'NORMAL';
  }
  const [logout, {loading, error}] = useMutation(LOGOUT);

  const handleLogout = async () => {
      try {
        const result = await logout();
        if(result){setUser(null);}
      } catch (error) {
        console.error("Logout failed:", error);
      }
  };


  return (
    <div className="header">
      {user == null && <h1>Migada's Image Gallery</h1>}
      {user != null && <h1>Welcome {user.name}</h1>}
      <div className="navButtonContainer">
        <a
          className="nav-button"
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </a>
        {user == null && (
          <a
            className="nav-button"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Signup
          </a>
        )}
        {user == null && (
          <a
            className="nav-button"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </a>
        )}
        {user != null && admin && (
          <a
            className="nav-button"
            onClick={() => {
              navigate("/admin");
            }}
          >
            Admin
          </a>
        )}
        {user != null && (
          <a className="nav-button" onClick={logout}>
            Logout
          </a>
        )}
      </div>
      <hr className="hr-solid" />
    </div>
  );
}
