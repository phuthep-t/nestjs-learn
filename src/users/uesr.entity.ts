import {
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterUpdate,
  AfterRemove
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserted User With id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('updated User With id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('deleted User With id', this.id);
  }
}
