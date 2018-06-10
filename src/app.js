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
            processFiles(config.sourceFilesPath, answers.operation)
          } else {
            var promisesToMake = [processFiles(config.sourceFilesPath, 'Android'), processFiles(config.sourceFilesPath, 'iOs')];
            var promises = Promise.all(promisesToMake);

            promises.then(function(results) {
             console.log('promises', results);
            });
          }
        });
      
      /*readdirAsync(config.sourceFilesPath).then(function (filenames){
          let filesPath = []
          filenames.forEach((item) => {
            filesPath.push(config.sourceFilesPath + item)
          })
          return Promise.all(filesPath.map(getFile));
      }).then(function (files){
          var summaryFiles = [];
          files.forEach(function(file, i) {
            file.forEach(function(row, i) {
              summaryFiles.push(row)
            })
          });
          
          summaryFiles = summaryFiles.sort((a,b) => {
            return new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime();
          });
          
          fs.appendFile("./files/destination/result.json", JSON.stringify(summaryFiles, null, 4), function(err) {
              if(err) {
                return console.log(err);
              }
              console.log("The file was appended!");
          });
          console.log(summaryFiles);
      });*/
      
        /*fs.readdir(config.sourceFilesPath, (err, files) => {
          
          //if (files.length % 2 === 0) {
          let androidFileList = []
          let iOsFileList = []
          files.forEach((file) => {
            if (file.indexOf('Android') != -1) {
              androidFileList.push(file)
            } else if (file.indexOf('iOs') != -1) {
              iOsFileList.push(file)
            }
            //const execute = new Cli()
            //execute.readFiles(config.sourceFilesPath + file, config.delimiter)
          })
          
          console.log(androidFileList)
          console.log(iOsFileList)
          
          var done = function(err, result) {
            if (err) console.log(err)
            console.log('processed successfully', result);
          };

          async.waterfall([
            readFiles(androidFileList),
            function2,
            function3
            //readFiles(iOsFileList),
            //writeFiles
          ], done);
          
          //} else {
//            console.log('Missing files')
          //}
        })*/
    })
    
program.parse(process.argv)
