import { useContext, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  ActionType,
  type GameCardFragment,
  type GameUserFragment,
} from '../../graphql/generated/graphql-client';
import GameUser from './GameUser';
import { AppContext } from '../../contexts/AppContext';
import {
  AttackAnimationContext,
  AttackAnimationProvider,
} from '../../contexts/AttackAnimationContext';
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

const ReloadButton = styled.button<{ $loading: boolean }>`
  pointer-events: auto;
  position: absolute;
  bottom: 24px;
  right: 36px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
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
  color: #d4bc7a;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: ${({ $loading }) => ($loading ? 'not-allowed' : 'pointer')};
  opacity: ${({ $loading }) => ($loading ? 0.6 : 1)};
  transition: opacity 0.15s ease;

  &:hover:not(:disabled) {
    opacity: 0.85;
  }

  svg {
    animation: ${({ $loading }) =>
      $loading ? 'spin 1s linear infinite' : 'none'};
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ScreenFlash = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 160, 40, 0.75) 0%,
    rgba(255, 80, 10, 0.5) 40%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 50;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity ${({ $active }) => ($active ? '0.04s' : '0.35s')} ease;
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
  onRefetch: () => Promise<unknown>;
};

function GameAreaContent({
  gameId,
  gameCards,
  gameUsers,
  onRefetch,
}: GameAreaProps) {
  const {
    state: { actionStatus, dispatchGameActionError },
  } = useContext(AppContext);
  const { isFlashing } = useContext(AttackAnimationContext);
  const [refetching, setRefetching] = useState(false);

  const handleRefetch = async () => {
    setRefetching(true);
    await onRefetch();
    setRefetching(false);
  };

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
      <ScreenFlash $active={isFlashing} />
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

      <ReloadButton
        $loading={refetching}
        disabled={refetching}
        onClick={handleRefetch}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 16H3v5" />
        </svg>
        再読み込み
      </ReloadButton>
    </div>
  );
}

export default function GameArea(props: GameAreaProps) {
  return (
    <AttackAnimationProvider>
      <GameAreaContent {...props} />
    </AttackAnimationProvider>
  );
}
