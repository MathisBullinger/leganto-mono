const classNames = (...classes: (string | undefined | false)[]) =>
  classes.filter(v => typeof v === 'string').join(' ')

export default classNames
