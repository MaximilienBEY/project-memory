import { Attributes, DateFilter, FindOptions, ModelStatic } from "./types"

class Database {
  private static instance?: Database
  public dbPromise: Promise<IDBDatabase>

  static getInstance = () => {
    if (!this.instance) this.instance = new Database()
    return this.instance
  }

  constructor() {
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open("project-memory", 1)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        resolve(db)
      }
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        resolve(db)
      }
      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error)
      }
    })
  }
}

abstract class Model {
  private static readonly _db: Database = Database.getInstance()
  declare id: number
  declare updatedAt: Date
  declare createdAt: Date

  private static getTableName<M extends Model>(self: ModelStatic<M>) {
    const tableRawName = self.name.toLowerCase()
    const tableName = tableRawName.endsWith("y")
      ? tableRawName.slice(0, -1) + "ies"
      : tableRawName.endsWith("s")
      ? tableRawName + "es"
      : tableRawName + "s"
    return tableName
  }
  private static async verifyTable<M extends Model>(tableName: string, model?: M) {
    const indexes = model
      ? [
          ...Object.keys(model).map((key) => {
            return {
              name: key,
              keyPath: key,
              unique: false,
            }
          }),
          {
            name: "createdAt",
            keyPath: "createdAt",
            unique: false,
          },
          {
            name: "updatedAt",
            keyPath: "updatedAt",
            unique: false,
          },
        ]
      : []
    const db = await this._db.dbPromise
    const storeNames = db.objectStoreNames

    const objectStore = storeNames.contains(tableName)
      ? db.transaction(tableName, "readwrite").objectStore(tableName)
      : db.createObjectStore(tableName, {
          keyPath: "id",
          autoIncrement: true,
        })

    indexes.map((index) => {
      if (!objectStore.indexNames.contains(index.name)) {
        objectStore.createIndex(index.name, index.keyPath, { unique: index.unique })
      }
    })
    return objectStore
  }
  private static async createData<M extends Model>(tableName: string, model: M) {
    const store = await this.verifyTable(tableName, model)
    const dataId = await new Promise<number>((resolve) => {
      const createdAt = new Date()
      const updatedAt = new Date()

      const request = store.add({
        ...model,
        createdAt,
        updatedAt,
      })
      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest<number>).result)
        model.createdAt = createdAt
        model.updatedAt = updatedAt
      }
    })

    model.id = dataId
  }

  static async create<M extends Model>(
    this: ModelStatic<M>,
    data: Attributes<M>,
  ): Promise<M> {
    const model = new this()
    const tableName = Model.getTableName(this)

    Object.assign(model, data)
    await Model.createData(tableName, model)

    return model as M
  }
  static async findAll<M extends Model>(
    this: ModelStatic<M>,
    options?: FindOptions<M>,
  ): Promise<M[]> {
    const tableName = Model.getTableName(this)
    const store = await Model.verifyTable(tableName)

    const { limit = Infinity, where = {}, offset = 0 } = options ?? {}

    const request = store.getAll()
    const data = await new Promise<M[]>((resolve) => {
      request.onsuccess = (event) => {
        const rows = (event.target as IDBRequest<M[]>).result
        const models = rows.map((row) => {
          const model = new this()
          Object.assign(model, row)
          return model
        })
        resolve(models)
      }
    })

    const filteredData = data
      .filter((model) => {
        return Object.entries(where).every(([key, value]) => {
          const modelValue = model[key as keyof M]
          if (typeof modelValue === "string") return modelValue.includes(value as string)
          if (typeof modelValue === "number") return modelValue === value
          if (typeof modelValue === "boolean") return modelValue === value
          if (modelValue instanceof Date) {
            const dateValue = value as DateFilter
            if (dateValue.$gt) return modelValue.getTime() > dateValue.$gt.getTime()
            if (dateValue.$lt) return modelValue.getTime() < dateValue.$lt.getTime()
            if (dateValue.$gte) return modelValue.getTime() >= dateValue.$gte.getTime()
            if (dateValue.$lte) return modelValue.getTime() <= dateValue.$lte.getTime()
          }
          return true
        })
      })
      .slice(offset, offset + limit)

    return filteredData
  }
  static async findOne<M extends Model>(
    this: ModelStatic<M>,
    id: number,
  ): Promise<M | null> {
    const tableName = Model.getTableName(this)
    const store = await Model.verifyTable(tableName)

    const data = await new Promise<M | null>((resolve) => {
      const request = store.get(id)
      request.onsuccess = (event) => {
        const row = (event.target as IDBRequest<M>).result
        if (!row) return resolve(null)

        const model = new this()
        Object.assign(model, row)
        resolve(model)
      }
    })
    return data
  }

  public async save<M extends Model>(this: M): Promise<M> {
    const tableName = Model.getTableName(this.constructor as ModelStatic<M>)
    const store = await Model.verifyTable(tableName)

    const updatedAt = new Date()
    return new Promise<M>((resolve) => {
      const request = store.put({
        ...this,
        updatedAt,
      })
      request.onsuccess = () => {
        this.updatedAt = updatedAt
        resolve(this)
      }
    })
  }
  public async destroy<M extends Model>(this: M): Promise<void> {
    const tableName = Model.getTableName(this.constructor as ModelStatic<M>)
    const store = await Model.verifyTable(tableName)

    return new Promise<void>((resolve) => {
      const request = store.delete(this.id)
      request.onsuccess = () => resolve()
    })
  }
}

export default Model
