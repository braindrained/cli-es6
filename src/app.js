#!/usr/bin/env node
// @flow
import fs from 'fs'
import program from 'commander'
import colors from 'colors'
import async from 'async'
import inquirer from 'inquirer'
import config from './config'
import { checkOccurence, processFiles, questions } from './utils'

program
    .command('check')
    .alias('ck')
    .description('Controlla lista dei files')
    .action(() => {
      try {
        fs.readdir(config.sourceFilesPath, (err, files) => {
          if (err) {
            console.log(colors.red('**************************** Error ****************************'))
            console.log('\n')
            console.log(`errore nella lettura della cartella ${config.sourceFilesPath}`)
            console.log(err)
            console.log('\n')
            console.log(colors.red('***************************************************************'))
          } else {
            if (files.length % 2 === 0 && files.length != 0) {
              console.log(colors.green('************************ Elernco files ************************'))
              console.log('\n')
              let deviceFileList = []
              files.forEach((file, i) => {
                let deviceFile = file.indexOf('Android') != -1 ? 'Android' : file.indexOf('iOs') != -1 ? 'iOs' : 'unknown'
                console.log('%s %s %s %s %s', colors.bold(i+1), '-', colors.green(deviceFile) , '-', colors.blue(file))
                deviceFileList.push(deviceFile)
              })
              console.log('\n')

              console.log(colors.green('---------------------------------------------------------------'))
              console.log('\n')
              console.log('Files Android:', colors.yellow(checkOccurence(deviceFileList, 'Android')))
              console.log('Files iOs:', colors.yellow(checkOccurence(deviceFileList, 'iOs')))
              console.log('Files Sconosciuti:', colors.yellow(checkOccurence(deviceFileList, 'unknown')))
              console.log('\n')
              console.log(colors.green('---------------------------------------------------------------'))
              
            } else {
              console.log(colors.red('**************************** Error ****************************'))
              console.log('\n')
              if (files.length == 0) {
                console.log(`Non sono presenti files, controlla il contenuto della cartella ${config.sourceFilesPath}`)
              } else if (!(files.length % 2 === 0)) {
                console.log(`I files non sono pari, controlla il contenuto della cartella ${config.sourceFilesPath}`)
              }
              console.log('\n')
              console.log(colors.red('***************************************************************'))
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
      
      inquirer
        .prompt(questions)
        .then(function (answers) {
          if (answers.operation != 'Tutti') {
            console.log(colors.green(`************************ ${answers.operation} files ************************`))
            console.log('\n')
            processFiles(config.sourceFilesPath, answers.operation).then((result) => {
              console.log('\n')
              if (result.succeed) {
                console.log('%s %s %s', 'File', colors.green(result.fileType), result.message);
              } else {
                console.log(colors.red(result.message));
              }
              console.log('\n')
              console.log(colors.green('---------------------------------------------------------------'))
            })
          } else {
           console.log(colors.green('************************ Android files ************************'))
           console.log('\n')
           processFiles(config.sourceFilesPath, 'Android').then((result) => {
             console.log('\n')
             if (result.succeed) {
               console.log('%s %s %s', 'File', colors.green(result.fileType), result.message);
             } else {
               console.log(colors.red(result.message));
             }
             console.log('\n')
             console.log(colors.green('---------------------------------------------------------------'))
             console.log('\n')
           }).then(() => {
             console.log(colors.green('************************** iOs files **************************'))
             console.log('\n')
             processFiles(config.sourceFilesPath, 'iOs').then((result) => {
               if (result.succeed) {
                 console.log('%s %s %s', 'File', colors.green(result.fileType), result.message);
               } else {
                 console.log(colors.red(result.message));
               }
               console.log('\n')
               console.log(colors.green('---------------------------------------------------------------'))
             })
           })
          }
        })
    })
    
program.parse(process.argv)
