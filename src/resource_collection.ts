import { JsonResource } from './json_resource.js'
import { SimplePaginator } from '@adonisjs/lucid/database'

export class ResourceCollection<
  Resource extends typeof JsonResource,
  Item = InstanceType<Resource>
> {
  protected shouldWrap = true
  protected collects: Resource = JsonResource as Resource
  declare protected collection: Item[]

  constructor(
    protected readonly resources: Array<Record<string, any>>,
    ..._: any[] | never
  ) {}

  static make<T extends typeof ResourceCollection<typeof JsonResource>>(
    this: T,
    ...args: ConstructorParameters<T>
  ) {
    const [resources, ...data] = args
    return new this(resources, ...data)
   }

  dontWrap() {
    this.shouldWrap = false
    return this
  }

  protected makeResource(resource: Record<string, any>): Item {
    return this.collects.make(resource)
  }

  protected serialize() {
    return this.shouldWrap || this.resources instanceof SimplePaginator
      ? {
          [(this.collects as any).wrap]: this.collection,
        }
      : this.collection
  }

  protected makeCollection(resources: Record<string, any>[]) {
    this.collection = resources.map((resource) => this.makeResource(resource).dontWrap())
  }

  toJSON() {
    if (this.resources instanceof SimplePaginator) {
      this.makeCollection((this.resources as any).rows)
      return {
        meta: this.resources.toJSON().meta,
        ...this.serialize(),
      }
    }
    this.makeCollection(this.resources)
    return this.serialize()
  }
}
