import { Storage } from "./Storage"
import { serialize, deserialize } from "./serialization"

const TEST_KEY = "__SESSIONSTORAGE_TEST_KEY__"
const TEST_VALUE = "__SESSIONSTORAGE_TEST_VALUE__"

export class SessionStorage extends Storage {
  static get isAvailable(): boolean {
    try {
      if (typeof window.sessionStorage === "object") {
        window.sessionStorage.setItem(TEST_KEY, TEST_VALUE)
        if (window.sessionStorage.getItem(TEST_KEY) === TEST_VALUE) {
          window.sessionStorage.removeItem(TEST_KEY)
          return true
        }
      }
    } catch { }

    return false
  }

  protected clearStorage() {
    sessionStorage.removeItem(this.storageKey)
  }

  protected readStorage() {
    return deserialize(sessionStorage.getItem(this.storageKey))
  }

  protected writeStorage() {
    sessionStorage.setItem(this.storageKey, serialize(this.storage))
  }
}
