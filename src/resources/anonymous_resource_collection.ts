import { ResourceCollection } from './resource_collection.js'
import { JsonResource } from './json_resource.js'

export class AnonymousResourceCollection extends ResourceCollection<typeof JsonResource> {
  constructor(
    protected readonly resources: any,
    protected collects: typeof JsonResource
  ) {
    super(resources)
  }
}
