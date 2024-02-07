import app from '@adonisjs/core/services/app'
import type { JsonResource } from '../src/resources/json_resource'


let JsonResourceClass: JsonResource

/**
 * Returns a singleton JsonResource class 
 * from the container
 */
await app.booted(async () => {
  JsonResourceClass = await app.container.make('json_resource')
})

export { JsonResourceClass as default }