#!/usr/bin/env node
// @flow
import fs from 'fs'
import config from './config'
import Cli from './cli'

fs.readdir(config.sourceFilesPath, (err, files) => {
  if (files.length % 2 === 0) {
    files.forEach((file) => {
      const execute = new Cli()
      execute.readFiles(config.sourceFilesPath + file, config.delimiter)
    })
  } else {
    console.log('Missing files')
  }
})
