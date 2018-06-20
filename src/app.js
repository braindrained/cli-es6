#!/usr/bin/env node
// @flow
import fs from 'fs'
import program from 'commander'
import colors from 'colors'
import inquirer from 'inquirer'
import child_process from 'child_process'

import config from './config'
import { checkOccurence, questions, readdirAsync, deleteFilesAsync, createOnError, startProcess } from './utils'

program
  .command('check')
  .alias('ck')
  .description('Controlla lista dei files')
  .action(() => {
    fs.readdir(config.sourceFilesPath, (err, files) => {
      if (err) {
        createOnError(err, config.sourceFilesPath)
      } else {
        if (files.length != 0) {
          console.log(colors.blue(`------------------------ ${colors.white('Files')} ------------------------\n`))
          files.forEach((file, i) => {
            console.log('%s %s %s', colors.bold(i+1), '-', colors.blue(file))
          })
          console.log(colors.blue('\n---------------------------------------------------------------\n'))
          console.log('Files to process:', colors.yellow(files.length))
          console.log(colors.blue('\n---------------------------------------------------------------'))
        } else {
          console.log(colors.red(`---------------------------- ${colors.white('Warning')} ----------------------------\n`))
          console.log(`There's no files, check the content of ${config.sourceFilesPath} directory`)
          console.log(colors.red('\n---------------------------------------------------------------'))
        }
      }
    })
  })

program
  .command('run')
  .alias('r')
  .description('Esegue elaborazione files')
  .action(() => {
    readdirAsync(config.sourceFilesPath).then((files) => {
      if (files.length != 0) {
        console.log(colors.blue(`------------------------ ${colors.white('Files')} ------------------------\n`))
        let deviceFiles = []
        files.forEach((file, i) => {
          console.log('%s %s %s', colors.bold(i+1), '-', colors.blue(file))
        })
        console.log(colors.blue('\n---------------------------------------------------------------\n'))
        console.log('Files to process:', colors.yellow(files.length))
        console.log(colors.blue('\n---------------------------------------------------------------'))
        
        readdirAsync(config.destinationFilesPath).then((filenames) => {
          if (filenames.length !=0) {
            inquirer
              .prompt(questions[0])
              .then((answers) => {
                if (answers.check == 'Yes') {
                  return Promise.all(filenames.map(deleteFilesAsync))
                } else {
                  return Promise.all([])
                }
              }).then((files) => {
                if (files.length != 0) {
                  console.log('\nDeleted files list')
                  files.forEach((item) => {
                    console.log(item)
                  })
                  console.log('\n')
                  startProcess(config.sourceFilesPath)
                } else {
                  process.exit()
                }
              })
          } else {
            startProcess(config.sourceFilesPath)
          }
        }).catch((err) => {
          createOnError(err, config.destinationFilesPath)
        })
      } else {
        console.log(colors.red(`---------------------------- ${colors.white('Warnin')} ----------------------------\n`))
        console.log(`There's no files, check the content of ${config.sourceFilesPath} directory`)
        console.log(colors.red('\n---------------------------------------------------------------'))
      }
    }).catch((err) => {
      createOnError(err, config.sourceFilesPath)
    })
  })
    
program.parse(process.argv)
