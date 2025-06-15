import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export enum ActionType {
  StartDrawTime = 'START_DRAW_TIME',
  StartEnergyTime = 'START_ENERGY_TIME',
  StartPutTime = 'START_PUT_TIME',
  StartSomethingTime = 'START_SOMETHING_TIME',
  StartBattleTime = 'START_BATTLE_TIME',
  StartEndTime = 'START_END_TIME',
  FinishEndTime = 'FINISH_END_TIME',
  PutSoul = 'PUT_SOUL',
  ChangeBattlePosition = 'CHANGE_BATTLE_POSITION',
  UseSoulCanon = 'USE_SOUL_CANON',
  SummonMonster = 'SUMMON_MONSTER',
  Attack = 'ATTACK',
  UseSoulBarrier = 'USE_SOUL_BARRIER'
}

export type Card = Node & {
   __typename?: 'Card';
  id: Scalars['Int'];
  name: Scalars['String'];
  kind: Kind;
  type: Type;
  attribute?: Maybe<Attribute>;
  attack?: Maybe<Scalars['Int']>;
  defence?: Maybe<Scalars['Int']>;
  cost?: Maybe<Scalars['Int']>;
  detail?: Maybe<Scalars['String']>;
  picture: Scalars['String'];
};

export enum Kind {
  Monster = 'MONSTER',
  CircleMonster = 'CIRCLE_MONSTER',
  Quick = 'QUICK',
  Block = 'BLOCK'
}

export enum Attribute {
  Red = 'RED',
  Blue = 'BLUE',
  White = 'WHITE',
  Green = 'GREEN',
  Purple = 'PURPLE',
  Black = 'BLACK'
}

export enum Type {
  Circle = 'CIRCLE',
  Triangle = 'TRIANGLE',
  Rectangle = 'RECTANGLE',
  WhiteStar = 'WHITE_STAR',
  BlackSta = 'BLACK_STA'
}

export type Query = {
   __typename?: 'Query';
  activeGameId?: Maybe<Scalars['Int']>;
  cards: Array<Card>;
  deckCards: Array<DeckCard>;
  decks: Array<Deck>;
  game: Game;
  userData: UserData;
};


export type QueryDeckCardsArgs = {
  deckId: Scalars['Int'];
};


export type QueryGameArgs = {
  id: Scalars['Int'];
};


export type QueryUserDataArgs = {
  userId: Scalars['String'];
};

export type Node = {
  id: Scalars['Int'];
};


export type DeckCard = Node & {
   __typename?: 'DeckCard';
  id: Scalars['Int'];
  count: Scalars['Int'];
  deck: Deck;
  card: Card;
};

export type DeckCardUpdateInput = {
  deckId: Scalars['Int'];
  cardId: Scalars['Int'];
};

export type Mutation = {
   __typename?: 'Mutation';
  createDeck: Deck;
  dispatchGameAction: Game;
  minusDeckCard: DeckCard;
  plusDeckCard: DeckCard;
  startGame: Game;
};


export type MutationCreateDeckArgs = {
  data: DeckCreateInput;
};


export type MutationDispatchGameActionArgs = {
  id: Scalars['Int'];
  data: GameActionDispatchInput;
};


export type MutationMinusDeckCardArgs = {
  data: DeckCardUpdateInput;
};


export type MutationPlusDeckCardArgs = {
  data: DeckCardUpdateInput;
};


export type MutationStartGameArgs = {
  deckId: Scalars['Int'];
};

