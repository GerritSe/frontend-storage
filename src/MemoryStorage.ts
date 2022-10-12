import { Storage } from "./Storage"

export class MemoryStorage extends Storage {
  static get isAvailable(): boolean {
    return true
  }

  protected clearStorage() { }
  protected readStorage() { return {} }
  protected writeStorage() { }
}

