import React, { useState } from "react";
import { graphql } from "./gql/";
import { useMutation } from "@apollo/client/react";
import { CreateUserMutation, CreateUserMutationVariables } from "./gql/graphql";
import { useNavigate } from "react-router-dom";

const SIGNUP = graphql(`  
  mutation CreateUser($name: String!, $email: String!, $plainPassword: String!, $age: Int!, $city: String!, $country: String!, $description: String!, $genres: [String!]!, $instruments: [String!]!) {
    createUser(name: $name, email: $email, plainPassword: $plainPassword, age: $age, city: $city, country: $country, description: $description, genres: $genres, instruments: $instruments){
      id
      name
    }
  }
  `);

export default function Signup() {
  // States to hold form input values
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [plainPassword, setPlainPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<number>(0);
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [genres, setGenres] = useState<string[]>([]);
  const [instruments, setInstruments] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [createuser, {loading, error}] = useMutation<CreateUserMutation, CreateUserMutationVariables>(SIGNUP);

  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submission

    try {

      const response = await createuser({
        variables: {
          name,
          plainPassword,
          email,
          age,
          city,
          country,
          description,
          genres,
          instruments
        }
      });

      if(response.data?.createUser.id != null){
        navigate("/login");
      }
      
    } catch (err) {
      setErr(error?.message.toString);
      setSuccessMessage(""); // Clear success message on error
      console.error("Error:", err);
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username </label>
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
          <label htmlFor="password">Password </label>
          <input
            className="form-input"
            type="password"
            id="password"
            value={plainPassword}
            onChange={(e) => setPlainPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email </label>
          <input
            className="form-input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="age">Age </label>
          <input
            className="form-input"
            type="number"
            id="Age"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            min={0}
            max={100}
            required
          />
        </div>
        <div>
          <label htmlFor="city">City </label>
          <input
            className="form-input"
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="country">Country </label>
          <input
            className="form-input"
            type="text"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description </label>
          <input
            className="form-input"
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
      
        {error && <p style={{ color: "red" }}>{err}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <button type="submit" className="small-button">
          Sign Up
        </button>
      </form>
    </div>
  );
}