export type Deck = Node & {
   __typename?: 'Deck';
  id: Scalars['Int'];
  userId: Scalars['String'];
  name: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type DeckCreateInput = {
  name: Scalars['String'];
};

export type GameCard = Node & {
   __typename?: 'GameCard';
  id: Scalars['Int'];
  originalUserId: Scalars['String'];
  currentUserId: Scalars['String'];
  zone: Zone;
  position: Scalars['Int'];
  battlePosition?: Maybe<BattlePosition>;
  name?: Maybe<Scalars['String']>;
  kind?: Maybe<Kind>;
  type?: Maybe<Type>;
  attribute?: Maybe<Attribute>;
  attack?: Maybe<Scalars['Int']>;
  defence?: Maybe<Scalars['Int']>;
  cost?: Maybe<Scalars['Int']>;
  detail?: Maybe<Scalars['String']>;
  card?: Maybe<Card>;
  actionTypes: Array<ActionType>;
};

export enum Zone {
  Battle = 'BATTLE',
  Deck = 'DECK',
  Soul = 'SOUL',
  Morgue = 'MORGUE',
  Hand = 'HAND'
}

export enum BattlePosition {
  Attack = 'ATTACK',
  Defence = 'DEFENCE'
}

export enum Phase {
  Draw = 'DRAW',
  Energy = 'ENERGY',
  Put = 'PUT',
  Something = 'SOMETHING',
  Battle = 'BATTLE',
  End = 'END'
}

export type Game = Node & {
   __typename?: 'Game';
  id: Scalars['Int'];
  turnUserId?: Maybe<Scalars['String']>;
  phase?: Maybe<Phase>;
  winnerUserId?: Maybe<Scalars['String']>;
  startedAt?: Maybe<Scalars['DateTime']>;
  endedAt?: Maybe<Scalars['DateTime']>;
  gameUsers: Array<GameUser>;
  gameCards: Array<GameCard>;
};

export type ActionPayload = {
  gameCardId?: Maybe<Scalars['Int']>;
  targetGameCardIds?: Maybe<Array<Scalars['Int']>>;
  costGameCardIds?: Maybe<Array<Scalars['Int']>>;
  targetGameUserIds?: Maybe<Array<Scalars['Int']>>;
};

export type GameActionDispatchInput = {
  type: ActionType;
  payload: ActionPayload;
};

export type GameUser = Node & {
   __typename?: 'GameUser';
  id: Scalars['Int'];
  userId: Scalars['String'];
  user: User;
  energy?: Maybe<Scalars['Int']>;
  lifePoint: Scalars['Int'];
  lastViewedAt?: Maybe<Scalars['DateTime']>;
  deck: Deck;
  game: Game;
  actionTypes: Array<ActionType>;
};

export enum StateType {
  AttackCount = 'ATTACK_COUNT',
  PutSoulCount = 'PUT_SOUL_COUNT',
  SelfPowerChange = 'SELF_POWER_CHANGE'
}

export type UserData = Node & {
   __typename?: 'UserData';
  id: Scalars['Int'];
  userId: Scalars['String'];
  winningCount: Scalars['Int'];
  losingCount: Scalars['Int'];
};

export type User = {
   __typename?: 'User';
  id: Scalars['ID'];
  displayName?: Maybe<Scalars['String']>;
  photoURL?: Maybe<Scalars['String']>;
};

export type CardsQueryVariables = {};


export type CardsQuery = (
  { __typename?: 'Query' }
  & { cards: Array<(
    { __typename?: 'Card' }
    & CardFragment
  )> }
);

export type CardFragment = (
  { __typename?: 'Card' }
  & Pick<Card, 'id' | 'name' | 'kind' | 'attribute' | 'type' | 'attack' | 'defence' | 'cost' | 'detail' | 'picture'>
);

export type DeckCardsQueryVariables = {
  deckId: Scalars['Int'];
};


export type DeckCardsQuery = (
  { __typename?: 'Query' }
  & { deckCards: Array<(
    { __typename?: 'DeckCard' }
    & Pick<DeckCard, 'id' | 'count'>
    & { card: (
      { __typename?: 'Card' }
      & CardFragment
    ) }
  )> }
);

export type PlusDeckCardMutationVariables = {
  deckId: Scalars['Int'];
  cardId: Scalars['Int'];
};


export type PlusDeckCardMutation = (
  { __typename?: 'Mutation' }
  & { plusDeckCard: (
    { __typename?: 'DeckCard' }
    & Pick<DeckCard, 'id' | 'count'>
  ) }
);

export type MinusDeckCardMutationVariables = {
  deckId: Scalars['Int'];
  cardId: Scalars['Int'];
};


export type MinusDeckCardMutation = (
  { __typename?: 'Mutation' }
  & { minusDeckCard: (
    { __typename?: 'DeckCard' }
    & Pick<DeckCard, 'id' | 'count'>
  ) }
);

export type DecksQueryVariables = {};


export type DecksQuery = (
  { __typename?: 'Query' }
  & { decks: Array<(
    { __typename?: 'Deck' }
    & Pick<Deck, 'id' | 'name'>
  )> }
);

export type CreateDeckMutationVariables = {
  name: Scalars['String'];
};


export type CreateDeckMutation = (
  { __typename?: 'Mutation' }
  & { createDeck: (
    { __typename?: 'Deck' }
    & Pick<Deck, 'id' | 'name'>
  ) }
);

export type ActiveGameIdQueryVariables = {};


export type ActiveGameIdQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'activeGameId'>
);

export type GameQueryVariables = {
  id: Scalars['Int'];
};


