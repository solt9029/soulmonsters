export class DeckModel {
  constructor(partial?: Partial<DeckModel>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
