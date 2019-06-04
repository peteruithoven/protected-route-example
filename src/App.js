import React, { useState } from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.js";
import './App.css';

const App = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <div>
        <ul class="menu">
          <li>
            <NavLink to="/public">Public</NavLink>
          </li>
          <li>
            <NavLink to="/protected">Protected</NavLink>
          </li>
          <li>
            <NavLink to="/admin/1">Admin 1</NavLink>
          </li>
          <li>
            <NavLink to="/admin/2">Admin 2</NavLink>
          </li>
          {isAuthenticated ? (
            <li>
              <button onClick={() => setAuthenticated(false)}>Logout</button>
            </li>
          ) : (
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          )}
        </ul>
        <Route path="/public" component={Public} />
        <ProtectedRoute
          path="/login"
          render={props => <Login signin={() => setAuthenticated(true)} {...props} />}
          predicate={!isAuthenticated}
          redirectTo="/"
          useFrom
        />
        <ProtectedRoute
          path="/protected"
          component={Protected}
          predicate={isAuthenticated}
          redirectTo="/login"
        />
        <ProtectedRoute
          path="/admin"
          predicate={isAuthenticated}
          redirectTo="/login"
        >
          <>
            <Route path="/admin/1" render={() => <h3>Admin page 1</h3>} />
            <Route path="/admin/2" render={() => <h3>Admin page 2</h3>} />
          </>
        </ProtectedRoute>
      </div>
    </Router>
  );
};

function Public() {
  return <h3>Public page</h3>;
}

function Protected() {
  return <h3>Protected page</h3>;
}

function Login({ location, signin }) {
  const { state } = location;
  const fromPathname = state && state.from && state.from.pathname;
  return (
    <div>
      <h3>Login page</h3>
      {fromPathname && (
        <p>You must log in to view the page at {fromPathname}</p>
      )}
      <button onClick={signin}>Log in</button>
    </div>
  );
}

export default App;
