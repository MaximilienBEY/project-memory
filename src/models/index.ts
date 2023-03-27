import Card from "./card"
import Category from "./category"
import Theme from "./theme"
import { Database } from "./utils/database"

const database = new Database("main", 0.1)

database.addModels([Category, Theme, Card])

export default database
