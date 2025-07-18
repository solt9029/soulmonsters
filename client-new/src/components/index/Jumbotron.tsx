import { useContext } from 'react';
import { Container, Button } from 'reactstrap';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { login } from '../../actions/user';

const StyledJumbotron = styled.div`
  background:
    linear-gradient(45deg, rgba(100, 100, 120, 0.9), rgba(100, 100, 110, 0.8)),
    url('/images/header.jpg') center no-repeat;
  background-size: cover;
  text-align: center;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 3.9em;
  margin-top: 50px;
  margin-bottom: 50px;
  font-weight: bold;
`;

const StyledButton = styled(Button)`
  width: 9.5em;
  margin: 15px;
`;

const ButtonText = styled.span`
  font-size: 0.9em;
  font-weight: 500;
  color: #fff;
`;

export default function Jumbotron() {
  const {
    state: { user },
    dispatch,
  } = useContext(AppContext);

  const handleLoginClick = async () => {
    await login(dispatch, { user });
  };

  return (
    <StyledJumbotron>
      <Container>
        <Title>ソウルモンスターズ</Title>
        {user.data === null ? (
          <StyledButton color="info" size="lg" onClick={handleLoginClick}>
            <ButtonText>Twitterログイン</ButtonText>
          </StyledButton>
        ) : (
          <StyledButton color="info" size="lg" tag={Link} to="/deck">
            <ButtonText>デッキ構築</ButtonText>
          </StyledButton>
        )}
        <StyledButton color="warning" size="lg" tag={Link} to="/rule">
          <ButtonText>ルール確認</ButtonText>
        </StyledButton>
      </Container>
    </StyledJumbotron>
  );
}
