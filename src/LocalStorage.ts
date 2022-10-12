import { Storage } from "./Storage"
import { serialize, deserialize } from "./serialization"

const TEST_KEY = "__LOCALSTORAGE_TEST_KEY__"
const TEST_VALUE = "__LOCALSTORAGE_TEST_VALUE__"

export class LocalStorage extends Storage {
  static get isAvailable(): boolean {
    try {
      if (typeof window.localStorage === "object") {
        window.localStorage.setItem(TEST_KEY, TEST_VALUE)
        if (window.localStorage.getItem(TEST_KEY) === TEST_VALUE) {
          window.localStorage.removeItem(TEST_KEY)
          return true
        }
      }
    } catch {}

    return false
  }

  protected clearStorage() {
    localStorage.removeItem(this.storageKey)
  }

  protected readStorage() {
    const marshalledStorage = localStorage.getItem(this.storageKey)
    return deserialize(marshalledStorage)
  }

  protected writeStorage() {
    localStorage.setItem(this.storageKey, serialize(this.storage))
  }
}
