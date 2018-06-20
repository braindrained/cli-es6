// @flow
import colors from 'colors'
import inquirer from 'inquirer'
import config from './config'
import { checkOccurence, questions, elaborateByType } from './utils'

export const startProcess = () => {
  inquirer
    .prompt(questions[1])
    .then(answers => {
      if (answers.operation == 'Yes') {
        elaborateByType(config.sourceFilesPath)
      } else {
        process.exit()
      }
    })
}