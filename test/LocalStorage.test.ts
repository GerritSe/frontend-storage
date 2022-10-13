import { LocalStorage } from "../src/LocalStorage"

describe("LocalStorage", () => {
  afterEach(() => {
    jest.restoreAllMocks()
    localStorage.clear()
  })

  describe(".isAvailable", () => {
    it("returns true", () => {
      expect(LocalStorage.isAvailable).toBe(true)
    })

    describe("with local storage deactivated", () => {
      it("returns false", () => {
        jest.spyOn(window, "localStorage", "get").mockReturnValue({
          clear: () => { },
          getItem: () => { return null },
          key: () => { return null },
          length: 0,
          removeItem: () => { },
          setItem: () => { }
        })
        expect(LocalStorage.isAvailable).toBe(false)
      })
    })

    describe("with no local storage at all", () => {
      it("returns false", () => {
        jest.spyOn(window, "localStorage", "get").mockImplementation()
        expect(LocalStorage.isAvailable).toBe(false)
      })
    })
  })

  describe("#set", () => {
    it("writes to local storage", () => {
      const uiStorage = new LocalStorage("ui")
      const optionsStorage = new LocalStorage("options")

      uiStorage.set("darkMode", true)

      expect(localStorage.getItem("ui")).toEqual('{"darkMode":true}')

      optionsStorage.set("preference", "value")
      uiStorage.set("fullscreen", false)

      expect(localStorage.getItem("ui")).toEqual('{"darkMode":true,"fullscreen":false}')
      expect(localStorage.getItem("options")).toEqual('{"preference":"value"}')
    })
  })

  describe("#get", () => {
    it("returns the value", () => {
      localStorage.setItem("ui", '{"darkMode":true,"fullscreen":false}')

      const uiStorage = new LocalStorage("ui")
      const optionsStorage = new LocalStorage("options")

      expect(uiStorage.get("darkMode")).toBe(true)
      expect(uiStorage.get("fullscreen")).toBe(false)
      expect(optionsStorage.get("darkMode")).not.toBeDefined()
    })
  })

  describe("#remove", () => {
    it("removes the value from local storage", () => {
      localStorage.setItem("ui", '{"darkMode":true}')

      const uiStorage = new LocalStorage("ui")

      expect(uiStorage.get("darkMode")).toBe(true)

      uiStorage.remove("darkMode")

      expect(uiStorage.get("darkMode")).not.toBeDefined()
      expect(localStorage.getItem("ui")).toEqual('{}')
    })
  })

  describe("#clear", () => {
    it("removes the item from local storage", () => {
      localStorage.setItem("ui", '{"darkMode":true,"fullscreen":false}')

      new LocalStorage("ui").clear()

      expect(localStorage.getItem("ui")).toBe(null)
    })
  })

  describe("#refresh", () => {
    it("rereads from local storage", () => {
      localStorage.setItem("ui", '{"darkMode":true,"fullscreen":false}')

      const uiStorage = new LocalStorage("ui")

      localStorage.setItem("ui", '{"darkMode":false}')

      expect(uiStorage.get("darkMode")).toEqual(true)
      expect(uiStorage.get("fullscreen")).toEqual(false)

      uiStorage.refresh()

      expect(uiStorage.get("darkMode")).toEqual(false)
      expect(uiStorage.get("fullscreen")).not.toBeDefined()
    })
  })
})
