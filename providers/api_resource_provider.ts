import type { ApplicationService } from '@adonisjs/core/types'


/**
 * Extending AdonisJS types
 */
declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    json_resource: typeof import('../src/resources/json_resource').JsonResource,
    resource_collection: typeof import('../src/resources/resource_collection').ResourceCollection,
  }
}

export default class ApiResourceProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton('json_resource', () => {
      const { JsonResource } = await import('../src/resources/json_resource')
      return JsonResource
    })
    
    this.app.container.singleton('resource_collection', () => {
      const { ResourceCollection } = await import('../src/resources/resource_collection')
      return ResourceCollection
    })
  }
}