export type GameQuery = (
  { __typename?: 'Query' }
  & { game: (
    { __typename?: 'Game' }
    & Pick<Game, 'id' | 'turnUserId' | 'phase' | 'winnerUserId' | 'startedAt' | 'endedAt'>
    & { gameUsers: Array<(
      { __typename?: 'GameUser' }
      & GameUserFragment
    )>, gameCards: Array<(
      { __typename?: 'GameCard' }
      & GameCardFragment
    )> }
  ) }
);

export type StartGameMutationVariables = {
  deckId: Scalars['Int'];
};


export type StartGameMutation = (
  { __typename?: 'Mutation' }
  & { startGame: (
    { __typename?: 'Game' }
    & Pick<Game, 'id'>
  ) }
);

export type DispatchGameActionMutationVariables = {
  id: Scalars['Int'];
  data: GameActionDispatchInput;
};


export type DispatchGameActionMutation = (
  { __typename?: 'Mutation' }
  & { dispatchGameAction: (
    { __typename?: 'Game' }
    & Pick<Game, 'id'>
  ) }
);

export type GameCardFragment = (
  { __typename?: 'GameCard' }
  & Pick<GameCard, 'id' | 'originalUserId' | 'currentUserId' | 'zone' | 'position' | 'battlePosition' | 'name' | 'kind' | 'type' | 'attribute' | 'attack' | 'defence' | 'cost' | 'detail' | 'actionTypes'>
  & { card?: Maybe<(
    { __typename?: 'Card' }
    & Pick<Card, 'id' | 'picture'>
  )> }
);

export type GameUserFragment = (
  { __typename?: 'GameUser' }
  & Pick<GameUser, 'id' | 'userId' | 'energy' | 'lifePoint' | 'lastViewedAt' | 'actionTypes'>
  & { user: (
    { __typename?: 'User' }
    & Pick<User, 'displayName' | 'photoURL'>
  ) }
);

export const CardFragmentDoc = gql`
    fragment Card on Card {
  id
  name
  kind
  attribute
  type
  attack
  defence
  cost
  detail
  picture
}
    `;
export const GameCardFragmentDoc = gql`
    fragment GameCard on GameCard {
  id
  originalUserId
  currentUserId
  zone
  position
  battlePosition
  name
  kind
  type
  attribute
  attack
  defence
  cost
  detail
  actionTypes
  card {
    id
    picture
  }
}
    `;
export const GameUserFragmentDoc = gql`
    fragment GameUser on GameUser {
  id
  userId
  user {
    displayName
    photoURL
  }
  energy
  lifePoint
  lastViewedAt
  actionTypes
}
    `;
export const CardsDocument = gql`
    query cards {
  cards {
    ...Card
  }
}
    ${CardFragmentDoc}`;

/**
 * __useCardsQuery__
 *
 * To run a query within a React component, call `useCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCardsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CardsQuery, CardsQueryVariables>) {
        return ApolloReactHooks.useQuery<CardsQuery, CardsQueryVariables>(CardsDocument, baseOptions);
      }
export function useCardsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CardsQuery, CardsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CardsQuery, CardsQueryVariables>(CardsDocument, baseOptions);
        }
export type CardsQueryHookResult = ReturnType<typeof useCardsQuery>;
export type CardsLazyQueryHookResult = ReturnType<typeof useCardsLazyQuery>;
export type CardsQueryResult = ApolloReactCommon.QueryResult<CardsQuery, CardsQueryVariables>;
export const DeckCardsDocument = gql`
    query deckCards($deckId: Int!) {
  deckCards(deckId: $deckId) {
    id
    count
    card {
      ...Card
    }
  }
}
    ${CardFragmentDoc}`;

/**
 * __useDeckCardsQuery__
 *
 * To run a query within a React component, call `useDeckCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDeckCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDeckCardsQuery({
 *   variables: {
 *      deckId: // value for 'deckId'
 *   },
 * });
 */
export function useDeckCardsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<DeckCardsQuery, DeckCardsQueryVariables>) {
        return ApolloReactHooks.useQuery<DeckCardsQuery, DeckCardsQueryVariables>(DeckCardsDocument, baseOptions);
      }
export function useDeckCardsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DeckCardsQuery, DeckCardsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<DeckCardsQuery, DeckCardsQueryVariables>(DeckCardsDocument, baseOptions);
        }
export type DeckCardsQueryHookResult = ReturnType<typeof useDeckCardsQuery>;
export type DeckCardsLazyQueryHookResult = ReturnType<typeof useDeckCardsLazyQuery>;
export type DeckCardsQueryResult = ApolloReactCommon.QueryResult<DeckCardsQuery, DeckCardsQueryVariables>;
export const PlusDeckCardDocument = gql`
    mutation plusDeckCard($deckId: Int!, $cardId: Int!) {
  plusDeckCard(data: {deckId: $deckId, cardId: $cardId}) {
    id
    count
  }
}
    `;
