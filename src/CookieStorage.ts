import { Storage } from "./Storage"
import { deserialize, serialize } from "./serialization"

export class CookieStorage extends Storage {
  static get isAvailable(): boolean {
    return navigator?.cookieEnabled ?? false
  }

  protected clearStorage() {
    document.cookie = `${this.storageKey}=; Expires=${new Date().toUTCString()};`
  }

  protected readStorage() {
    const cookies = document.cookie.split(/;\s?/).reduce((result, cookie) => {
      const separatorIndex = cookie.search("=")
      const key = cookie.slice(0, separatorIndex)
      const value = cookie.slice(separatorIndex + 1)

      result[key] = decodeURIComponent(value)

      return result
    }, {} as Record<string, string>)

    return deserialize(cookies[this.storageKey])
  }

  protected writeStorage() {
    const value = encodeURIComponent(serialize(this.storage))
    const expiryDate = new Date(2200, 0, 1)

    document.cookie = [
      `${this.storageKey}=${value}`,
      "SameSite=Strict",
      "Secure",
      `Expires=${expiryDate.toUTCString()}`
    ].join("; ")
  }
}
