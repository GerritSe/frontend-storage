import { MemoryStorage } from "../src/MemoryStorage"

describe("MemoryStorage", () => {
  describe(".isAvailable", () => {
    it("returns true", () => {
      expect(MemoryStorage.isAvailable).toBe(true)
    })
  })

  describe("#get, #set", () => {
    it("writes to memory", () => {
      const uiStorage = new MemoryStorage("ui")
      const optionsStorage = new MemoryStorage("options")

      uiStorage.set("darkMode", true)
      uiStorage.set("fullscreen", false)
      optionsStorage.set("preference", "value")

      expect(uiStorage.get("darkMode")).toBe(true)
      expect(uiStorage.get("fullscreen")).toBe(false)
      expect(optionsStorage.get("preference")).toEqual("value")
    })
  })

  describe("#remove", () => {
    it("removes the value from memory", () => {
      const uiStorage = new MemoryStorage("ui")

      uiStorage.set("darkMode", true)

      expect(uiStorage.get("darkMode")).toBe(true)

      uiStorage.remove("darkMode")

      expect(uiStorage.get("darkMode")).not.toBeDefined()
    })
  })

  describe("#clear", () => {
    it("clears all values", () => {
      const uiStorage = new MemoryStorage("ui")

      uiStorage.set("darkMode", true)
      uiStorage.set("fullscreen", false)

      expect(uiStorage.get("darkMode")).toBe(true)
      expect(uiStorage.get("fullscreen")).toBe(false)

      uiStorage.clear()

      expect(uiStorage.get("darkMode")).not.toBeDefined()
      expect(uiStorage.get("fullscreen")).not.toBeDefined()
    })
  })

  describe("#refresh", () => {
    it("keeps the values", () => {
      const uiStorage = new MemoryStorage("ui")

      uiStorage.set("darkMode", true)
      uiStorage.set("fullscreen", false)

      expect(uiStorage.get("darkMode")).toBe(true)
      expect(uiStorage.get("fullscreen")).toBe(false)

      uiStorage.refresh()

      expect(uiStorage.get("darkMode")).toBe(true)
      expect(uiStorage.get("fullscreen")).toBe(false)
    })
  })
})
