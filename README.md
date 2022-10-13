# frontend-storage

Abstractions for local storage, session storage and cookies. Write to and read from whatever is available via a single interface.

## Installation

`yarn add frontend-storage`

## Usage

```typescript
import { CookieStorage, LocalStorage, MemoryStorage, SessionStorage, Storage } from "frontend-storage"

// Example factory. Adapt depending on what kind of storage you need.
const storageFactory = (storageKey: string): Storage => {
  if (LocalStorage.isAvailable) return new LocalStorage(storageKey)
  if (CookieStorage.isAvailable) return new CookieStorage(storageKey)

  // Permanent storage not available, fall back to session storage
  if (SessionStorage.isAvailable) return new SessionStorage(storageKey)

  // No session storage available, fall back to in-memory storage
  return new MemoryStorage(storageKey)
}

const storage = storageFactory("uiSettings")

// Set a value.
storage.set("darkMode", true)

// Read a value.
storage.get("darkMode")

// Remove a value.
storage.remove("darkMode")

// Clears all values.
storage.clear()

// Reread data from respective storage.
storage.refresh()
```
