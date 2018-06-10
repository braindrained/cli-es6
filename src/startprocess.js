import colors from 'colors'
import inquirer from 'inquirer'
import config from './config'
import { checkOccurence, processFiles, questions, questionsCheck } from './utils'

export const startProcess = (() => {
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