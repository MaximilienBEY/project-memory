import Dexie from "dexie"

import {
  CollectionType,
  CreateAttributes,
  FindOptions,
  ModelStatic,
  TableType,
  UpdateAttributes,
  WhereAttributes,
} from "./types"

const getTableInstance = <M extends Model>(self: ModelStatic<M>): TableType => {
  const db = self.prototype.db as Dexie
  if (!db) throw new Error(`Model ${self.name} not initialized with database.`)
  return db.table(self.prototype._tableName)
}
const asignModel = <M extends Model>(self: ModelStatic<M>, data: any) => {
  const instance = new self()
  Object.assign(instance, data)
  return instance
}
const getWhereCollecition = <M extends Model>(
  table: TableType,
  where?: WhereAttributes<M> | undefined,
): CollectionType => {
  let collection: CollectionType | null = null
  if (where) {
    if ("$or" in where && Array.isArray(where.$or)) {
      // where.$or.map()
    } else {
      Object.keys(where).map((k) => {
        const key = k as keyof typeof where
        const value = where[key]
        if (!value) return

        if (
          typeof value === "string" ||
          (typeof value === "object" &&
            ("$include" in value || "$startsWith" in value || "$endsWith" in value))
        ) {
          if (typeof value === "string") {
            if (!collection) collection = table.where(key).equalsIgnoreCase(value)
            else
              collection.and((row) =>
                row[key].toLowerCase().includes(value.toLowerCase()),
              )
          } else {
            if (value.$include) {
              if (!collection)
                collection = table.filter((row) =>
                  row[key].toLowerCase().includes(value.$include!.toLowerCase()),
                )
              else
                collection.and((row) =>
                  row[key].toLowerCase().includes(value.$include!.toLowerCase()),
                )
            }
            if (value.$startsWith) {
              if (!collection)
                collection = table.where(key).startsWithIgnoreCase(value.$startsWith)
              else
                collection.and((row) =>
                  row[key].toLowerCase().startsWith(value.$startsWith!.toLowerCase()),
                )
            }
            if (value.$endsWith) {
              if (!collection)
                collection = table.filter((row) =>
                  row[key].toLowerCase().endsWith(value.$endsWith!.toLowerCase()),
                )
              else
                collection.and((row) =>
                  row[key].toLowerCase().endsWith(value.$endsWith!.toLowerCase()),
                )
            }
          }
        } else if (
          value instanceof Date ||
          (typeof value === "object" &&
            ("$gt" in value || "$gte" in value || "$lt" in value || "$lte" in value) &&
            (value["$gt"] instanceof Date ||
              value["$gte"] instanceof Date ||
              value["$lt"] instanceof Date ||
              value["$lte"] instanceof Date))
        ) {
          if (value instanceof Date) {
            if (!collection) collection = table.where(key).equals(value)
            else collection.and((row) => row[key] === value)
          } else {
            if (value.$gt) {
              if (!collection) collection = table.where(key).above(value.$gt)
              else collection.and((row) => row[key] > value.$gt!)
            }
            if (value.$gte) {
              if (!collection) collection = table.where(key).aboveOrEqual(value.$gte)
              else collection.and((row) => row[key] >= value.$gte!)
            }
            if (value.$lt) {
              if (!collection) collection = table.where(key).below(value.$lt)
              else collection.and((row) => row[key] < value.$lt!)
            }
            if (value.$lte) {
              if (!collection) collection = table.where(key).belowOrEqual(value.$lte)
              else collection.and((row) => row[key] <= value.$lte!)
            }
          }
        } else if (
          typeof value === "number" ||
          (typeof value === "object" &&
            ("$gt" in value || "$gte" in value || "$lt" in value || "$lte" in value))
        ) {
          if (typeof value === "number") {
            if (!collection) collection = table.where(key).equals(value)
            else collection.and((row) => row[key] === value)
          } else {
            if (value.$gt) {
              if (!collection) collection = table.where(key).above(value.$gt)
              else collection.and((row) => row[key] > value.$gt!)
            }
            if (value.$gte) {
              if (!collection) collection = table.where(key).aboveOrEqual(value.$gte)
              else collection.and((row) => row[key] >= value.$gte!)
            }
            if (value.$lt) {
              if (!collection) collection = table.where(key).below(value.$lt)
              else collection.and((row) => row[key] < value.$lt!)
            }
            if (value.$lte) {
              if (!collection) collection = table.where(key).belowOrEqual(value.$lte)
              else collection.and((row) => row[key] <= value.$lte!)
            }
          }
        }
      })
    }
    // collection = table.where()
  }

  if (!collection) collection = table.toCollection()
  return collection
}

