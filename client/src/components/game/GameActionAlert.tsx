import { useContext, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { ActionStepAlertMessages } from '../../constants/action-step-alert-messages';
import { AppContext } from '../../contexts/AppContext';
import ActionStatus from '../../models/ActionStatus';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const AlertBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: linear-gradient(
    145deg,
    rgba(5, 8, 20, 0.92) 0%,
    rgba(12, 18, 38, 0.88) 100%
  );
  border: 1px solid rgba(180, 140, 30, 0.55);
  border-radius: 6px;
  backdrop-filter: blur(14px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 4px 24px rgba(0, 0, 0, 0.6),
    0 0 12px rgba(180, 140, 30, 0.08);
  margin-bottom: 4px;
  animation: ${fadeIn} 0.2s ease;
`;

const AlertMessage = styled.span`
  flex: 1;
  min-width: 0;
  color: #d4bc7a;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const CancelButton = styled.button`
  flex-shrink: 0;
  background: rgba(180, 140, 30, 0.08);
  border: 1px solid rgba(180, 140, 30, 0.5);
  border-radius: 4px;
  color: #d4bc7a;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 4px 12px;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s,
    box-shadow 0.2s;

  &:hover {
    background: rgba(180, 140, 30, 0.2);
    border-color: rgba(220, 170, 40, 0.85);
    color: #f2c84b;
    box-shadow: 0 0 10px rgba(180, 140, 30, 0.35);
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
    <AlertBar>
      <AlertMessage>
        {actionStatus.step !== null &&
          ActionStepAlertMessages[actionStatus.step]}
      </AlertMessage>
      <CancelButton onClick={handleClick}>キャンセル</CancelButton>
    </AlertBar>
  );
}
