import { AnonymousResourceCollection } from './anonymous_resource_collection.js'

export class JsonResource {
  static wrap = 'data'
  protected shouldWrap = true

  constructor(protected readonly resource: Record<string, any>) {}

  static make<T extends typeof JsonResource>(this: T, ...args: ConstructorParameters<T>) {
    return new this(...data)
  }

  static collection(resources: Array<Record<string, any>>) {
    return new AnonymousResourceCollection(resources, this)
  }

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