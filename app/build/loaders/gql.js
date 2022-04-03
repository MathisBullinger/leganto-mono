const { print } = require('graphql/language/printer')

module.exports = content =>
  `${content}\n\nmodule.exports.string = ${JSON.stringify(
    /* eslint-disable-next-line no-eval */
    print(eval(content))
  )}`
