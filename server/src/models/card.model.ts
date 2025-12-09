enum Kind {
  MONSTER = 'MONSTER',
  CIRCLE_MONSTER = 'CIRCLE_MONSTER',
  QUICK = 'QUICK',
  BLOCK = 'BLOCK',
}

enum Type {
  CIRCLE = 'CIRCLE',
  TRIANGLE = 'TRIANGLE',
  RECTANGLE = 'RECTANGLE',
  WHITE_STAR = 'WHITE_STAR',
  BLACK_STA = 'BLACK_STA',
}

enum Attribute {
  RED = 'RED',
  BLUE = 'BLUE',
  WHITE = 'WHITE',
  GREEN = 'GREEN',
  PURPLE = 'PURPLE',
  BLACK = 'BLACK',
}

export class CardModel {
  constructor(partial?: Partial<CardModel>) {
    Object.assign(this, partial);
  }

  id: number;
  name: string;
  kind: Kind;
  type: Type;
  attribute: Attribute | null;
  attack: number | null;
  defence: number | null;
  cost: number | null;
  detail: string | null;
  picture: string;
}
