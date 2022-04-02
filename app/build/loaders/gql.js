const { print } = require('graphql/language/printer')

module.exports = content =>
  `${content}\n\nmodule.exports.string = ${JSON.stringify(
    print(eval(content))
  )}`
