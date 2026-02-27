import { useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  ActionType,
  type GameCardFragment,
  type GameUserFragment,
} from '../../graphql/generated/graphql-client';
import GameUser from './GameUser';
import { AppContext } from '../../contexts/AppContext';
import { GameActionAlert } from './GameActionAlert';
import GameBoard3D from './three/GameBoard3D';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const AlertsOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  padding: 12px 36px;
`;

const InteractiveOverlay = styled.div`
  pointer-events: auto;
`;

const PlayerInfoTopRight = styled.div`
  pointer-events: auto;
  position: absolute;
  top: 68px;
  right: 36px;
  z-index: 10;
`;

const PlayerInfoBottomLeft = styled.div`
  pointer-events: auto;
  position: absolute;
  bottom: 68px;
  left: 36px;
  z-index: 10;
`;

const GameAlert = styled.div<{ variant?: 'primary' | 'danger' }>`
  padding: 8px 14px;
  margin-bottom: 4px;
  background: linear-gradient(
    145deg,
    rgba(5, 8, 20, 0.92) 0%,
    rgba(12, 18, 38, 0.88) 100%
  );
  border: 1px solid
    ${({ variant }) =>
      variant === 'danger'
        ? 'rgba(200, 40, 40, 0.65)'
        : 'rgba(180, 140, 30, 0.55)'};
  border-radius: 6px;
  backdrop-filter: blur(14px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 4px 24px rgba(0, 0, 0, 0.6),
    ${({ variant }) =>
      variant === 'danger'
        ? '0 0 12px rgba(200, 40, 40, 0.1)'
        : '0 0 12px rgba(180, 140, 30, 0.08)'};
  color: ${({ variant }) => (variant === 'danger' ? '#e87070' : '#d4bc7a')};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
  animation: ${fadeIn} 0.2s ease;
`;

export type GameAreaProps = {
  gameId: number;
  gameCards: GameCardFragment[] | undefined;
  gameUsers: GameUserFragment[] | undefined;
};

export default function GameArea({
  gameId,
  gameCards,
  gameUsers,
}: GameAreaProps) {
  const {
    state: { actionStatus, dispatchGameActionError },
  } = useContext(AppContext);

  const hasHamontakiTargetSelection = gameCards?.some((gc) =>
    gc.actionTypes.includes(ActionType.SelectAsHamontakiTarget)
  );

  const hasHedronTargetSelection = gameCards?.some((gc) =>
    gc.actionTypes.includes(ActionType.SelectAsHedronTarget)
  );

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#111',
      }}
    >
      <GameBoard3D gameId={gameId} gameCards={gameCards} />

      <AlertsOverlay>
        <InteractiveOverlay>
          {actionStatus.isStarted() && !actionStatus.isCompleted() && (
            <GameActionAlert />
          )}
          {hasHamontakiTargetSelection && (
            <GameAlert>
              モルグゾーンからバトルゾーンに置くモンスターを選択してください
            </GameAlert>
          )}
          {hasHedronTargetSelection && (
            <GameAlert>
              モルグゾーンからバトルゾーンに置くモンスターを選択してください
            </GameAlert>
          )}
          {dispatchGameActionError !== null && (
            <GameAlert variant="danger">
              {dispatchGameActionError.message}
            </GameAlert>
          )}
        </InteractiveOverlay>
      </AlertsOverlay>

      <PlayerInfoTopRight>
        <GameUser gameUsers={gameUsers} isYours={false} />
      </PlayerInfoTopRight>

      <PlayerInfoBottomLeft>
        <GameUser gameUsers={gameUsers} isYours={true} />
      </PlayerInfoBottomLeft>
    </div>
  );
}
