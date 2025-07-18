import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type ActionPayload = {
  costGameCardIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  gameCardId?: InputMaybe<Scalars['Int']['input']>;
  targetGameCardIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  targetGameUserIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum ActionType {
  Attack = 'ATTACK',
  ChangeBattlePosition = 'CHANGE_BATTLE_POSITION',
  FinishEndTime = 'FINISH_END_TIME',
  PutSoul = 'PUT_SOUL',
  StartBattleTime = 'START_BATTLE_TIME',
  StartDrawTime = 'START_DRAW_TIME',
  StartEndTime = 'START_END_TIME',
  StartEnergyTime = 'START_ENERGY_TIME',
  StartPutTime = 'START_PUT_TIME',
  StartSomethingTime = 'START_SOMETHING_TIME',
  SummonMonster = 'SUMMON_MONSTER',
  UseSoulBarrier = 'USE_SOUL_BARRIER',
  UseSoulCanon = 'USE_SOUL_CANON'
}

export enum Attribute {
  Black = 'BLACK',
  Blue = 'BLUE',
  Green = 'GREEN',
  Purple = 'PURPLE',
  Red = 'RED',
  White = 'WHITE'
}

export enum BattlePosition {
  Attack = 'ATTACK',
  Defence = 'DEFENCE'
}

export type Card = Node & {
  __typename?: 'Card';
  attack?: Maybe<Scalars['Int']['output']>;
  attribute?: Maybe<Attribute>;
  cost?: Maybe<Scalars['Int']['output']>;
  defence?: Maybe<Scalars['Int']['output']>;
  detail?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  kind: Kind;
  name: Scalars['String']['output'];
  picture: Scalars['String']['output'];
  type: Type;
};

export type Deck = Node & {
  __typename?: 'Deck';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type DeckCard = Node & {
  __typename?: 'DeckCard';
  card: Card;
  count: Scalars['Int']['output'];
  deck: Deck;
  id: Scalars['Int']['output'];
};

export type DeckCardUpdateInput = {
  cardId: Scalars['Int']['input'];
  deckId: Scalars['Int']['input'];
};

export type DeckCreateInput = {
  name: Scalars['String']['input'];
};

export type Game = Node & {
  __typename?: 'Game';
  endedAt?: Maybe<Scalars['DateTime']['output']>;
  gameCards: Array<GameCard>;
  gameUsers: Array<GameUser>;
  id: Scalars['Int']['output'];
  phase?: Maybe<Phase>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  turnUserId?: Maybe<Scalars['String']['output']>;
  winnerUserId?: Maybe<Scalars['String']['output']>;
};

export type GameActionDispatchInput = {
  payload: ActionPayload;
  type: ActionType;
};

export type GameCard = Node & {
  __typename?: 'GameCard';
  actionTypes: Array<ActionType>;
  attack?: Maybe<Scalars['Int']['output']>;
  attribute?: Maybe<Attribute>;
  battlePosition?: Maybe<BattlePosition>;
  card?: Maybe<Card>;
  cost?: Maybe<Scalars['Int']['output']>;
  currentUserId: Scalars['String']['output'];
  defence?: Maybe<Scalars['Int']['output']>;
  detail?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  kind?: Maybe<Kind>;
  name?: Maybe<Scalars['String']['output']>;
  originalUserId: Scalars['String']['output'];
  position: Scalars['Int']['output'];
  type?: Maybe<Type>;
  zone: Zone;
};

export type GameUser = Node & {
  __typename?: 'GameUser';
  actionTypes: Array<ActionType>;
  deck: Deck;
  energy?: Maybe<Scalars['Int']['output']>;
  game: Game;
  id: Scalars['Int']['output'];
  lastViewedAt?: Maybe<Scalars['DateTime']['output']>;
  lifePoint: Scalars['Int']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export enum Kind {
  Block = 'BLOCK',
  CircleMonster = 'CIRCLE_MONSTER',
  Monster = 'MONSTER',
  Quick = 'QUICK'
}

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
  data: GameActionDispatchInput;
  id: Scalars['Int']['input'];
};


export type MutationMinusDeckCardArgs = {
  data: DeckCardUpdateInput;
};


export type MutationPlusDeckCardArgs = {
  data: DeckCardUpdateInput;
};


export type MutationStartGameArgs = {
  deckId: Scalars['Int']['input'];
};

export type Node = {
  id: Scalars['Int']['output'];
};

export enum Phase {
  Battle = 'BATTLE',
  Draw = 'DRAW',
  End = 'END',
  Energy = 'ENERGY',
  Put = 'PUT',
  Something = 'SOMETHING'
}

export type Query = {
  __typename?: 'Query';
  activeGameId?: Maybe<Scalars['Int']['output']>;
  cards: Array<Card>;
  deckCards: Array<DeckCard>;
  decks: Array<Deck>;
  game: Game;
  userData: UserData;
};


export type QueryDeckCardsArgs = {
  deckId: Scalars['Int']['input'];
};


export type QueryGameArgs = {
  id: Scalars['Int']['input'];
};


export type QueryUserDataArgs = {
  userId: Scalars['String']['input'];
};

export enum StateType {
  AttackCount = 'ATTACK_COUNT',
  PutSoulCount = 'PUT_SOUL_COUNT',
  SelfPowerChange = 'SELF_POWER_CHANGE'
}

export enum Type {
  BlackSta = 'BLACK_STA',
  Circle = 'CIRCLE',
  Rectangle = 'RECTANGLE',
  Triangle = 'TRIANGLE',
  WhiteStar = 'WHITE_STAR'
}

export type User = {
  __typename?: 'User';
  displayName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  photoURL?: Maybe<Scalars['String']['output']>;
};

export type UserData = Node & {
  __typename?: 'UserData';
  id: Scalars['Int']['output'];
  losingCount: Scalars['Int']['output'];
  userId: Scalars['String']['output'];
  winningCount: Scalars['Int']['output'];
};

export enum Zone {
  Battle = 'BATTLE',
  Deck = 'DECK',
  Hand = 'HAND',
  Morgue = 'MORGUE',
  Soul = 'SOUL'
}

export type CardsQueryVariables = Exact<{ [key: string]: never; }>;


export type CardsQuery = { __typename?: 'Query', cards: Array<{ __typename?: 'Card', id: number, name: string, kind: Kind, attribute?: Attribute | null, type: Type, attack?: number | null, defence?: number | null, cost?: number | null, detail?: string | null, picture: string }> };

export type CardFragment = { __typename?: 'Card', id: number, name: string, kind: Kind, attribute?: Attribute | null, type: Type, attack?: number | null, defence?: number | null, cost?: number | null, detail?: string | null, picture: string };

export type DeckCardsQueryVariables = Exact<{
  deckId: Scalars['Int']['input'];
}>;


export type DeckCardsQuery = { __typename?: 'Query', deckCards: Array<{ __typename?: 'DeckCard', id: number, count: number, card: { __typename?: 'Card', id: number, name: string, kind: Kind, attribute?: Attribute | null, type: Type, attack?: number | null, defence?: number | null, cost?: number | null, detail?: string | null, picture: string } }> };

export type PlusDeckCardMutationVariables = Exact<{
  deckId: Scalars['Int']['input'];
  cardId: Scalars['Int']['input'];
}>;


export type PlusDeckCardMutation = { __typename?: 'Mutation', plusDeckCard: { __typename?: 'DeckCard', id: number, count: number } };

export type MinusDeckCardMutationVariables = Exact<{
  deckId: Scalars['Int']['input'];
  cardId: Scalars['Int']['input'];
}>;


export type MinusDeckCardMutation = { __typename?: 'Mutation', minusDeckCard: { __typename?: 'DeckCard', id: number, count: number } };

export type DecksQueryVariables = Exact<{ [key: string]: never; }>;


export type DecksQuery = { __typename?: 'Query', decks: Array<{ __typename?: 'Deck', id: number, name: string }> };

export type CreateDeckMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateDeckMutation = { __typename?: 'Mutation', createDeck: { __typename?: 'Deck', id: number, name: string } };

export type ActiveGameIdQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveGameIdQuery = { __typename?: 'Query', activeGameId?: number | null };

export type GameQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GameQuery = { __typename?: 'Query', game: { __typename?: 'Game', id: number, turnUserId?: string | null, phase?: Phase | null, winnerUserId?: string | null, startedAt?: any | null, endedAt?: any | null, gameUsers: Array<{ __typename?: 'GameUser', id: number, userId: string, energy?: number | null, lifePoint: number, lastViewedAt?: any | null, actionTypes: Array<ActionType>, user: { __typename?: 'User', displayName?: string | null, photoURL?: string | null } }>, gameCards: Array<{ __typename?: 'GameCard', id: number, originalUserId: string, currentUserId: string, zone: Zone, position: number, battlePosition?: BattlePosition | null, name?: string | null, kind?: Kind | null, type?: Type | null, attribute?: Attribute | null, attack?: number | null, defence?: number | null, cost?: number | null, detail?: string | null, actionTypes: Array<ActionType>, card?: { __typename?: 'Card', id: number, picture: string } | null }> } };

export type StartGameMutationVariables = Exact<{
  deckId: Scalars['Int']['input'];
}>;


export type StartGameMutation = { __typename?: 'Mutation', startGame: { __typename?: 'Game', id: number } };

export type DispatchGameActionMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  data: GameActionDispatchInput;
}>;


export type DispatchGameActionMutation = { __typename?: 'Mutation', dispatchGameAction: { __typename?: 'Game', id: number } };

export type GameCardFragment = { __typename?: 'GameCard', id: number, originalUserId: string, currentUserId: string, zone: Zone, position: number, battlePosition?: BattlePosition | null, name?: string | null, kind?: Kind | null, type?: Type | null, attribute?: Attribute | null, attack?: number | null, defence?: number | null, cost?: number | null, detail?: string | null, actionTypes: Array<ActionType>, card?: { __typename?: 'Card', id: number, picture: string } | null };

export type GameUserFragment = { __typename?: 'GameUser', id: number, userId: string, energy?: number | null, lifePoint: number, lastViewedAt?: any | null, actionTypes: Array<ActionType>, user: { __typename?: 'User', displayName?: string | null, photoURL?: string | null } };

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
export function useCardsQuery(baseOptions?: Apollo.QueryHookOptions<CardsQuery, CardsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CardsQuery, CardsQueryVariables>(CardsDocument, options);
      }
export function useCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardsQuery, CardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CardsQuery, CardsQueryVariables>(CardsDocument, options);
        }
