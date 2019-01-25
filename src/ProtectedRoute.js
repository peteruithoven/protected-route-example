// based on: https://github.com/devbytecom/react-protected-route/

import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import renderProps from "render-props";

class ProtectedRoute extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    redirectTo: PropTypes.string,
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    childen: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    render: PropTypes.func,
    useFrom: PropTypes.bool
  };

  static defaultProps = {
    isAuthenticated: false,
    redirectTo: "/",
    useFrom: false
  };

  render() {
    const {
      isAuthenticated,
      redirectTo,
      component,
      render,
      children,
      useFrom,
      ...rest
    } = this.props;

    return (
      <Route
        {...rest}
        render={props => {
          if (isAuthenticated) {
            if (React.isValidElement(children)) return children;
            else return renderProps(component || children || render, props);
          } else {
            const { state } = props.history.location;
            const fromPathname = state && state.from && state.from.pathname;
            return (
              <Redirect
                to={{
                  pathname: useFrom ? fromPathname || redirectTo : redirectTo,
                  state: { from: props.location }
                }}
              />
            );
          }
        }}
      />
    );
  }
}

export default ProtectedRoute;
