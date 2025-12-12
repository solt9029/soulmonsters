import { DeckEntity } from 'src/entities/deck.entity';

export class DeckModel {
  constructor(partial?: Partial<DeckModel>) {
    Object.assign(this, partial);
  }

  id: number;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  toEntity(): DeckEntity {
    return new DeckEntity({
      id: this.id,
      userId: this.userId,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