export function useCardsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CardsQuery, CardsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CardsQuery, CardsQueryVariables>(CardsDocument, options);
        }
export type CardsQueryHookResult = ReturnType<typeof useCardsQuery>;
export type CardsLazyQueryHookResult = ReturnType<typeof useCardsLazyQuery>;
export type CardsSuspenseQueryHookResult = ReturnType<typeof useCardsSuspenseQuery>;
export type CardsQueryResult = Apollo.QueryResult<CardsQuery, CardsQueryVariables>;
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
export function useDeckCardsQuery(baseOptions: Apollo.QueryHookOptions<DeckCardsQuery, DeckCardsQueryVariables> & ({ variables: DeckCardsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DeckCardsQuery, DeckCardsQueryVariables>(DeckCardsDocument, options);
      }
export function useDeckCardsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DeckCardsQuery, DeckCardsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DeckCardsQuery, DeckCardsQueryVariables>(DeckCardsDocument, options);
        }
export function useDeckCardsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DeckCardsQuery, DeckCardsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DeckCardsQuery, DeckCardsQueryVariables>(DeckCardsDocument, options);
        }
export type DeckCardsQueryHookResult = ReturnType<typeof useDeckCardsQuery>;
export type DeckCardsLazyQueryHookResult = ReturnType<typeof useDeckCardsLazyQuery>;
export type DeckCardsSuspenseQueryHookResult = ReturnType<typeof useDeckCardsSuspenseQuery>;
export type DeckCardsQueryResult = Apollo.QueryResult<DeckCardsQuery, DeckCardsQueryVariables>;
export const PlusDeckCardDocument = gql`
    mutation plusDeckCard($deckId: Int!, $cardId: Int!) {
  plusDeckCard(data: {deckId: $deckId, cardId: $cardId}) {
    id
    count
  }
}
    `;
