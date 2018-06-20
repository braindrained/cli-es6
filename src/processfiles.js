// @flow
import fs from 'fs'
import colors from 'colors'

import config from './config'
import { readdirAsync, readFileAsync, convertToCsv, formatDate } from './utils'

export const processFiles = (sourceFilesPath: string) => {
  return new Promise((resolve, reject) => {
    readdirAsync(sourceFilesPath).then((filenames) => {
      return Promise.all(filenames.map(readFileAsync))
    }).then((files) => {
        try {
          if (files && files.length > 0) {
            let rowWithMoreColumns = { rowLength: 0, row: [] }
            let summaryFiles = []

            files.forEach((file) => {
              file.forEach((row) => {
                if (Object.keys(row).length > rowWithMoreColumns.rowLength) {
                  rowWithMoreColumns.rowLength = Object.keys(row).length
                  rowWithMoreColumns.row = row
                }
                summaryFiles.push(row)
              })
            })

            let csv = convertToCsv(summaryFiles, rowWithMoreColumns)

            if (csv) {
              const fileName = `result-${formatDate(new Date())}`
              fs.appendFile(`${config.destinationFilesPath}${fileName}.csv`, csv, (err) => {
                  if (err) {
                    reject({ succeed: false, errorcode: 1, message: err})
                  } else {
                    resolve({ succeed: true, errorcode: 0, message: `${colors.yellow(fileName)} successfully created`})
                  }
              })
            } else {
              reject({ succeed: false, errorcode: 3, message: 'error'})
            }
          }
        } catch (e) {
          reject({ succeed: false, errorcode: 4, message: e})
        }
    }).catch((e) => {
      reject({ succeed: false, errorcode: 5, message: e})
    })
  })
}
