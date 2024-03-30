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
   *  Dont wrap the collection in the response
   */
  dontWrap() {
    this.shouldWrap = false
    return this
  }

  /**
   * Serializes the resource.
   *
   * @return {object} the serialized resource
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
   * @param {boolean} condition - If true then return the value
   * @param {unknown | (() => unknown)} value - The value to return
   * @return {unknown} - The value
   */
  protected when(condition: boolean, value: unknown | (() => unknown)) {
    if (!condition) return
    return typeof value === 'function' ? value() : value
  }
}
