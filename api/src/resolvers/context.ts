export const createContext = () => {
  const headers: [string, string][] = []

  return {
    addHeader(name: string, value: string) {
      headers.push([name, value])
    },
    getHeaders() {
      const multiValue = new Set(
        headers
          .map(([name]) => name)
          .filter((name, i, list) => list.indexOf(name) !== i)
      )

      const singleValue = Object.fromEntries(
        headers.filter(([name]) => !multiValue.has(name))
      )

      const multiValueHeaders = Object.fromEntries(
        [...multiValue].map(name => [
          name,
          headers.filter(([key]) => key === name).map(([, value]) => value),
        ])
      )

      return {
        headers: singleValue,
        multiValueHeaders,
      }
    },
  }
}

export type Context = ReturnType<typeof createContext>
