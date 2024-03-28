import { AnonymousResourceCollection } from './anonymous_resource_collection.js'

export class JsonResource {
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
    protected readonly resource: Record<string, any>,
    ..._: any[]
    ) {}

  /**
   * Creates a collection of anonymous resources from an array of resource.
   *
   * @param {Array<Record<string, any>>} resources - The array of records to create the collection from.
   * @return {AnonymousResourceCollection} - The created collection of anonymous resources.
   */
  static collection(resources: Array<Record<string, any>>) {
    return new AnonymousResourceCollection(resources, this)
  }

  /**
   *  Dont wrap the resource in the response
   *
   *  @param {type} paramName - description of parameter
   *  @return {type} description of return value
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
    return this.resource.toJSON?.() ?? this.resource
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