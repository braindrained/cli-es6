// @flow
import fs from 'fs'
import colors from 'colors'
import inquirer from 'inquirer'
import child_process from 'child_process'
import Table from 'cli-table'

import config from './config'
import { elaborateFile } from './elaboratefile'
import { processFiles } from './processfiles'

export const checkOccurence = (array: Array<string>, value: string): Array<string> => {
  return array.filter((val) => { return val.indexOf(value) != -1 })
}

export const table = new Table({
  chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
})

export const questions = [
  { type: 'list', name: 'check', message: 'The destination directory is not empty, delete files?', choices: ['Yes', 'No'] },
  { type: 'list', name: 'operation', message: 'Do you want to proceed?', choices: ['Yes', 'No'] },
  { type: 'list', name: 'check', message: 'Directories does not exist, do you want to create them?', choices: ['Yes', 'No'] }
]

export const deleteFilesAsync = (dirname: string) => {
  return new Promise((resolve, reject) => {
    fs.unlink((dirname), err => {
      if (err) {
        reject(err)
      } else {
        resolve(dirname)
      }
    })
  })
}

export const readdirAsync = (dirname: string) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, filenames) => {
      if (err) {
        reject(err)
      } else {
        let filesPath = []
        filenames.forEach((file) => {
          filesPath.push(dirname + file)
        })
        resolve(filesPath)
      }
    })
  })
}

export const readFileAsync = (filename: string) => {
  return new Promise((resolve, reject) => {
    elaborateFile(filename, config.delimiter, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const convertToCsv = (docs: Array<Object>, rowWithMoreColumns: Object) => {
  if (!(Array.isArray(docs) && docs.length > 0)) {
    return
  }

  let header = Object.keys(rowWithMoreColumns.row).join(",")

  let body = docs.map((obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return []
    }

    let values = []
    Object.keys(rowWithMoreColumns.row).forEach((item) => {
      if (obj[item]) {
        if (isInteger(obj[item].toString()) || obj[item] == "") {
          values.push(obj[item])
        } else {
          values.push(`"${obj[item]}"`)
        }
      } else {
        values.push(null)
      }
    })

    return values.join(',')
  })

  let csv = []
    .concat([header])
    .concat(body)
    .join('\n')

  return csv
}

const isInteger = (str: string) => {
  //return (!isNaN(str)
  return +str === +str
}

export const startProcess = (sourceFilesPath: string) => {
  inquirer
    .prompt(questions[1])
    .then(answers => {
      if (answers.operation == 'Yes') {
        console.log(colors.blue(`------------------------ ${colors.white(' files')} ------------------------\n`))
        processFiles(sourceFilesPath).then((result) => {
          console.log('\n')
          if (result.succeed) {
            console.log('%s %s', 'File', result.message)
          } else {
            console.log(result)
          }
          console.log(colors.blue('\n---------------------------------------------------------------'))
        }).catch((e) => {
          console.log(e)
        })
      } else {
        process.exit()
      }
    })
}

export const createOnError = (err: Object, path: string) => {
  console.log(colors.red(`---------------------------- ${colors.white('Error')} ----------------------------\n`))
  console.log(`Error reading directory ${path}\n`)
  console.log(err)
  console.log(colors.red('\n---------------------------------------------------------------'))
  inquirer
    .prompt(questions[2])
    .then((answers) => {
      if (answers.check == 'Yes') {
        child_process.exec('mkdir files files/origin files/destination', (err, stdout, stderr) => {
          if (err) {
            console.log(`Error creating directory: ${err}`)
          } else {
            console.log('Directory successfully created, put your files in the origin directory and run the program')
          }
        })
      }
    })
}

export const formatDate = (date: Date) => {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
}
