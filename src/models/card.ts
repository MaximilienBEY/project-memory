import Theme from "./theme"
import { Column } from "./utils/column"
import { Model } from "./utils/model/model"
import { BelongsTo, ForeignKey } from "./utils/relation"
import { Table } from "./utils/table"

@Table({
  name: "cards",
})
class Card extends Model {
  @Column()
  declare title: string

  @Column()
  declare rectoType: "text" | "image" | "audio" | "video"
  @Column()
  declare rectoText?: string
  @Column()
  declare rectoMedia?: Uint8Array

  @Column()
  declare versoType: "text" | "image" | "audio" | "video"
  @Column()
  declare versoText?: string
  @Column()
  declare versoMedia?: Uint8Array

  @ForeignKey(() => Theme)
  @Column()
  declare themeId: number
  @BelongsTo(() => Theme)
  declare theme: Theme
}

export default Card
