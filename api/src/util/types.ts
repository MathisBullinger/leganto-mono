export type RequireFields<T, K extends keyof T> = Partial<Omit<T, K>> & {
  [F in K]-?: T[F]
}
