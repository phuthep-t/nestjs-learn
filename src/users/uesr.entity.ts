import {
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterUpdate,
  AfterRemove, OneToMany
} from 'typeorm';
import {Report} from '../reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(()=> Report,(report)=>report.user)
  reports: Report[];

  @Column({default:true})
  admin:boolean;

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
