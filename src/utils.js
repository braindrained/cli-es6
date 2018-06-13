// @flow
import fs from 'fs'
import colors from 'colors'
import inquirer from 'inquirer'
import child_process from 'child_process'
import config from './config'
import { elaborateFile } from './elaboratefile'
import { processFiles } from './processfiles'

export const checkOccurence = ((array: Array<string>, value: string) => {
  // flow-disable-next-line
  return array.filter((val) => { return val.indexOf(value) != -1 })
})

export const questions = [
  { type: 'list', name: 'check', message: 'la cartella di destinazione non è vuota, cancellare i file presenti?', choices: ['Sì', 'No'] },
  { type: 'list', name: 'operation', message: 'Scegli file da processare', choices: ['Android', 'iOs', 'Tutti'] },
  { type: 'list', name: 'check', message: 'Le cartelle non esistono, vuoi crearle?', choices: ['Sì', 'No'] }
]

export const deleteFilesAsync = ((dirname: string) => {
  return new Promise(((resolve, reject) => {
    fs.unlink((dirname), err => {
        if (err) 
            reject(err)
        else 
            resolve(dirname)
    })
  }))
})

export const deleteFile = ((filename: string) => {
  return deleteFilesAsync(filename)
})

export const readdirAsync = ((dirname: string) => {
    return new Promise(((resolve, reject) => {
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
    }))
})

const readFileAsync = ((filename: string) => {
    return new Promise(((resolve, reject) => {
      elaborateFile(filename, config.delimiter, ((err, data) => {
          if (err) 
              reject(err)
          else
              resolve(data)
      }))
    }))
})

export const getFile = ((filename: string) => {
  return readFileAsync(filename)
})

export const convertCollectionToCsv = ((docs, rowWithMoreColumns) => {
  if (!(Array.isArray(docs) && docs.length > 0)) {
    return
  }

  const convertObjectsToCsv = ((doc) => {
    var values = getValuesFromObject(doc)
    return values.join(',')
  })

  const getValuesFromObject = ((obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return []
    }

    var keys = Object.keys(obj)
    var values = []
    
    keys.forEach((item) => {
      if(item == 'Publisher' && keys.length < rowWithMoreColumns.rowLength){
        for (var i = 0, len = (rowWithMoreColumns.rowLength - keys.length); i < len; i++) {
          values.push(null)
        }
      }
      if (isNormalInteger(obj[item].toString()) || obj[item] == "") {
        values.push(obj[item])
      } else {
        values.push(`"${obj[item]}"`)
      }
    })

    return values
  })
    
  let body = docs.map(convertObjectsToCsv)
  
  // flow-disable-next-line
  let header = Object.keys(rowWithMoreColumns.row).join(",")
  
  let csv = []
    .concat([header])
    .concat(body)
    .join('\n')

  return csv
})

const isNormalInteger = ((str) => {
    var n = Math.floor(Number(str))
    return n !== Infinity && String(n) === str && n >= 0
})

export const elaborateByType = ((sourceFilesPath: string, fileType: string) => {
  return new Promise(((resolve, reject) => {
    console.log(colors.blue(`------------------------ ${colors.white(fileType + ' files')} ------------------------\n`))
    processFiles(sourceFilesPath, fileType).then((result) => {
      console.log('\n')
      if (result.succeed) {
        console.log('%s %s %s', 'File', colors.blue(result.fileType), result.message)
      } else {
        console.log(result.message)
      }
      console.log(colors.blue('\n---------------------------------------------------------------'))
      resolve()
    })
  }))
})

export const createOnError = ((err: Object, path: string) => {
  console.log(colors.red(`---------------------------- ${colors.white('Error')} ----------------------------\n`))
  console.log(`Errore nella lettura della cartella ${path}\n`)
  console.log(err)
  console.log(colors.red('\n---------------------------------------------------------------'))
  inquirer
    .prompt(questions[2])
    .then(function (answers) {
      if (answers.check == 'Sì') {
        child_process.exec('mkdir files files/origin files/destination', ((err, stdout, stderr) => {
          if (err) {
              console.log(`Child processes failed with error code: ${err}`)
          }
          console.log('Cartelle create correttamente, inserisci i files csv nella cartella origin e riesegui il programma')
        }))
      }
    })
})