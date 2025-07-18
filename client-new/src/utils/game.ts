import {
  Zone,
  type GameUser,
  type User as GraphQLUser,
  type GameCardFragment,
} from './../graphql/generated/graphql-client';
import UserModel from '../models/User';

type GameUsers = Array<
  { __typename?: 'GameUser' } & Pick<
    GameUser,
    'id' | 'userId' | 'energy' | 'lifePoint' | 'lastViewedAt' | 'actionTypes'
  > & {
      user: { __typename?: 'User' } & Pick<
        GraphQLUser,
        'displayName' | 'photoURL'
      >;
    }
>;

export const findGameUser = (
  gameUsers: GameUsers | undefined | null,
  user: UserModel,
  options: { isYours: boolean }
) => {
  return gameUsers?.find(
    (value) =>
      (options.isYours && value.userId === user.data?.uid) ||
      (!options.isYours && value.userId !== user.data?.uid)
  );
};

export const findGameCards = (
  gameCards: GameCardFragment[] | undefined | null,
  user: UserModel,
  options: { zone: Zone; isYours: boolean }
) => {
  if (!gameCards) {
    return [];
  }
  return gameCards
    .filter(
      (value) =>
        value.zone === options.zone &&
        ((options.isYours && value.currentUserId === user.data?.uid) ||
          (!options.isYours && value.currentUserId !== user.data?.uid))
    )
    .sort((a, b) => b.position - a.position);
};

export const findTopGameCard = (gameCards: GameCardFragment[]) => {
  return gameCards?.reduce<any>(
    (a, b) => (a?.position > b?.position ? a : b),
    null
  );
};
