import { useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  type GameUserFragment,
  useActiveGameIdQuery,
} from '../../graphql/generated/graphql-client';
import { AppContext } from '../../contexts/AppContext';
import { findGameUser } from '../../utils/game';
import GameActionButton from './GameActionButton';
import ActionStatus from '../../models/ActionStatus';
import { useDispatchGameActionMutation } from '../../hooks/useDispatchGameActionMutation';

const INITIAL_LIFE = 8000;
const MAX_ENERGY = 8;

const lpGlow = keyframes`
  0%, 100% { text-shadow: 0 0 8px rgba(240, 192, 64, 0.5), 0 0 20px rgba(240, 192, 64, 0.2); }
  50% { text-shadow: 0 0 12px rgba(240, 192, 64, 0.8), 0 0 30px rgba(240, 192, 64, 0.4); }
`;

const Panel = styled.div`
  background: linear-gradient(
    145deg,
    rgba(5, 8, 20, 0.92) 0%,
    rgba(12, 18, 38, 0.88) 100%
  );
  border: 1px solid rgba(180, 140, 30, 0.55);
  border-radius: 6px;
  backdrop-filter: blur(14px);
  padding: 10px 12px 10px;
  min-width: 200px;
  max-width: 240px;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.04) inset,
    0 4px 24px rgba(0, 0, 0, 0.6),
    0 0 16px rgba(180, 140, 30, 0.08);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(220, 170, 40, 0.6),
      transparent
    );
  }
`;

const PlayerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 9px;
`;

const Avatar = styled.div<{ $picture?: string | null }>`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ $picture }) =>
    $picture ? `url('${$picture}') no-repeat center / cover` : '#1a2040'};
  border: 1.5px solid rgba(180, 140, 30, 0.75);
  flex-shrink: 0;
  box-shadow: 0 0 8px rgba(180, 140, 30, 0.25);
  cursor: pointer;
`;

const PlayerName = styled.div`
  color: #d4bc7a;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(180, 140, 30, 0.35),
    transparent
  );
  margin-bottom: 9px;
`;

const LifeSection = styled.div`
  margin-bottom: 8px;
`;

const LifeHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const LifeLabel = styled.span`
  color: rgba(180, 140, 30, 0.65);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const LifeValue = styled.span`
  color: #f2c84b;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Courier New', 'Consolas', monospace;
  letter-spacing: 1px;
  animation: ${lpGlow} 3s ease-in-out infinite;
`;

const LifeBarTrack = styled.div`
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
`;

const LifeBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => Math.max(0, Math.min(100, $percent))}%;
  background: ${({ $percent }) => {
    if ($percent > 50) return 'linear-gradient(90deg, #1a9e52, #3ddb80)';
    if ($percent > 25) return 'linear-gradient(90deg, #c07820, #f0a830)';
    return 'linear-gradient(90deg, #aa1515, #e83030)';
  }};
  border-radius: 2px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 6px currentColor;
`;

const EnergySection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EnergyLabel = styled.span`
  color: rgba(90, 165, 220, 0.65);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  flex-shrink: 0;
`;

const Crystals = styled.div`
  display: flex;
  gap: 3px;
  align-items: center;
`;

const Crystal = styled.div<{ $active: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 1px;
  transform: rotate(45deg);
  background: ${({ $active }) =>
    $active ? '#5bc8ff' : 'rgba(91, 200, 255, 0.15)'};
  box-shadow: ${({ $active }) =>
    $active ? '0 0 5px rgba(91, 200, 255, 0.7)' : 'none'};
  transition:
    background 0.3s,
    box-shadow 0.3s;
`;

const EnergyCount = styled.span`
  color: #5bc8ff;
  font-size: 11px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  margin-left: 2px;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 9px;
  padding-top: 8px;
  border-top: 1px solid rgba(180, 140, 30, 0.2);
`;

export type GameUserProps = {
  gameUsers: GameUserFragment[] | undefined;
  isYours: boolean;
};

export default function GameUser({ gameUsers, isYours }: GameUserProps) {
  const {
    state: { user, actionStatus },
    dispatch,
  } = useContext(AppContext);

  const activeGameIdQueryResult = useActiveGameIdQuery();
  const activeGameId = activeGameIdQueryResult.data?.activeGameId || 1;

  const [dispatchGameAction] = useDispatchGameActionMutation(activeGameId);

  const gameUser = findGameUser(gameUsers, user, { isYours });

  const handleAvatarClick = async () => {
    if (!actionStatus.isStarted()) {
      return;
    }

    let newActionStatus = new ActionStatus();
    newActionStatus = actionStatus.addPayloadTargetGameUserId(gameUser!.id);

    if (newActionStatus.isCompleted()) {
      const { type, payload } = newActionStatus;
      await dispatchGameAction({
        variables: {
          id: activeGameId,
          data: { type: type!, payload },
        },
      });
      newActionStatus = new ActionStatus();
    }

    dispatch({
      type: 'SET_ACTION_STATUS',
      payload: newActionStatus,
    });
  };

  const lifePercent =
    ((gameUser?.lifePoint ?? INITIAL_LIFE) / INITIAL_LIFE) * 100;
  const energy = gameUser?.energy ?? 0;
  const hasActions = (gameUser?.actionTypes.length ?? 0) > 0;

  return (
    <Panel>
      <PlayerRow>
        <Avatar
          $picture={gameUser?.user.photoURL}
          onClick={handleAvatarClick}
        />
        <PlayerName>{gameUser?.user.displayName ?? '---'}</PlayerName>
      </PlayerRow>

      <Divider />

      <LifeSection>
        <LifeHeader>
          <LifeLabel>LP</LifeLabel>
          <LifeValue>
            {(gameUser?.lifePoint ?? INITIAL_LIFE).toLocaleString()}
          </LifeValue>
        </LifeHeader>
        <LifeBarTrack>
          <LifeBarFill $percent={lifePercent} />
        </LifeBarTrack>
      </LifeSection>

      <EnergySection>
        <EnergyLabel>NRG</EnergyLabel>
        <Crystals>
          {Array.from({ length: MAX_ENERGY }, (_, i) => (
            <Crystal key={i} $active={i < energy} />
          ))}
        </Crystals>
        <EnergyCount>
          {energy}/{MAX_ENERGY}
        </EnergyCount>
      </EnergySection>

      {hasActions && (
        <ActionButtons>
          {gameUser?.actionTypes.map((value) => (
            <GameActionButton key={value} type={value} />
          ))}
        </ActionButtons>
      )}
    </Panel>
  );
}
