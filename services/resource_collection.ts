import app from '@adonisjs/core/services/app'
import type { ResourceCollection } from '../src/resources/resource_collection'


let ResourceCollectionClass: ResourceCollection

/**
 * Returns a singleton ResourceCollection class 
 * from the container
 */
await app.booted(async () => {
  ResourceCollectionClass = await app.container.make('resource_collection')
})

export { ResourceCollectionClass as default }