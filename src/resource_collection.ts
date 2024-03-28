import { JsonResource } from './json_resource.js'
import { SimplePaginator } from '@adonisjs/lucid/database'

export class ResourceCollection<
  Resource extends typeof JsonResource,
  Item = InstanceType<Resource>
> {
  /**
   * Whether the resource should be wrapped
   * @type {boolean}
   */
  protected shouldWrap = true

  /**
   * The resource class to use for collecting
   * @type {Resource}
   */
  protected collects: Resource = JsonResource as Resource

  /**
   * Collection of collected resources instances.
   * @type {Item[]}
   */
  declare protected collection: Item[]

  constructor(protected readonly resources: Array<Record<string, any>>) {}


  /**
   *  Dont wrap the collection in the response
   *
   *  @param {type} paramName - description of parameter
   *  @return {type} description of return value
   */
  dontWrap() {
    this.shouldWrap = false
    return this
  }

  
  /**
   * Creates a new instance of the `collects` class using the provided `resource` object.
   *
   * @param {Record<string, any>} resource - The resource object to be used for creating the new instance.
   * @return {InstanceType<this['collects']>} - A new instance of the `collects` class.
   */
  protected makeResource(resource: Record<string, any>) {
    return new this.collects(resource)
  }


  
  /**
   * Creates collection of resources.
   * 
   * @param {Record<string, any>[]} resources - 
   * @return {void} 
   */
  protected makeCollection(resources: Record<string, any>[]) {
    this.collection = resources.map((resource) => this.makeResource(resource).dontWrap() as Item)
  }


  /**
   * Serializes the collection.
   *
   * @return {any} the serialized resource
   */
  protected serialize() {
    return this.shouldWrap || this.resources instanceof SimplePaginator
      ? {
          [(this.collects as any).wrap]: this.collection,
        }
      : this.collection
  }

  /**
   * Converts the collection to a JSON representation.
   *
   * @return {object} The JSON representation of the object.
   */
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
