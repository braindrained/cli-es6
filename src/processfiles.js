// @flow
import fs from 'fs'
import config from './config'
import { readdirAsync, readFileAsync, convertToCsv, checkOccurence } from './utils'

export const processFiles = ((sourceFilesPath: string, fileType: string) => {
  return new Promise(((resolve, reject) => {
    readdirAsync(sourceFilesPath).then((filenames) => {
      try {
        let filesPath = checkOccurence(filenames, fileType)
        if (filesPath.length == 0) {
          reject({ succeed: false, fileType: fileType, message: 'non sono presenti file validi'})
        } else {
          return Promise.all(filesPath.map(readFileAsync))
        }
      } catch (e) {
        reject({ succeed: false, fileType: fileType, message: e})
      }
    }).then((files) => {
        try {

          if (files && files.length > 0) {
            let summaryFiles = []
            let rowWithMoreColumns = { rowLength: 0, row: [] }
            
            files.forEach((file) => {
              file.forEach((row) => {
                if (Object.keys(row).length > rowWithMoreColumns.rowLength) {
                  rowWithMoreColumns.rowLength = Object.keys(row).length
                  rowWithMoreColumns.row = row
                }
                summaryFiles.push(row)
              })
            })
            
            summaryFiles = summaryFiles.sort((a,b) => {
              return new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime()
            })
          
            let csv = convertToCsv(summaryFiles, rowWithMoreColumns)
            
            if (csv) {
              fs.appendFile(`${config.destinationFilesPath}result${fileType}.csv`, csv, (err) => {
                  if (err) {
                    reject({ succeed: false, fileType: fileType, message: err})
                  } else {
                    resolve({ succeed: true, fileType: fileType, message: 'creato con successo'})
                  }
              })              
            } else {
              reject({ succeed: false, fileType: fileType, message: 'errore'})
            }
          }
        } catch (e) {
          reject({ succeed: false, fileType: fileType, message: e})
        }
    }).catch((e) => {
      reject({ succeed: false, fileType: fileType, message: e})
    })
  }))
})