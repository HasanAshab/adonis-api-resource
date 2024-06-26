import { ResourceCollection } from './resource_collection.js'
import { JsonResource } from './json_resource.js'

export class AnonymousResourceCollection extends ResourceCollection<typeof JsonResource> {
  constructor(
    protected resources: Array<Record<string, any>>,
    protected collects: typeof JsonResource,
    protected meta: any[] = []
  ) {
    super(resources)
  }

  makeResource(resource: Record<string, any>) {
    return new this.collects(resource, ...this.meta)
  }
}
