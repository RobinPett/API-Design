/**
 * Defines an IoC container
 */
export class IoCContainer {
  /**
   * The services.
   * @type {Map<string}
   */
  #services
  /**
   * The singletons.
   * @type {Map<string>}
   */
  #singletons

  /**
   * Initializes a new instance of the IoCContainer class.
   */
  constructor() {
    this.#services = new Map()
    this.#singletons = new Map()
  }

  /**
   * Registers a service.
   * 
   * @param {string} name 
   * @param {string} definition 
   * @param {object} options 
   * @param options.dependencies
   * @param options.singleton
   * @param options.type
   */
  register(name, definition, { dependencies, singleton, type } = {}) {
    this.#services.set(
      name,
      {
        definition,
        dependencies,
        singleton: !!singleton,
        type: !!type
      }
    )
  }

  /**
   * Resolves a service
   * 
   * @param {string} name 
   * @returns The resolved service
   */
  resolve(name) {
    const service = this.#services.get(name)

    if (!service) {
      throw new Error(`Service ${name} not found`)
    }

    if (typeof service.definition !== 'function' || service.type) {
      return service.definition
    }

    // If not singleton, create and return new instance
    if (!service.singleton) {
      return this.#createInstance(service)
    }

    // If singleton, create and return new single instance
    if (!this.#singletons.has(name)) {
      const instance = this.#createInstance(service)
      this.#singletons.set(name, instance)
    }

    return this.#singletons.get(name)
  }

  /**
   * Creates an instance of a service
   * 
   * @param {object} service 
   * @returns The created instance
   */
  #createInstance(service) {
    console.log('Creating instance of', service)
    const args = service.dependencies?.map((dependency) => this.resolve(dependency)) || []
    return new service.definition(...args)
  }
}