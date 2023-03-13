import Model from "."

type NonConstructorKeys<T> = {
  [P in keyof T]: T[P] extends new () => any ? never : P
}[keyof T]
type NonConstructor<T> = Pick<T, NonConstructorKeys<T>>
export type ModelStatic<M extends Model> = NonConstructor<typeof Model> & { new (): M }

type Attribute<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends Date
  ? Date
  : T extends Array<infer U>
  ? Array<U>
  : T extends object
  ? T
  : null

export type Attributes<M extends Model> = Pick<
  {
    [P in keyof M]: Attribute<M[P]>
  },
  Exclude<
    keyof M,
    | "id"
    | "createdAt"
    | "updatedAt"
    | { [K in keyof M]: M[K] extends () => void ? K : never }[keyof M]
  >
>

export type DateFilter = {
  $gt?: Date
  $gte?: Date
  $lt?: Date
  $lte?: Date
}
export type WhereOptions<M extends Model> = Pick<
  {
    [P in keyof M]?: M[P] extends Date ? DateFilter : Attribute<M[P]>
  },
  Exclude<keyof M, { [K in keyof M]: M[K] extends () => void ? K : never }[keyof M]>
>
export type FindOptions<M extends Model> = {
  where?: WhereOptions<M>
  limit?: number
  offset?: number
}
