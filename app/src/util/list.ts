export const groupBy = <T>(items: T[], key: keyof T): T[][] => {
  const byKey = new Map<T[keyof T], T[]>()

  for (const item of items) {
    if (!byKey.has(item[key])) byKey.set(item[key], [])
    byKey.get(item[key])!.push(item)
  }

  return [...byKey.values()]
}
