import { AppDataSource } from "./data-source"
import { Post } from "./entity/Post"
import { User } from "./entity/User"

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new User()
    user.firstName = "Timber"
    user.id = { id: "15" }
    await AppDataSource.manager.save(user)
    console.log("Saved a new user with id: " + user.id)

    const post = new Post()
    post.user = user

    await AppDataSource.manager.save(post)

}).catch(error => console.log(error))
