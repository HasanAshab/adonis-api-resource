import { AnonymousResourceCollection } from './anonymous_resource_collection.js'

export class JsonResource<Data extends object = Record<string, any>> {
  /**
   * The key used to wrap the resource in the response
   * @type {string}
   */
  static wrap = 'data'

  /**
   * Whether the resource should be wrapped
   * @type {boolean}
   */
  protected shouldWrap = true

  constructor(
    protected resource: Data,
    ..._: any[]
  ) {}

  /**
   * Creates a collection of anonymous resources from an array of resources.
   *
   * @param {Array<Resource>} resources - The array of resources to create the collection from.
   * @return {AnonymousResourceCollection} - The created collection of anonymous resources.
   */
  static collection<
    T extends typeof JsonResource,
    D extends object = InstanceType<T> extends JsonResource<infer V> ? V : never 
  >(
    this: T,
    resources: Array<D>
  ) {
    return new AnonymousResourceCollection(resources, this);
  }

  /**
   *  Dont wrap the collection in the response
   */
  dontWrap() {
    this.shouldWrap = false
    return this
  }

  /**
   * Serializes the resource.
   *
   * @return {any} the serialized resource
   */
  serialize() {
    if ('toJSON' in this.resource && typeof this.resource.toJSON === 'function') {
      return this.resource.toJSON() 
    }
    
    return this.resource
  }

  /**
   * Converts the resource to a JSON representation.
   *
   * @return {object} The JSON representation of the object.
   */
  toJSON() {
    return this.shouldWrap
      ? {
          [(this.constructor as any).wrap]: this.serialize(),
        }
      : this.serialize()
  }

  /**
   * Returns the value if the condition is true, otherwise undefined.
   *
   * @param {boolean} condition - description of parameter
   * @param {unknown | (() => unknown)} value - description of parameter
   * @return {unknown} description of return value
   */
  protected when(condition: boolean, value: unknown | (() => unknown)) {
    if (!condition) return
    return typeof value === 'function' ? value() : value
  }
}
