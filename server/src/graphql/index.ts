
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
    USE_SOUL_BARRIER = "USE_SOUL_BARRIER"
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
    SELF_POWER_CHANGE = "SELF_POWER_CHANGE"
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

export class ActionPayload {
    gameCardId?: Nullable<number>;
    targetGameCardIds?: Nullable<number[]>;
    costGameCardIds?: Nullable<number[]>;
    targetGameUserIds?: Nullable<number[]>;
}

export class DeckCardUpdateInput {
    deckId: number;
    cardId: number;
}

export class DeckCreateInput {
    name: string;
}

export class GameActionDispatchInput {
    type: ActionType;
    payload: ActionPayload;
}

export interface Node {
    id: number;
}

export class Card implements Node {
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

export class Deck implements Node {
    id: number;
    userId: string;
    name: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class DeckCard implements Node {
    id: number;
    count: number;
    deck: Deck;
    card: Card;
}

export class Game implements Node {
    id: number;
    turnUserId?: Nullable<string>;
    phase?: Nullable<Phase>;
    winnerUserId?: Nullable<string>;
    startedAt?: Nullable<DateTime>;
    endedAt?: Nullable<DateTime>;
    gameUsers: GameUser[];
    gameCards: GameCard[];
}

export class GameCard implements Node {
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

export class GameUser implements Node {
    id: number;
    userId: string;
    user: User;
    energy?: Nullable<number>;
    lifePoint: number;
    lastViewedAt?: Nullable<DateTime>;
    deck: Deck;
    game: Game;
    actionTypes: ActionType[];
}

export abstract class IMutation {
    abstract plusDeckCard(data: DeckCardUpdateInput): DeckCard | Promise<DeckCard>;

    abstract minusDeckCard(data: DeckCardUpdateInput): DeckCard | Promise<DeckCard>;

    abstract createDeck(data: DeckCreateInput): Deck | Promise<Deck>;

    abstract startGame(deckId: number): Game | Promise<Game>;

    abstract dispatchGameAction(id: number, data: GameActionDispatchInput): Game | Promise<Game>;
}

export abstract class IQuery {
    abstract cards(): Card[] | Promise<Card[]>;

    abstract deckCards(deckId: number): DeckCard[] | Promise<DeckCard[]>;

    abstract decks(): Deck[] | Promise<Deck[]>;

    abstract game(id: number): Game | Promise<Game>;

    abstract activeGameId(): Nullable<number> | Promise<Nullable<number>>;

    abstract userData(userId: string): UserData | Promise<UserData>;
}

export class User {
    id: string;
    displayName?: Nullable<string>;
    photoURL?: Nullable<string>;
}

export class UserData implements Node {
    id: number;
    userId: string;
    winningCount: number;
    losingCount: number;
}

export type DateTime = any;
type Nullable<T> = T | null;