export abstract class Model {
  declare readonly id: number
  declare readonly updatedAt: Date
  declare readonly createdAt: Date

  public static async create<M extends Model>(
    this: ModelStatic<M>,
    data: CreateAttributes<M>,
  ): Promise<M> {
    const payload = { ...data, createdAt: new Date(), updatedAt: new Date() }
    await getTableInstance(this).add(payload)

    return asignModel(this, payload)
  }
  public static async update<M extends Model>(
    this: ModelStatic<M>,
    data: UpdateAttributes<M>,
    options?: FindOptions<M>,
  ): Promise<void> {
    const { where, limit, offset, order } = options || {}
    const table = getTableInstance(this)

    const collection = getWhereCollecition(table, where)
    if (offset) collection.offset(offset)
    if (limit) collection.limit(limit)
    if (order === "DESC") collection.reverse()

    const payload = { ...data, updatedAt: new Date() }
    await collection
      .toArray()
      .then((rows) => Promise.all(rows.map((row) => table.update(row.id, payload))))
  }
  public static async destroy<M extends Model>(
    this: ModelStatic<M>,
    options?: FindOptions<M>,
  ): Promise<number> {
    const { where, limit, offset, order } = options || {}
    const table = getTableInstance(this)

    const collection = getWhereCollecition(table, where)
    if (offset) collection.offset(offset)
    if (limit) collection.limit(limit)
    if (order === "DESC") collection.reverse()

    const rows = await collection
      .toArray()
      .then((rows) => Promise.all(rows.map((row) => table.delete(row.id))))
    return rows.length
  }
  public static async findById<M extends Model>(
    this: ModelStatic<M>,
    id: number,
  ): Promise<M | null> {
    const table = getTableInstance(this)
    const data = await table.get(id)
    if (!data) return null

    return asignModel(this, data)
  }
  public static async findOne<M extends Model>(
    this: ModelStatic<M>,
    options?: FindOptions<M>,
  ): Promise<M | null> {
    const { where, limit, offset, order } = options || {}
    const table = getTableInstance(this)

    const collection = getWhereCollecition(table, where)
    if (offset) collection.offset(offset)
    if (limit) collection.limit(limit)
    if (order === "DESC") collection.reverse()

    const data = await collection.first()
    if (!data) return null

    return asignModel(this, data)
  }
  public static async findMany<M extends Model>(
    this: ModelStatic<M>,
    options?: FindOptions<M>,
  ): Promise<M[]> {
    const { where, limit, offset, order } = options || {}
    const table = getTableInstance(this)

    const collection = getWhereCollecition(table, where)
    if (offset) collection.offset(offset)
    if (limit) collection.limit(limit)
    if (order === "DESC") collection.reverse()

    const data = await collection.toArray()

    return data.map((d) => asignModel(this, d))
  }
  public static async count<M extends Model>(
    this: ModelStatic<M>,
    where?: WhereAttributes<M>,
  ) {
    const table = getTableInstance(this)
    const collection = getWhereCollecition(table, where)
    return collection.count()
  }

  public async update<M extends Model>(this: M, data: UpdateAttributes<M>): Promise<M> {
    const payload = { ...data, updatedAt: new Date() }
    const table = getTableInstance(this.constructor as ModelStatic<M>)
    await table.update(this.id, payload)

    return asignModel(this.constructor as ModelStatic<M>, { ...this, ...payload })
  }
  public async save<M extends Model>(this: M): Promise<M> {
    const payload: Record<string, any> = {}
    Object.keys(this).map((key) => {
      if (["id", "createdAt", "updatedAt"].includes(key)) return
      payload[key] = this[key as keyof M]
    })
    payload.updatedAt = new Date()
    Object.assign(this, payload)

    const table = getTableInstance(this.constructor as ModelStatic<M>)
    await table.update(this.id, payload)

    return this
  }
  public async destroy<M extends Model>(this: M): Promise<void> {
    const table = getTableInstance(this.constructor as ModelStatic<M>)
    await table.delete(this.id)
  }
  public async refresh<M extends Model>(this: M): Promise<M> {
    const table = getTableInstance(this.constructor as ModelStatic<M>)
    const data = await table.get(this.id)
    if (!data) throw new Error("Record not found")

    Object.assign(this, data)

    return this
  }
}
