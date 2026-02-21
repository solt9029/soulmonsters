import { useContext } from 'react';
import { Alert } from 'reactstrap';
import styled from 'styled-components';
import {
  useGameQuery,
  ActionType,
} from '../../graphql/generated/graphql-client';
import GameUser from './GameUser';
import { AppContext } from '../../contexts/AppContext';
import { GameActionAlert } from './GameActionAlert';
import GameBoard3D from './three/GameBoard3D';

const AlertsOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  padding: 8px;
`;

const InteractiveOverlay = styled.div`
  pointer-events: auto;
`;

const PlayerInfoTop = styled.div`
  pointer-events: auto;
  position: absolute;
  top: 8px;
  left: 0;
  width: 100%;
  z-index: 10;
`;

const PlayerInfoBottom = styled.div`
  pointer-events: auto;
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  z-index: 10;
`;

const StyledAlert = styled(Alert)`
  padding: 6px 12px;
  margin-bottom: 4px;
`;

const LoadingText = styled.div`
  color: white;
  padding: 12px;
`;

export type GameCardAreaProps = {
  gameId: number;
};

export default function GameCardArea({ gameId }: GameCardAreaProps) {
  const {
    state: { actionStatus, dispatchGameActionError },
  } = useContext(AppContext);

  const { data, error, loading } = useGameQuery({
    variables: { id: gameId },
  });

  if (error) {
    return (
      <LoadingText>
        <Alert color="danger">ゲーム情報の取得中にエラーが発生しました</Alert>
      </LoadingText>
    );
  }

  if (loading) {
    return <LoadingText>ゲーム情報をロード中です</LoadingText>;
  }

  const gameCards = data?.game.gameCards;
  const gameUsers = data?.game.gameUsers;

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
            <StyledAlert color="primary">
              モルグゾーンからバトルゾーンに特殊召喚するモンスターを選択してください
            </StyledAlert>
          )}
          {hasHedronTargetSelection && (
            <StyledAlert color="primary">
              モルグゾーンからバトルゾーンに特殊召喚する紫モンスターを選択してください
            </StyledAlert>
          )}
          {dispatchGameActionError !== null && (
            <StyledAlert color="danger">
              {dispatchGameActionError.message}
            </StyledAlert>
          )}
        </InteractiveOverlay>
      </AlertsOverlay>

      <PlayerInfoTop>
        <GameUser gameUsers={gameUsers} isYours={false} />
      </PlayerInfoTop>

      <PlayerInfoBottom>
        <GameUser gameUsers={gameUsers} isYours={true} />
      </PlayerInfoBottom>
    </div>
  );
}
