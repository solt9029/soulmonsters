import { useContext } from 'react';
import { Card, CardImg } from 'reactstrap';
import styled from 'styled-components';
import { BACK_SIDE_CARD } from '../../constants/pictures';
import { AppContext } from '../App';
import { Zone, type GameCardFragment } from '../../graphql/generated/graphql-client';
import { findTopGameCard, findGameCards } from '../../utils/game';

const StyledCard = styled(Card)`
  min-width: 60px;
  width: 60px;
  margin: 5px;
`;

export type GameCardStackProps = {
  gameCards: GameCardFragment[] | undefined;
  zone: Zone;
  isYours: boolean;
};

export default function GameCardStack({
  gameCards,
  zone,
  isYours,
}: GameCardStackProps) {
  const {
    state: { gameCardListModal, user },
    dispatch,
  } = useContext(AppContext);

  const targetGameCards = findGameCards(gameCards, user, { isYours, zone });

  if (targetGameCards.length <= 0) {
    return <></>;
  }

  const topGameCard = findTopGameCard(targetGameCards);

  const handleClick = () => {
    dispatch({
      type: 'SET_GAME_CARD_LIST_MODAL',
      payload: gameCardListModal.open(targetGameCards),
    });
  };

  return (
    <StyledCard onClick={handleClick}>
      <CardImg src={topGameCard?.card?.picture || BACK_SIDE_CARD} />
    </StyledCard>
  );
}
