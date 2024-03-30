import { ResourceCollection } from './resources/resource_collection.js'
import { JsonResource } from './resources/json_resource.js'


interface User {
  id: number
  name: string
  email: string
}

class Test extends JsonResource<User> {
  constructor(
    protected resource: User,
    protected foo: string,
    protected bar: number
  ) {
    super(resource)
  }

  serialize() {
    return this.resource
  }
}


ResourceCollection.for(Test).make([
  {
    id: 1,
    name: 'Hasan',
    email: 'h@h.com'
  }
])





class TestCollection extends ResourceCollection<typeof Test> {
  protected makeResource(resource: User) {
    return new this.collects(resource, 'foo', 1)
  }

  serialize() {
    return {
      data: this.collection,
    }
  }
}

new TestCollection([
  {
    id: 1,
    name: 'Hasan',
    email: 'h@h.com'
  },
])