export type PlusDeckCardMutationFn = Apollo.MutationFunction<PlusDeckCardMutation, PlusDeckCardMutationVariables>;

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
export function usePlusDeckCardMutation(baseOptions?: Apollo.MutationHookOptions<PlusDeckCardMutation, PlusDeckCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PlusDeckCardMutation, PlusDeckCardMutationVariables>(PlusDeckCardDocument, options);
      }
export type PlusDeckCardMutationHookResult = ReturnType<typeof usePlusDeckCardMutation>;
export type PlusDeckCardMutationResult = Apollo.MutationResult<PlusDeckCardMutation>;
export type PlusDeckCardMutationOptions = Apollo.BaseMutationOptions<PlusDeckCardMutation, PlusDeckCardMutationVariables>;
export const MinusDeckCardDocument = gql`
    mutation minusDeckCard($deckId: Int!, $cardId: Int!) {
  minusDeckCard(data: {deckId: $deckId, cardId: $cardId}) {
    id
    count
  }
}
    `;
export type MinusDeckCardMutationFn = Apollo.MutationFunction<MinusDeckCardMutation, MinusDeckCardMutationVariables>;

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
export function useMinusDeckCardMutation(baseOptions?: Apollo.MutationHookOptions<MinusDeckCardMutation, MinusDeckCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MinusDeckCardMutation, MinusDeckCardMutationVariables>(MinusDeckCardDocument, options);
      }
