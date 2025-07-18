import React from 'react';
import { Col } from 'reactstrap';
import { Container } from 'reactstrap';
import styled from 'styled-components';
import CardList from './CardList';
import { Row } from '../../styled/reactstrap';

const StyledContainer = styled(Container)`
  text-align: center;
`;

export default function Description() {
  return (
    <StyledContainer fluid>
      <Row marginTop={70}>
        <Col xs={12}>
          <h2>オンライン対戦カードゲーム</h2>
          <h2>『ソウルモンスターズ』</h2>
          <div>
            <p>
              ソウルとエナジーを溜めて、様々なカードを駆使して相手を倒すカードゲームです。
            </p>
          </div>
        </Col>
      </Row>
      <Row marginTop={70}>
        <CardList />
      </Row>
    </StyledContainer>
  );
}
