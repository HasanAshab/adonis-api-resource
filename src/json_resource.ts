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


  constructor(protected readonly resource: Record<string, any>) {}

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

  serialize() {
    return this.resource.toJSON?.() ?? this.resource
  }

  toJSON() {
    return this.shouldWrap
      ? {
          [(this.constructor as any).wrap]: this.serialize(),
        }
      : this.serialize()
  }

  protected when(condition: boolean, value: unknown | (() => unknown)) {
    if (!condition) return
    return typeof value === 'function' ? value() : value
  }
}