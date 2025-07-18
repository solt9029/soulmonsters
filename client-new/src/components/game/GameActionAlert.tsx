import React, { useContext, useCallback } from 'react';
import styled from 'styled-components';
import { Alert, Button } from 'reactstrap';
import { ActionStepAlertMessages } from '../../constants/action-step-alert-messages';
import { AppContext } from '../App';
import { Col } from '../../styled/reactstrap';
import ActionStatus from '../../models/ActionStatus';

const StyledAlert = styled(Alert)`
  padding: 6px 12px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  & + & {
    margin-left: 10px;
  }
`;

export function GameActionAlert() {
  const {
    state: { actionStatus },
    dispatch,
  } = useContext(AppContext);

  const handleClick = useCallback(() => {
    dispatch({
      type: 'SET_ACTION_STATUS',
      payload: new ActionStatus(),
    });
  }, [dispatch]);

  return (
    <>
      <Col md={10}>
        <StyledAlert color="primary">
          {actionStatus.step !== null &&
            ActionStepAlertMessages[actionStatus.step]}
        </StyledAlert>
      </Col>
      <Col md={2}>
        <StyledButton onClick={handleClick} color="light">
          キャンセル
        </StyledButton>
      </Col>
    </>
  );
}
