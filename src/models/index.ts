import User from "./user"
import { Database } from "./utils/database"

const database = new Database("main", 0.1)

database.addModels([User])

export default database
