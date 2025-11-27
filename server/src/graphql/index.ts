
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum ActionType {
    START_DRAW_TIME = "START_DRAW_TIME",
    START_ENERGY_TIME = "START_ENERGY_TIME",
    START_PUT_TIME = "START_PUT_TIME",
    START_SOMETHING_TIME = "START_SOMETHING_TIME",
    START_BATTLE_TIME = "START_BATTLE_TIME",
    START_END_TIME = "START_END_TIME",
    FINISH_END_TIME = "FINISH_END_TIME",
    PUT_SOUL = "PUT_SOUL",
    CHANGE_BATTLE_POSITION = "CHANGE_BATTLE_POSITION",
    USE_SOUL_CANON = "USE_SOUL_CANON",
    SUMMON_MONSTER = "SUMMON_MONSTER",
    ATTACK = "ATTACK",
    USE_SOUL_BARRIER = "USE_SOUL_BARRIER",
    EFFECT_RUTERUTE_DRAW = "EFFECT_RUTERUTE_DRAW"
}

export enum Attribute {
    RED = "RED",
    BLUE = "BLUE",
    WHITE = "WHITE",
    GREEN = "GREEN",
    PURPLE = "PURPLE",
    BLACK = "BLACK"
}

export enum BattlePosition {
    ATTACK = "ATTACK",
    DEFENCE = "DEFENCE"
}

export enum Kind {
    MONSTER = "MONSTER",
    CIRCLE_MONSTER = "CIRCLE_MONSTER",
    QUICK = "QUICK",
    BLOCK = "BLOCK"
}

export enum Phase {
    DRAW = "DRAW",
    ENERGY = "ENERGY",
    PUT = "PUT",
    SOMETHING = "SOMETHING",
    BATTLE = "BATTLE",
    END = "END"
}

export enum StateType {
    ATTACK_COUNT = "ATTACK_COUNT",
    PUT_SOUL_COUNT = "PUT_SOUL_COUNT",
    SELF_POWER_CHANGE = "SELF_POWER_CHANGE",
    EFFECT_RUTERUTE_DRAW_COUNT = "EFFECT_RUTERUTE_DRAW_COUNT"
}

export enum Type {
    CIRCLE = "CIRCLE",
    TRIANGLE = "TRIANGLE",
    RECTANGLE = "RECTANGLE",
    WHITE_STAR = "WHITE_STAR",
    BLACK_STA = "BLACK_STA"
}

export enum Zone {
    BATTLE = "BATTLE",
    DECK = "DECK",
    SOUL = "SOUL",
    MORGUE = "MORGUE",
    HAND = "HAND"
}

export interface ActionPayload {
    gameCardId?: Nullable<number>;
    targetGameCardIds?: Nullable<number[]>;
    costGameCardIds?: Nullable<number[]>;
    targetGameUserIds?: Nullable<number[]>;
}

export interface DeckCardUpdateInput {
    deckId: number;
    cardId: number;
}

export interface DeckCreateInput {
    name: string;
}

export interface GameActionDispatchInput {
    type: ActionType;
    payload: ActionPayload;
}

export interface Node {
    id: number;
}

export interface Card extends Node {
    id: number;
    name: string;
    kind: Kind;
    type: Type;
    attribute?: Nullable<Attribute>;
    attack?: Nullable<number>;
    defence?: Nullable<number>;
    cost?: Nullable<number>;
    detail?: Nullable<string>;
    picture: string;
}

export interface Deck extends Node {
    id: number;
    userId: string;
    name: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface DeckCard extends Node {
    id: number;
    count: number;
    deck: Deck;
    card: Card;
}

export interface Game extends Node {
    id: number;
    turnUserId?: Nullable<string>;
    phase?: Nullable<Phase>;
    winnerUserId?: Nullable<string>;
    startedAt?: Nullable<DateTime>;
    endedAt?: Nullable<DateTime>;
    gameUsers: GameUser[];
    gameCards: GameCard[];
}

export interface GameCard extends Node {
    id: number;
    originalUserId: string;
    currentUserId: string;
    zone: Zone;
    position: number;
    battlePosition?: Nullable<BattlePosition>;
    name?: Nullable<string>;
    kind?: Nullable<Kind>;
    type?: Nullable<Type>;
    attribute?: Nullable<Attribute>;
    attack?: Nullable<number>;
    defence?: Nullable<number>;
    cost?: Nullable<number>;
    detail?: Nullable<string>;
    card?: Nullable<Card>;
    actionTypes: ActionType[];
}

export interface GameUser extends Node {
    id: number;
    userId: string;
    user: User;
    energy?: Nullable<number>;
    lifePoint: number;
    lastViewedAt?: Nullable<DateTime>;
    deck: Deck;
    actionTypes: ActionType[];
}

export interface IMutation {
    plusDeckCard(data: DeckCardUpdateInput): DeckCard | Promise<DeckCard>;
    minusDeckCard(data: DeckCardUpdateInput): DeckCard | Promise<DeckCard>;
    createDeck(data: DeckCreateInput): Deck | Promise<Deck>;
    startGame(deckId: number): Game | Promise<Game>;
    dispatchGameAction(id: number, data: GameActionDispatchInput): Game | Promise<Game>;
}

export interface IQuery {
    cards(): Card[] | Promise<Card[]>;
    deckCards(deckId: number): DeckCard[] | Promise<DeckCard[]>;
    decks(): Deck[] | Promise<Deck[]>;
    game(id: number): Game | Promise<Game>;
    activeGameId(): Nullable<number> | Promise<Nullable<number>>;
    userData(userId: string): UserData | Promise<UserData>;
}

export interface User {
    id: string;
    displayName?: Nullable<string>;
    photoURL?: Nullable<string>;
}

export interface UserData extends Node {
    id: number;
    userId: string;
    winningCount: number;
    losingCount: number;
}

export type DateTime = any;
type Nullable<T> = T | null;
