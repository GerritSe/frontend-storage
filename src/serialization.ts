export function serialize(data: object): string {
  return JSON.stringify(data)
}

export function deserialize(json: string | null): Record<string, any> {
  if (json == null) return {}

  try {
    return JSON.parse(json)
  } catch {
    return {}
  }
}
