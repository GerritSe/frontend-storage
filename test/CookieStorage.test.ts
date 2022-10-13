import { CookieStorage } from "../src/CookieStorage"

describe("CookieStorage", () => {
  describe(".isAvailable", () => {
    it("returns true", () => {
      expect(CookieStorage.isAvailable).toBe(true)
    })

    describe("with cookies deactivated", () => {
      it("returns false", () => {
        Object.defineProperty(navigator, "cookieEnabled", { value: false })
        expect(CookieStorage.isAvailable).toBe(false)
      })
    })

    describe("with no navigator", () => {
      it("returns false", () => {
        Object.defineProperty(global, "navigator", { value: null })
        expect(CookieStorage.isAvailable).toBe(false)
      })
    })
  })

  describe("#set", () => {
    it("writes a cookie", () => {
      const uiStorage = new CookieStorage("ui")
      const optionsStorage = new CookieStorage("options")
      const cookieSpy = jest.spyOn(document, "cookie", "set")

      uiStorage.set("darkMode", true)
      uiStorage.set("nestedOption", { value: true })

      expect(cookieSpy).toHaveBeenCalledTimes(2)
      expect(cookieSpy).toHaveBeenCalledWith("ui=%7B%22darkMode%22%3Atrue%2C%22nestedOption%22%3A%7B%22value%22%3Atrue%7D%7D; SameSite=Strict; Expires=Tue, 31 Dec 2199 23:00:00 GMT; secure")

      optionsStorage.set("preference", "value")
      uiStorage.set("fullscreen", false)

      expect(cookieSpy).toHaveBeenCalledTimes(4)
      expect(cookieSpy).toHaveBeenCalledWith("options=%7B%22preference%22%3A%22value%22%7D; SameSite=Strict; Expires=Tue, 31 Dec 2199 23:00:00 GMT; secure")
      expect(cookieSpy).toHaveBeenCalledWith("ui=%7B%22darkMode%22%3Atrue%2C%22nestedOption%22%3A%7B%22value%22%3Atrue%7D%2C%22fullscreen%22%3Afalse%7D; SameSite=Strict; Expires=Tue, 31 Dec 2199 23:00:00 GMT; secure")
    })

    describe("insecure cookies", () => {
      it("writes a cookie", () => {
        const uiStorage = new CookieStorage("ui", { secure: false })
        const cookieSpy = jest.spyOn(document, "cookie", "set")

        uiStorage.set("darkMode", true)

        expect(cookieSpy).toHaveBeenCalledTimes(1)
        expect(cookieSpy).toHaveBeenCalledWith("ui=%7B%22darkMode%22%3Atrue%7D; SameSite=Strict; Expires=Tue, 31 Dec 2199 23:00:00 GMT")
      })
    })
  })

  describe("#get", () => {
    it("returns the value", () => {
      jest.spyOn(document, "cookie", "get").mockReturnValue("ui=%7B%22darkMode%22%3Atrue%2C%22nestedOption%22%3A%7B%22value%22%3Atrue%7D%2C%22fullscreen%22%3Afalse%7D; SameSite=Strict; Expires=Tue, 31 Dec 2199 23:00:00 GMT;")

      const uiStorage = new CookieStorage("ui")
      const optionsStorage = new CookieStorage("options")

      expect(uiStorage.get("darkMode")).toBe(true)
      expect(uiStorage.get("nestedOption")).toEqual({ value: true })
      expect(uiStorage.get("fullscreen")).toBe(false)
      expect(optionsStorage.get("darkMode")).not.toBeDefined()
    })
  })

  describe("#remove", () => {
    it("removes the value from the cookie", () => {
      jest.spyOn(document, "cookie", "get").mockReturnValue("ui=%7B%22darkMode%22%3Afalse%7D; SameSite=Strict; Expires=Tue, 31 Dec 2199 23:00:00 GMT;")

      const uiStorage = new CookieStorage("ui")
      const cookieSpy = jest.spyOn(document, "cookie", "set")

      expect(uiStorage.get("darkMode")).toBe(false)

      uiStorage.remove("darkMode")

      expect(uiStorage.get("darkMode")).not.toBeDefined()
      expect(cookieSpy).toHaveBeenCalledTimes(1)
      expect(cookieSpy).toHaveBeenCalledWith("ui=%7B%7D; SameSite=Strict; Expires=Tue, 31 Dec 2199 23:00:00 GMT; secure")
    })
  })

  describe("#clear", () => {
    afterEach(() => {
      jest.useRealTimers()
    })

    it("expires the cookie immediately", () => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date(2022, 10, 1))
      jest.spyOn(document, "cookie", "get").mockReturnValue("")

      const cookieSpy = jest.spyOn(document, "cookie", "set")
      const uiStorage = new CookieStorage("ui")

      uiStorage.clear()

      expect(cookieSpy).toHaveBeenCalledTimes(1)
      expect(cookieSpy).toHaveBeenCalledWith("ui=; Expires=Mon, 31 Oct 2022 23:00:00 GMT")
    })
  })

  describe("#refresh", () => {
    it("reloads from the cookie", () => {
      jest.spyOn(document, "cookie", "get").mockReturnValue("ui=%7B%22darkMode%22%3Afalse%7D")

      const uiStorage = new CookieStorage("ui")

      jest.spyOn(document, "cookie", "get").mockReturnValue("ui=%7B%22darkMode%22%3Atrue%7D")

      expect(uiStorage.get("darkMode")).toBe(false)

      uiStorage.refresh()

      expect(uiStorage.get("darkMode")).toBe(true)
    })
  })
})
