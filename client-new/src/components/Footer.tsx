import React from 'react';
import styled from 'styled-components';
import { Container } from 'reactstrap';

const StyledContainer = styled(Container)`
  padding: 10px;
  background: linear-gradient(
    45deg,
    rgba(100, 100, 120, 0.9),
    rgba(100, 100, 110, 0.8)
  );
  color: #fff;
  margin-top: 50px;
  text-align: center;
`;

export default function Footer() {
  return (
    <StyledContainer fluid>
      <small>Copyright © Kenshi Shiode. All Rights Reserved.</small>
    </StyledContainer>
  );
}