export type PlusDeckCardMutationFn = ApolloReactCommon.MutationFunction<PlusDeckCardMutation, PlusDeckCardMutationVariables>;

/**
 * __usePlusDeckCardMutation__
 *
 * To run a mutation, you first call `usePlusDeckCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlusDeckCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [plusDeckCardMutation, { data, loading, error }] = usePlusDeckCardMutation({
 *   variables: {
 *      deckId: // value for 'deckId'
 *      cardId: // value for 'cardId'
 *   },
 * });
 */
export function usePlusDeckCardMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PlusDeckCardMutation, PlusDeckCardMutationVariables>) {
        return ApolloReactHooks.useMutation<PlusDeckCardMutation, PlusDeckCardMutationVariables>(PlusDeckCardDocument, baseOptions);
      }
export type PlusDeckCardMutationHookResult = ReturnType<typeof usePlusDeckCardMutation>;
export type PlusDeckCardMutationResult = ApolloReactCommon.MutationResult<PlusDeckCardMutation>;
export type PlusDeckCardMutationOptions = ApolloReactCommon.BaseMutationOptions<PlusDeckCardMutation, PlusDeckCardMutationVariables>;
export const MinusDeckCardDocument = gql`
    mutation minusDeckCard($deckId: Int!, $cardId: Int!) {
  minusDeckCard(data: {deckId: $deckId, cardId: $cardId}) {
    id
    count
  }
}
    `;
export type MinusDeckCardMutationFn = ApolloReactCommon.MutationFunction<MinusDeckCardMutation, MinusDeckCardMutationVariables>;

/**
 * __useMinusDeckCardMutation__
 *
 * To run a mutation, you first call `useMinusDeckCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMinusDeckCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [minusDeckCardMutation, { data, loading, error }] = useMinusDeckCardMutation({
 *   variables: {
 *      deckId: // value for 'deckId'
 *      cardId: // value for 'cardId'
 *   },
 * });
 */
export function useMinusDeckCardMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<MinusDeckCardMutation, MinusDeckCardMutationVariables>) {
        return ApolloReactHooks.useMutation<MinusDeckCardMutation, MinusDeckCardMutationVariables>(MinusDeckCardDocument, baseOptions);
      }
export type MinusDeckCardMutationHookResult = ReturnType<typeof useMinusDeckCardMutation>;
export type MinusDeckCardMutationResult = ApolloReactCommon.MutationResult<MinusDeckCardMutation>;
export type MinusDeckCardMutationOptions = ApolloReactCommon.BaseMutationOptions<MinusDeckCardMutation, MinusDeckCardMutationVariables>;
export const DecksDocument = gql`
    query decks {
  decks {
    id
    name
  }
}
    `;

/**
 * __useDecksQuery__
 *
 * To run a query within a React component, call `useDecksQuery` and pass it any options that fit your needs.
 * When your component renders, `useDecksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDecksQuery({
 *   variables: {
 *   },
 * });
 */
export function useDecksQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<DecksQuery, DecksQueryVariables>) {
        return ApolloReactHooks.useQuery<DecksQuery, DecksQueryVariables>(DecksDocument, baseOptions);
      }
export function useDecksLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DecksQuery, DecksQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<DecksQuery, DecksQueryVariables>(DecksDocument, baseOptions);
        }
export type DecksQueryHookResult = ReturnType<typeof useDecksQuery>;
export type DecksLazyQueryHookResult = ReturnType<typeof useDecksLazyQuery>;
export type DecksQueryResult = ApolloReactCommon.QueryResult<DecksQuery, DecksQueryVariables>;
export const CreateDeckDocument = gql`
    mutation createDeck($name: String!) {
  createDeck(data: {name: $name}) {
    id
    name
  }
}
    `;
export type CreateDeckMutationFn = ApolloReactCommon.MutationFunction<CreateDeckMutation, CreateDeckMutationVariables>;

