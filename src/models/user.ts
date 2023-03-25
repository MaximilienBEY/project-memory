import { Column } from "./utils/column"
import { Model } from "./utils/model/model"
import { Table } from "./utils/table"

@Table({
  name: "users",
})
export default class User extends Model {
  @Column()
  declare name: string

  @Column()
  declare email: string

  @Column()
  declare password: string
}
