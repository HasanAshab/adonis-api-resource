import { AnonymousResourceCollection } from './resources/anonymous_resource_collection.js'
import { JsonResource } from './resources/json_resource.js'

export class AnonymousCollectionBuilder<
  Resource extends typeof JsonResource<any>,
  Data extends object = InstanceType<Resource> extends JsonResource<infer V> ? V : never,
  MetaData extends any[] = ConstructorParameters<Resource> extends [any, ...infer U] ? U : never,
> {
  protected declare metaArgs: MetaData

  constructor(protected collects: Resource) {}

  meta(...args: MetaData) {
    this.metaArgs = args
    return this
  }

  make(resources: Data[]) {
    return new AnonymousResourceCollection(resources, this.collects, ...this.metaArgs)
  }
}
