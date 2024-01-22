const fs = require('node:fs')
const data = require('./data')

// Config
const buildDir = './folders'

// Utils
function l (...args) {
  console.log(...args)
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
  fs.mkdirSync(buildDir)
  l(`Build directory created`);
}

function writeTextFile (path, content) {
  const fullPath = `${buildDir}/${path}`

  fs.writeFileSync(fullPath, content)
  console.log("File has been saved.")
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


// Build process
function build () {
  clearBuildDir()
  createBuildDir()

  // Write Readme
  writeTextFile('README.txt', composeReadme())
}

// Actually run the build
build()
