import Category from "./category"
import { Column } from "./utils/column"
import { Model } from "./utils/model/model"
import { BelongsTo, ForeignKey } from "./utils/relation"
import { Table } from "./utils/table"

@Table({
  name: "themes",
})
class Theme extends Model {
  @Column()
  declare title: string

  @Column()
  declare description?: string

  @ForeignKey(() => Category)
  @Column()
  declare categoryId: number

  @BelongsTo(() => Category)
  declare category: Category
}

export default Theme
