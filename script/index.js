const fs = require('node:fs')

const conf = require('./conf')
const data = require('../data')

// Config
const buildDir = '../' + conf.buildDir
const gameIds = sortGameIds(data.gameIds)

// Utils
function l (...args) {
  console.log(...args)
}

// https://stackoverflow.com/questions/9705194/replace-special-characters-in-a-string-with-underscore
// https://stackoverflow.com/questions/7635952/javascript-how-to-remove-all-extra-spacing-between-words
function normalizeFilename (str) {
  return str.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, " ").replace(/^\s+|\s+$/g, '')
}

function sortGameIds (list) {
  const l = [...list]
  l.sort((a, b) => {
    if (a[0] < b[0] ){
      return -1;
    }

    if (a[0] < b[0]){
      return 1;
    }

    return 0;  
  })
  return l
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

    l(`Old build directory cleared`);
  });

}

function createBuildDir () {
  fs.mkdirSync(buildDir, { recursive: true })
  l(`New build directory created`);
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
  console.log(`File saved: ${path}`)
}



// Text content
function composeReadme () {
  const rows = gameIds.map(([name, id]) => {
    return `- ${name} (${id})`
  }).join('\n')

  return `ScummVM game IDs

Compatibility version ${data.compatibilityVersion}: ${data.docsUrl}

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
  gameIds.forEach(([name, id]) => {
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