export type MinusDeckCardMutationHookResult = ReturnType<typeof useMinusDeckCardMutation>;
export type MinusDeckCardMutationResult = Apollo.MutationResult<MinusDeckCardMutation>;
export type MinusDeckCardMutationOptions = Apollo.BaseMutationOptions<MinusDeckCardMutation, MinusDeckCardMutationVariables>;
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
export function useDecksQuery(baseOptions?: Apollo.QueryHookOptions<DecksQuery, DecksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DecksQuery, DecksQueryVariables>(DecksDocument, options);
      }
export function useDecksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DecksQuery, DecksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DecksQuery, DecksQueryVariables>(DecksDocument, options);
        }
export function useDecksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DecksQuery, DecksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DecksQuery, DecksQueryVariables>(DecksDocument, options);
        }
export type DecksQueryHookResult = ReturnType<typeof useDecksQuery>;
export type DecksLazyQueryHookResult = ReturnType<typeof useDecksLazyQuery>;
export type DecksSuspenseQueryHookResult = ReturnType<typeof useDecksSuspenseQuery>;
export type DecksQueryResult = Apollo.QueryResult<DecksQuery, DecksQueryVariables>;
export const CreateDeckDocument = gql`
    mutation createDeck($name: String!) {
  createDeck(data: {name: $name}) {
    id
    name
  }
}
    `;
export type CreateDeckMutationFn = Apollo.MutationFunction<CreateDeckMutation, CreateDeckMutationVariables>;

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
export function useCreateDeckMutation(baseOptions?: Apollo.MutationHookOptions<CreateDeckMutation, CreateDeckMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDeckMutation, CreateDeckMutationVariables>(CreateDeckDocument, options);
      }
