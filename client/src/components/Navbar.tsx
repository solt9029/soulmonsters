import { Fragment, useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { NavLink as RRDNavLink, useLocation } from 'react-router-dom';
import {
  Collapse,
  Navbar as RNavbar,
  NavbarToggler,
  Button,
  NavbarBrand,
  Nav,
  Container,
  NavLink as RNavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { login, logout } from '../actions/user';

const ServiceLogo = styled(NavbarBrand)`
  background: url('/images/icon.png') no-repeat left center;
  background-size: contain;
  border-radius: 50%;
  height: 45px;
  width: 45px;
`;

const UserLogo = styled(DropdownToggle)`
  ${(props) => `background: url('${props.picture}') no-repeat left center;`}
  background-size: contain;
  border-radius: 50%;
  border: none;
  &:focus {
    box-shadow: none;
  }
  &:hover {
    border-color: #eee;
  }
  height: 45px;
  width: 45px;
`;

const Brand = styled.span`
  font-size: 1em;
`;

const StyledNavLink = styled(RNavLink)`
  font-size: 1em;
`;

const StyledCollapse = styled(Collapse)`
  margin-top: 5px;
  margin-bottom: 5px;
`;

export default function Navbar() {
  const location = useLocation();
  const {
    state: { user },
    dispatch,
  } = useContext(AppContext);
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleCollapse = () => {
    setIsCollapseOpen(!isCollapseOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    setIsCollapseOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const handleLogoutClick = async () => {
    await logout(dispatch, { user });
  };

  const handleLoginClick = async () => {
    await login(dispatch, { user });
  };

  return (
    <RNavbar className="py-0" color="light" light expand="md">
      <Container>
        <ServiceLogo tag={Link} to="/" />
        <NavbarBrand tag={Link} to="/">
          <Brand>ソウルモンスターズ</Brand>
        </NavbarBrand>
        <NavbarToggler onClick={toggleCollapse} className="my-2" />
        <StyledCollapse isOpen={isCollapseOpen} navbar>
          <Nav className="mr-auto" navbar>
            {user?.data !== null && (
              <Fragment>
                <StyledNavLink tag={RRDNavLink} exact to="/deck">
                  デッキ構築
                </StyledNavLink>
                <StyledNavLink tag={RRDNavLink} exact to="/game">
                  ソウルバトル
                </StyledNavLink>
              </Fragment>
            )}

            <StyledNavLink tag={RRDNavLink} exact to="/rule">
              ルール
            </StyledNavLink>
            <StyledNavLink tag={RRDNavLink} exact to="/help">
              ヘルプ
            </StyledNavLink>
          </Nav>
          <Nav>
            {(() => {
              if (user?.data === null) {
                return (
                  <Button color="info" onClick={handleLoginClick}>
                    ログイン
                  </Button>
                );
              }
              return (
                <Dropdown isOpen={isDropdownOpen} toggle={toggleDropdown}>
                  <UserLogo picture={user?.data?.photoURL} />
                  <DropdownMenu>
                    <DropdownItem onClick={handleLogoutClick}>
                      ログアウト
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              );
            })()}
          </Nav>
        </StyledCollapse>
      </Container>
    </RNavbar>
  );
}
