const fs = require('node:fs')
const data = require('./data')

// Config
const buildDir = './folders'

// Utils
function l (...args) {
  console.log(...args)
}

// https://stackoverflow.com/questions/9705194/replace-special-characters-in-a-string-with-underscore
// https://stackoverflow.com/questions/7635952/javascript-how-to-remove-all-extra-spacing-between-words
function normalizeFilename (str) {
  return str.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, " ").replace(/^\s+|\s+$/g, '')
}

// Remove existing folder
// https://nodejs.org/en/learn/manipulating-files/working-with-folders-in-nodejs
function clearBuildDir () {
  fs.rmSync(buildDir, {
    recursive: true,
    force: true
  }, err => {
    if (err) {
      throw err;
    }

    l(`Build directory deleted`);
  });

}

function createBuildDir () {
  fs.mkdirSync(buildDir, { recursive: true })
  l(`Build directory created`);
}

function createDir (path) {
  fs.mkdirSync(`${buildDir}/${path}`, { recursive: true })
}

function getSubDir (...pathSegments) {
  return pathSegments.map(normalizeFilename).join('/')
}

function writeTextFile (path, content) {
  const fullPath = `${buildDir}/${path}`

  fs.writeFileSync(fullPath, content)
  console.log(`File ${path} saved.`)
}



// Text content
function composeReadme () {
  const rows = data.gameIds.map(([name, id]) => {
    return `|${name}|${id}|`
  }).join('\n')

  return `# ScummVM game IDs

Compatibility version ${data.compatibilityVersion}: ${data.docsUrl}

|Game name|ScummVM ID|
----------------------
${rows}
`
}

function composeIdFile (id) {
  return id
}

function composeGameReadme (name, id) {
  return `Put game files of ${name} (id ${id}) into this folder.`
}



// Build process
function build () {
  clearBuildDir()
  createBuildDir()

  // Write Readme
  writeTextFile('README.txt', composeReadme())

  // Each game
  data.gameIds.forEach(([name, id]) => {
    const dir = getSubDir(name)

    // Create folder
    createDir(dir)

    // Create folder with instructions
    writeTextFile(`${dir}/PUT GAME FILES HERE.txt`, composeGameReadme(name, id))

    // Create mapper file for ScummVM
    writeTextFile(`${dir}.scummvm`, composeIdFile(id))

  })
}

// Actually run the build
build()
