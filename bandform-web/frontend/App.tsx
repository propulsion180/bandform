import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactDOM from "react-dom";
import {
  useNavigate,
  Routes,
  Route,
  BrowserRouter as Router,
} from "react-router-dom";
import Main from "./Main";
import Single from "./Single";
import Login from "./Login";
import Signup from "./Signup";
import Admin from "./Admin";
import Header from "./Header";
import { LoginMutation } from "./gql/graphql";



const App: React.FC = () => {
  console.log("starting");
  const [user, setUser] = useState<LoginMutation['login']['user'] | null >(null);
    // useEffect(() => {
  //   fetch("https://" + host + "/tknlgn")
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then((data: LoginResponse) => {
  //       console.log(data.message);
  //       setUser(data.username);
  //       setAdmin(data.admin);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching nodes", error);
  //     });
  // }, []);
  
  const host = window.location.host;

  return (
    <div className="center">
      <Router>
        <Header user={user} logout={logout} />
        <Routes>
          <Route path="/" element={<Main user={user} />} />
          // <Route path="/single" element={<Single />} />
          <Route
            path="/login"
            element={
              <Login setUser={setUser} />
            }
          />
          <Route path="/signup" element={<Signup host={host} />} />
          <Route
            path="/admin"
            element={<Admin user={user} />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
