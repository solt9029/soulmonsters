import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardImg } from 'reactstrap';
import styled from 'styled-components';
import { BACK_SIDE_CARD } from '../../constants/pictures';
import { AppContext } from '../../contexts/AppContext';
import {
  type GameCardFragment,
  BattlePosition,
} from '../../graphql/generated/graphql-client';
import { useGameCardClick } from '../../hooks/useGameCardClick';

const StyledCard = styled(Card)<{ $isDefence: boolean; $isSelected: boolean }>`
  min-width: 60px;
  width: 60px;
  margin: 5px;
  transform: ${(props) => (props.$isDefence ? 'rotate(-90deg)' : 'none')};
  border: ${(props) => (props.$isSelected ? '3px solid red' : 'none')};
`;

export type GameCardProps = {
  data: GameCardFragment;
};

export default function GameCard({ data }: GameCardProps) {
  const {
    state: { actionStatus },
  } = useContext(AppContext);

  const { id } = useParams<{ id: string }>();
  const gameId = parseInt(id);

  const { handleClick } = useGameCardClick(data, gameId);

  const isDefence = data.battlePosition === BattlePosition.Defence;

  const isSelected =
    actionStatus.payload.costGameCardIds?.includes(data.id) ||
    actionStatus.payload.targetGameCardIds?.includes(data.id) ||
    false;

  return (
    <StyledCard
      onClick={handleClick}
      $isDefence={isDefence}
      $isSelected={isSelected}
    >
      <CardImg src={data.card?.picture || BACK_SIDE_CARD} />
    </StyledCard>
  );
}
