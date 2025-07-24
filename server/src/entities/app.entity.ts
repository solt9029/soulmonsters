import { BaseEntity } from 'typeorm';

export class AppEntity<T = any> extends BaseEntity {
  constructor(partial?: Partial<T>) {
    super();
    Object.assign(this, partial);
  }
}
