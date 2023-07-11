import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ManyToOne } from "typeorm"
import { User } from "./User";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.posts)
    user: User;
}
