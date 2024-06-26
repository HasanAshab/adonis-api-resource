import { AnonymousCollectionBuilder } from '../anonymous_collection_builder.js'
import { JsonResource } from './json_resource.js'
import { SimplePaginator } from '@adonisjs/lucid/database'

export class ResourceCollection<
  Resource extends typeof JsonResource<any>,
  Item = InstanceType<Resource>,
  Data extends object = Item extends JsonResource<infer V> ? V : never,
> {
  /**
   * Creates a collection of anonymous resources for a json resource.
   *
   * @param {Resource} jsonResource - The resource class to use for collecting
   */
  static for<Resource extends typeof JsonResource<any>>(jsonResource: Resource) {
    return new AnonymousCollectionBuilder(jsonResource)
  }

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
  protected declare collection: Item[]

  constructor(protected resources: Array<Data>) {}

  /**
   *  Dont wrap the collection in the response
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
  protected makeResource(resource: Data) {
    return new this.collects(resource)
  }

  /**
   * Creates collection of resources.
   *
   * @param {Record<string, any>[]} resources -
   * @return {void}
   */
  protected makeCollection(resources: Data[]) {
    this.collection = resources.map((resource) => this.makeResource(resource).dontWrap() as Item)
  }

  /**
   * Serializes the collection.
   *
   * @return {object} the serialized resource
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