/**
 * __useCreateDeckMutation__
 *
 * To run a mutation, you first call `useCreateDeckMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDeckMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDeckMutation, { data, loading, error }] = useCreateDeckMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateDeckMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateDeckMutation, CreateDeckMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateDeckMutation, CreateDeckMutationVariables>(CreateDeckDocument, baseOptions);
      }
export type CreateDeckMutationHookResult = ReturnType<typeof useCreateDeckMutation>;
export type CreateDeckMutationResult = ApolloReactCommon.MutationResult<CreateDeckMutation>;
export type CreateDeckMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateDeckMutation, CreateDeckMutationVariables>;
export const ActiveGameIdDocument = gql`
    query activeGameId {
  activeGameId
}
    `;

/**
 * __useActiveGameIdQuery__
 *
 * To run a query within a React component, call `useActiveGameIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useActiveGameIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActiveGameIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useActiveGameIdQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ActiveGameIdQuery, ActiveGameIdQueryVariables>) {
        return ApolloReactHooks.useQuery<ActiveGameIdQuery, ActiveGameIdQueryVariables>(ActiveGameIdDocument, baseOptions);
      }
export function useActiveGameIdLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ActiveGameIdQuery, ActiveGameIdQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ActiveGameIdQuery, ActiveGameIdQueryVariables>(ActiveGameIdDocument, baseOptions);
        }
export type ActiveGameIdQueryHookResult = ReturnType<typeof useActiveGameIdQuery>;
export type ActiveGameIdLazyQueryHookResult = ReturnType<typeof useActiveGameIdLazyQuery>;
export type ActiveGameIdQueryResult = ApolloReactCommon.QueryResult<ActiveGameIdQuery, ActiveGameIdQueryVariables>;
export const GameDocument = gql`
    query game($id: Int!) {
  game(id: $id) {
    id
    turnUserId
    phase
    winnerUserId
    startedAt
    endedAt
    gameUsers {
      ...GameUser
    }
    gameCards {
      ...GameCard
    }
  }
}
    ${GameUserFragmentDoc}
${GameCardFragmentDoc}`;

/**
 * __useGameQuery__
 *
 * To run a query within a React component, call `useGameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGameQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGameQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GameQuery, GameQueryVariables>) {
        return ApolloReactHooks.useQuery<GameQuery, GameQueryVariables>(GameDocument, baseOptions);
      }
export function useGameLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GameQuery, GameQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GameQuery, GameQueryVariables>(GameDocument, baseOptions);
        }
export type GameQueryHookResult = ReturnType<typeof useGameQuery>;
export type GameLazyQueryHookResult = ReturnType<typeof useGameLazyQuery>;
export type GameQueryResult = ApolloReactCommon.QueryResult<GameQuery, GameQueryVariables>;
export const StartGameDocument = gql`
    mutation startGame($deckId: Int!) {
  startGame(deckId: $deckId) {
    id
  }
}
    `;
export type StartGameMutationFn = ApolloReactCommon.MutationFunction<StartGameMutation, StartGameMutationVariables>;

/**
 * __useStartGameMutation__
 *
 * To run a mutation, you first call `useStartGameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartGameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startGameMutation, { data, loading, error }] = useStartGameMutation({
 *   variables: {
 *      deckId: // value for 'deckId'
 *   },
 * });
 */
export function useStartGameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<StartGameMutation, StartGameMutationVariables>) {
        return ApolloReactHooks.useMutation<StartGameMutation, StartGameMutationVariables>(StartGameDocument, baseOptions);
      }
export type StartGameMutationHookResult = ReturnType<typeof useStartGameMutation>;
export type StartGameMutationResult = ApolloReactCommon.MutationResult<StartGameMutation>;
export type StartGameMutationOptions = ApolloReactCommon.BaseMutationOptions<StartGameMutation, StartGameMutationVariables>;
export const DispatchGameActionDocument = gql`
    mutation dispatchGameAction($id: Int!, $data: GameActionDispatchInput!) {
  dispatchGameAction(id: $id, data: $data) {
    id
  }
}
    `;
export type DispatchGameActionMutationFn = ApolloReactCommon.MutationFunction<DispatchGameActionMutation, DispatchGameActionMutationVariables>;

/**
 * __useDispatchGameActionMutation__
 *
 * To run a mutation, you first call `useDispatchGameActionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDispatchGameActionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dispatchGameActionMutation, { data, loading, error }] = useDispatchGameActionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDispatchGameActionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DispatchGameActionMutation, DispatchGameActionMutationVariables>) {
        return ApolloReactHooks.useMutation<DispatchGameActionMutation, DispatchGameActionMutationVariables>(DispatchGameActionDocument, baseOptions);
      }
export type DispatchGameActionMutationHookResult = ReturnType<typeof useDispatchGameActionMutation>;
export type DispatchGameActionMutationResult = ApolloReactCommon.MutationResult<DispatchGameActionMutation>;
export type DispatchGameActionMutationOptions = ApolloReactCommon.BaseMutationOptions<DispatchGameActionMutation, DispatchGameActionMutationVariables>;