export abstract class Storage {
  public storage: Record<string, any>

  static get isAvailable() {
    return false
  }

  constructor(public storageKey: string) {
    this.storage = this.readStorage()
  }

  get<T>(key: string): T | void {
    return this.storage[key]
  }

  set<T>(key: string, value: T): void {
    if (this.storage[key] === value) return

    this.storage[key] = value
    this.writeStorage()
  }

  remove(key: string): void {
    delete this.storage[key]
    this.writeStorage()
  }

  clear(): void {
    this.storage = {}
    this.clearStorage()
  }

  refresh(): void {
    this.storage = this.readStorage()
  }

  protected abstract clearStorage(): void
  protected abstract readStorage(): Record<string, any>
  protected abstract writeStorage(): void
}