export type CreateDeckMutationHookResult = ReturnType<typeof useCreateDeckMutation>;
export type CreateDeckMutationResult = Apollo.MutationResult<CreateDeckMutation>;
export type CreateDeckMutationOptions = Apollo.BaseMutationOptions<CreateDeckMutation, CreateDeckMutationVariables>;
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
export function useActiveGameIdQuery(baseOptions?: Apollo.QueryHookOptions<ActiveGameIdQuery, ActiveGameIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ActiveGameIdQuery, ActiveGameIdQueryVariables>(ActiveGameIdDocument, options);
      }
export function useActiveGameIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ActiveGameIdQuery, ActiveGameIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ActiveGameIdQuery, ActiveGameIdQueryVariables>(ActiveGameIdDocument, options);
        }
export function useActiveGameIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ActiveGameIdQuery, ActiveGameIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ActiveGameIdQuery, ActiveGameIdQueryVariables>(ActiveGameIdDocument, options);
        }
export type ActiveGameIdQueryHookResult = ReturnType<typeof useActiveGameIdQuery>;
export type ActiveGameIdLazyQueryHookResult = ReturnType<typeof useActiveGameIdLazyQuery>;
export type ActiveGameIdSuspenseQueryHookResult = ReturnType<typeof useActiveGameIdSuspenseQuery>;
export type ActiveGameIdQueryResult = Apollo.QueryResult<ActiveGameIdQuery, ActiveGameIdQueryVariables>;
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
export function useGameQuery(baseOptions: Apollo.QueryHookOptions<GameQuery, GameQueryVariables> & ({ variables: GameQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GameQuery, GameQueryVariables>(GameDocument, options);
      }
export function useGameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GameQuery, GameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GameQuery, GameQueryVariables>(GameDocument, options);
        }
export function useGameSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GameQuery, GameQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GameQuery, GameQueryVariables>(GameDocument, options);
        }
export type GameQueryHookResult = ReturnType<typeof useGameQuery>;
export type GameLazyQueryHookResult = ReturnType<typeof useGameLazyQuery>;
export type GameSuspenseQueryHookResult = ReturnType<typeof useGameSuspenseQuery>;
export type GameQueryResult = Apollo.QueryResult<GameQuery, GameQueryVariables>;
export const StartGameDocument = gql`
    mutation startGame($deckId: Int!) {
  startGame(deckId: $deckId) {
    id
  }
}
    `;
export type StartGameMutationFn = Apollo.MutationFunction<StartGameMutation, StartGameMutationVariables>;

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
export function useStartGameMutation(baseOptions?: Apollo.MutationHookOptions<StartGameMutation, StartGameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StartGameMutation, StartGameMutationVariables>(StartGameDocument, options);
      }
export type StartGameMutationHookResult = ReturnType<typeof useStartGameMutation>;
export type StartGameMutationResult = Apollo.MutationResult<StartGameMutation>;
export type StartGameMutationOptions = Apollo.BaseMutationOptions<StartGameMutation, StartGameMutationVariables>;
export const DispatchGameActionDocument = gql`
    mutation dispatchGameAction($id: Int!, $data: GameActionDispatchInput!) {
  dispatchGameAction(id: $id, data: $data) {
    id
  }
}
    `;
export type DispatchGameActionMutationFn = Apollo.MutationFunction<DispatchGameActionMutation, DispatchGameActionMutationVariables>;

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
export function useDispatchGameActionMutation(baseOptions?: Apollo.MutationHookOptions<DispatchGameActionMutation, DispatchGameActionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DispatchGameActionMutation, DispatchGameActionMutationVariables>(DispatchGameActionDocument, options);
      }
export type DispatchGameActionMutationHookResult = ReturnType<typeof useDispatchGameActionMutation>;
export type DispatchGameActionMutationResult = Apollo.MutationResult<DispatchGameActionMutation>;
export type DispatchGameActionMutationOptions = Apollo.BaseMutationOptions<DispatchGameActionMutation, DispatchGameActionMutationVariables>;