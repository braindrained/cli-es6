// @flow
import fs from 'fs'
import config from './config'
import { readdirAsync, getFile, convertCollectionToCsv, checkOccurence } from './utils'

export const processFiles = ((sourceFilesPath: string, fileType: string) => {
  return new Promise(((resolve, reject) => {
    readdirAsync(sourceFilesPath).then((filenames) => {
      try {
        let filesPath = checkOccurence(filenames, fileType)
        if (filesPath.length == 0)
            resolve({ succeed: false, fileType: fileType, message: 'non sono presenti file'})
        return Promise.all(filesPath.map(getFile))        
      } catch (e) {
        resolve({ succeed: false, fileType: fileType, message: e})
      }
    }).then((files) => {
        let summaryFiles = []
        let rowWithMoreColumns = { rowLength: 0, row: [] }
        files.forEach((file, i) => {
          file.forEach((row, i) => {
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
        
        try {
          if (summaryFiles.length > 0) {
            let csv = convertCollectionToCsv(summaryFiles, rowWithMoreColumns)
            
            if (csv) {
              fs.appendFile(`${config.destinationFilesPath}result${fileType}.csv`, csv, function(err) {
                  if (err)
                      resolve({ succeed: false, fileType: fileType, message: err})
                  else 
                      resolve({ succeed: true, fileType: fileType, message: 'creato con successo'})
              })              
            } else {
              resolve({ succeed: false, fileType: fileType, message: 'errore'})
            }
          }
        } catch (e) {
          resolve({ succeed: false, fileType: fileType, message: e})
        }
    }).catch(function (e) {
      resolve({ succeed: false, fileType: fileType, message: e})
    })
  }))
})