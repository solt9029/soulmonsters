import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Zone, GameCardFragment } from '../../graphql/generated/graphql-client';
import { findGameCards } from '../../utils/game';
import GameCard from './GameCard';

export type GameCardListProps = {
  gameCards: GameCardFragment[] | undefined;
  zone: Zone;
  isYours: boolean;
};

export default function GameCardList({
  gameCards,
  zone,
  isYours,
}: GameCardListProps) {
  const {
    state: { user },
  } = useContext(AppContext);

  return (
    <>
      {findGameCards(gameCards, user, {
        zone,
        isYours,
      }).map((value) => (
        <GameCard data={value} />
      ))}
    </>
  );
}
