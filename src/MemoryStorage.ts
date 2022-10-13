import { Storage } from "./Storage"

export class MemoryStorage extends Storage {
  static get isAvailable(): boolean {
    return true
  }

  protected clearStorage() { }
  protected readStorage() { return this.storage ?? {} }
  protected writeStorage() { }
}

