import { JsonResource } from './json_resource.js'
import { SimplePaginator } from '@adonisjs/lucid/database'

export class ResourceCollection<
  Resource extends typeof JsonResource,
  Item = InstanceType<Resource>
> {
  protected shouldWrap = true
  protected collects: Resource = JsonResource as Resource
  declare protected collection: Item[]

  constructor(protected readonly resources: Array<Record<string, any>>) {}


  dontWrap() {
    this.shouldWrap = false
    return this
  }

  protected makeResource(resource: Record<string, any>) {
    return new this.collects(resource)
  }


  protected makeCollection(resources: Record<string, any>[]) {
    this.collection = resources.map((resource) => this.makeResource(resource).dontWrap() as Item)
  }


  protected serialize() {
    return this.shouldWrap || this.resources instanceof SimplePaginator
      ? {
          [(this.collects as any).wrap]: this.collection,
        }
      : this.collection
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
