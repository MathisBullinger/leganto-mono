const fs = require('fs')
const path = require('path')
const { uncapitalize } = require('facula/case')

const typeFile = path.resolve(__dirname, '../src/api/graphql/types.ts')

const content = fs.readFileSync(typeFile, 'utf-8')

const queries = content
  .match(/type\s[a-z0-0_]+Query\s=/gi)
  .map(v => v.split(' ')[1])
  .map(v => `  ${uncapitalize(v.replace(/Query$/, ''))}: [${v}, ${v}Variables]`)
  .join(';\n')

const patched = `${content}\n\nexport type Queries = {
${queries}
}`

fs.writeFileSync(typeFile, patched)
