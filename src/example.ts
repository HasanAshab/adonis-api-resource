import { ResourceCollection } from './resource_collection.js'
import { JsonResource } from './json_resource.js'


class Test extends JsonResource {
    constructor(protected readonly resource: Record<string, any>, protected readonly foo: string) {
      super(resource)
    }
  
  
    public serialize() {
      return this.resource.toJSON()
    }
  }
  
  
  
  class TestCollection extends ResourceCollection<typeof Test> {
    protected makeResource(resource: Record<string, any>): JsonResource {
      return new this.collects(resource, 'foo')
    }
  
    public serialize() {
      return {
        data: this.collection
      }
    }
  }