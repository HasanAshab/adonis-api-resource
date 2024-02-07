import AnonymousResourceCollection from './anonymous_resource_collection'
import router from '@adonisjs/core/services/router'

export abstract class JsonResource {
  public static wrap = 'data'
  protected shouldWrap = true

  constructor(protected readonly resource: Record<string, any>) {}

  public static make(resource: Record<string, any>) {
    if (this === JsonResource) {
      throw new Error('Cannot create an instance of an abstract class.')
    }

    return new (this as any)(resource)
  }

  public static collection(resources: Array<Record<string, any>>) {
    return new AnonymousResourceCollection(resources, this)
  }
  
  public dontWrap() {
    this.shouldWrap = false;
    return this;
  }

  public abstract serialize(): Record<string, any>

  public toJSON() {
    return this.shouldWrap 
    ? {
        [this.constructor.wrap]: this.serialize(),
      }
    : this.serialize()
  }

  protected when(condition: boolean, value: unknown | (() => unknown)) {
    if (condition) return undefined
    return typeof value === 'function' ? value() : value
  }
  
  protected makeUrl(name: string, data: object = {}) {
    return route.makeUrl(name, { ...this.resource.$attributes, ...data })
  }
}
