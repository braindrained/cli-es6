#!/usr/bin/env node
// @flow
import fs from 'fs'
import program from 'commander'
import colors from 'colors'
import inquirer from 'inquirer'
import config from './config'
import { startProcess } from './startprocess'
import { checkOccurence, questions, readdirAsync, deleteFile, createOnError } from './utils'

program
  .command('check')
  .alias('ck')
  .description('Controlla lista dei files')
  .action(() => {
    try {
      fs.readdir(config.sourceFilesPath, (err, files) => {
        if (err) {
          createOnError(err, config.sourceFilesPath)
        } else {
          if (files.length % 2 === 0 && files.length != 0) {
            console.log(colors.blue('************************ Elernco files ************************\n'))
            files.forEach((file, i) => {
              let deviceFile = file.indexOf('Android') != -1 ? 'Android' : file.indexOf('iOs') != -1 ? 'iOs' : 'unknown'
              console.log('%s %s %s %s %s', colors.bold(i+1), '-', colors.blue(deviceFile) , '-', colors.blue(file))
            })
            console.log(colors.blue('\n---------------------------------------------------------------\n'))
            console.log('Files Android:', colors.yellow(checkOccurence(files, 'Android').length))
            console.log('Files iOs:', colors.yellow(checkOccurence(files, 'iOs').length))
            console.log('Files Sconosciuti:', colors.yellow(checkOccurence(files, 'unknown').length))
            console.log(colors.blue('\n---------------------------------------------------------------'))
          } else {
            console.log(colors.red('**************************** Warning ****************************\n'))
            if (files.length == 0) {
              console.log(`Non sono presenti files, controlla il contenuto della cartella ${config.sourceFilesPath}`)
            } else if (!(files.length % 2 === 0)) {
              console.log(`I files non sono pari, controlla il contenuto della cartella ${config.sourceFilesPath}`)
            }
            console.log(colors.red('\n***************************************************************'))
          }            
        }
      })        
    } catch (e) {
      console.log(colors.red('Error: '), e)
    }
  })

program
  .command('run')
  .alias('r')
  .description('Esegue elaborazione files')
  .action(() => {
    
    try {
      readdirAsync(config.destinationFilesPath).then((filenames) => {
        if (filenames.length !=0) {
          inquirer
            .prompt(questions[0])
            .then(function (answers) {
              if (answers.check == 'Sì') {
                return Promise.all(filenames.map(deleteFile))
              } else {
                return Promise.all([])
              }
            }).then((files) => {
              if (files.length != 0) {
                console.log('\nElenco file cancellati')
                files.forEach((item) => {
                  console.log(item)
                })
                console.log('\n')
                startProcess()
              } else {
                process.exit()
              }
            })
        } else {
          startProcess()
        }
      }).catch((err) => {
        createOnError(err, config.destinationFilesPath)
      })
    } catch (e) {
      console.log(colors.red('Error: '), e)
    }
  })
    
program.parse(process.argv)
