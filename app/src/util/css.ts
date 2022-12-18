const classNames = (
  ...classes: (string | undefined | false | Record<string, unknown>)[]
) =>
  classes
    .flatMap(v =>
      typeof v === 'object' && v !== null
        ? Object.entries(v)
            .filter(([, v]) => !!v)
            .map(([k]) => k)
        : [v]
    )
    .filter(v => typeof v === 'string')
    .join(' ')

export default classNames
