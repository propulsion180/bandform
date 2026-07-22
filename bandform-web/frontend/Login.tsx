import { graphql } from "./gql/gql";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useReactiveVar } from "@apollo/client/react";
import { LoginDocument, LoginMutation, LoginMutationVariables } from "./gql/graphql";


interface LoginProps {
  setUser: (value: LoginMutation['login']['user'] | null) => void;
}


const LOGIN = graphql(`
  mutation Login($name: String!, $password: String!){
    login(name: $name, password: $password){
       user {
         id
         name
         email
         role
       }
    }
  }
  `);

export default function Login({ setUser }: LoginProps) {
  // States to hold form input values
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const [login, { loading, error }] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN);

  // Handle form submission

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submi

    try {

      const result = await login({
        variables: { name, password}
      });

      
      

      setUser(result.data?.login.user || null);
      
      // Optionally, you can store the token or handle redirecting:
      // localStorage.setItem('auth_token', data.auth_token);
      // window.location.href = '/dashboard'; // Redirect to a protected page
    } catch (err) {
      setErr("An error occurred while trying to log in.");
      console.error("Error:", err);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            className="form-input"
            type="text"
            id="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            className="form-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {err && <p style={{ color: "red" }}>{err}</p>}
        <button type="submit" className="small-button">
          Login
        </button>
      </form>
    </div>
  );
}
