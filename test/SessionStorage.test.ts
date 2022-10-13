import { SessionStorage } from "../src/SessionStorage"

describe("SessionStorage", () => {
  afterEach(() => {
    jest.restoreAllMocks()
    sessionStorage.clear()
  })

  describe(".isAvailable", () => {
    it("returns true", () => {
      expect(SessionStorage.isAvailable).toBe(true)
    })

    describe("with session storage deactivated", () => {
      it("returns false", () => {
        jest.spyOn(window, "sessionStorage", "get").mockReturnValue({
          clear: () => { },
          getItem: () => { return null },
          key: () => { return null },
          length: 0,
          removeItem: () => { },
          setItem: () => { }
        })
        expect(SessionStorage.isAvailable).toBe(false)
      })
    })

    describe("with no session storage at all", () => {
      it("returns false", () => {
        jest.spyOn(window, "sessionStorage", "get").mockImplementation()
        expect(SessionStorage.isAvailable).toBe(false)
      })
    })
  })

  describe("#set", () => {
    it("writes to session storage", () => {
      const uiStorage = new SessionStorage("ui")
      const optionsStorage = new SessionStorage("options")

      uiStorage.set("darkMode", true)

      expect(sessionStorage.getItem("ui")).toEqual('{"darkMode":true}')

      optionsStorage.set("preference", "value")
      uiStorage.set("fullscreen", false)

      expect(sessionStorage.getItem("ui")).toEqual('{"darkMode":true,"fullscreen":false}')
      expect(sessionStorage.getItem("options")).toEqual('{"preference":"value"}')
    })
  })

  describe("#get", () => {
    it("returns the value", () => {
      sessionStorage.setItem("ui", '{"darkMode":true,"fullscreen":false}')

      const uiStorage = new SessionStorage("ui")
      const optionsStorage = new SessionStorage("options")

      expect(uiStorage.get("darkMode")).toBe(true)
      expect(uiStorage.get("fullscreen")).toBe(false)
      expect(optionsStorage.get("darkMode")).not.toBeDefined()
    })
  })

  describe("#remove", () => {
    it("removes the value from session storage", () => {
      sessionStorage.setItem("ui", '{"darkMode":true}')

      const uiStorage = new SessionStorage("ui")

      expect(uiStorage.get("darkMode")).toBe(true)

      uiStorage.remove("darkMode")

      expect(uiStorage.get("darkMode")).not.toBeDefined()
      expect(sessionStorage.getItem("ui")).toEqual('{}')
    })
  })

  describe("#clear", () => {
    it("removes the item from session storage", () => {
      sessionStorage.setItem("ui", '{"darkMode":true,"fullscreen":false}')

      new SessionStorage("ui").clear()

      expect(sessionStorage.getItem("ui")).toBe(null)
    })
  })

  describe("#refresh", () => {
    it("rereads from session storage", () => {
      sessionStorage.setItem("ui", '{"darkMode":true,"fullscreen":false}')

      const uiStorage = new SessionStorage("ui")

      sessionStorage.setItem("ui", '{"darkMode":false}')

      expect(uiStorage.get("darkMode")).toEqual(true)
      expect(uiStorage.get("fullscreen")).toEqual(false)

      uiStorage.refresh()

      expect(uiStorage.get("darkMode")).toEqual(false)
      expect(uiStorage.get("fullscreen")).not.toBeDefined()
    })
  })
})
