import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthConsumer } from './auth/auth-context';
import protectedComponent from './auth/protected-component';
import Emoji from './emoji';

const NavbarBurger = ({ active, onClick }) => (
  <div
    className={`navbar-burger burger ${active ? 'is-active' : ''}`}
    onClick={onClick}
  >
    <span />
    <span />
    <span />
  </div>
);

const NavbarLink = ({ children, ...rest }) => (
  <NavLink className="navbar-item" activeClassName="is-active" {...rest}>
    {children}
  </NavLink>
);

class Navbar extends Component {
  state = {
    isMenuExpanded: false
  };

  render() {
    const { isMenuExpanded } = this.state;

    return (
      <nav className="navbar is-warning">
        <div className="container">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item">
              <h1>
                <Emoji value="👨🏻‍💻" label="hacker" /> Hacker News Clone
              </h1>
            </Link>
            <NavbarBurger
              active={isMenuExpanded}
              onClick={() => this.setState({ isMenuExpanded: !isMenuExpanded })}
            />
          </div>

          <div className={`navbar-menu ${isMenuExpanded ? 'is-active' : ''}`}>
            <div className="navbar-start">
              <NavbarLink to="/" exact>Home</NavbarLink>
              {protectedComponent(
                <NavbarLink to="/submit" exact>
                  Submit
                </NavbarLink>
              )}
            </div>
            <div className="navbar-end">
              <AuthConsumer>
                {({ check, logout }) => (check() ?
                  <a className="navbar-item" onClick={() => logout()}>
                    Logout
                  </a> :
                  <NavbarLink to="/login">Login</NavbarLink>
                )}
              </AuthConsumer>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
