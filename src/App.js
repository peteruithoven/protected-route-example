import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.js";

class App extends React.Component {
  constructor() {
    super();
    this.state = { isAuthenticated: false };
  }
  signin = () => {
    this.setState({ isAuthenticated: true });
  };
  signout = () => {
    this.setState({ isAuthenticated: false });
  };
  render() {
    const { isAuthenticated } = this.state;
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/public">Public</Link>
            </li>
            <li>
              <Link to="/protected">Protected</Link>
            </li>
            <li>
              <Link to="/admin/1">Admin 1</Link>
            </li>
            <li>
              <Link to="/admin/2">Admin 2</Link>
            </li>
            {isAuthenticated ? (
              <li>
                <button onClick={this.signout}>Logout</button>
              </li>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
          <Route path="/public" component={Public} />
          <ProtectedRoute
            path="/login"
            render={props => <Login signin={this.signin} {...props} />}
            isAuthenticated={!isAuthenticated}
            redirectTo="/"
            useFrom
          />
          <ProtectedRoute
            path="/protected"
            component={Protected}
            isAuthenticated={isAuthenticated}
            redirectTo="/login"
          />
          <ProtectedRoute
            path="/admin"
            isAuthenticated={isAuthenticated}
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
  }
}

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
