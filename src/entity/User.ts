import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany } from "typeorm"
import { Post } from "./Post"

interface UserId {
    id: string
}

@Entity()
export class User {

    @PrimaryColumn(
        {
            type: "int",
            transformer: {
                to: (value: UserId) => parseInt(value.id),
                from: (value: number) => { id: value.toString()}
            }
        }
    )
    id: UserId

    @Column()
    firstName: string

    @OneToMany(type => Post, post => post.user)
    posts: Post[]

}
