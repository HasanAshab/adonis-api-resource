import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import { stubsRoot } from '../stubs/main.js'
import { CommandOptions } from '@adonisjs/core/types/ace'

export default class MakeResource extends BaseCommand {
  static commandName = 'make:resource'
  static description = 'Make a new Api Resource'
  static options: CommandOptions = {
    allowUnknownFlags: true,
  }

  /**
   * The name of the resource file.
   */
  @args.string({ description: 'Name of the resource class' })
  declare name: string

  /**
   * Defines if the resource is a collection.
   */
  @flags.boolean({
    name: 'collection',
    alias: 'c',
    description: '',
  })
  declare collection: boolean

  /**
   * Execute command
   */
  async run(): Promise<void> {
    const codemods = await this.createCodemods()
    await codemods.makeUsingStub(stubsRoot, 'make/resource.stub', {
      flags: this.parsed.flags,
      name: this.name,
    })
  }
}
