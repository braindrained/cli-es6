// @flow
import fs from 'fs'
import config from './config'
import Cli from './cli'

export const checkOccurence = ((array: Array<string>, value: string) => {
  return array.filter((val) => { return val === value }).length
})

export const questionsCheck = [
  { type: 'list', name: 'check', message: 'la cartella di destinazione non è vuota, cancellare i file presenti?', choices: ['Sì', 'No'] }
]

export const questions = [
  { type: 'list', name: 'operation', message: 'Scegli file da processare', choices: ['Android', 'iOs', 'Tutti'] }
]

const deleteFilesAsync = ((dirname: string) => {
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
  return deleteFilesAsync(filename, 'utf8');
})

export const readdirAsync = ((dirname: string) => {
    return new Promise(((resolve, reject) => {
        fs.readdir(dirname, (err, filenames) => {
            if (err) 
                reject(err)
            else 
                resolve(filenames)
        })
    }))
})

const readFileAsync = ((filename: string, enc: string) => {
    return new Promise(((resolve, reject) => {
      const execute = new Cli()
      execute.readFiles(filename, config.delimiter, ((err, data) => {
          if (err) 
              reject(err); 
          else
              resolve(data);
      }))
    }))
})

const getFile = ((filename: string) => {
  return readFileAsync(filename, 'utf8');
})

const convertCollectionToCsv = ((docs, header) => {
  if (!(Array.isArray(docs) && docs.length > 0)) {
    return;
  }

  var body = docs.map(convertObjectsToCsv);
  var csv = []
    .concat([header])
    .concat(body)
    .join('\n');

  return csv;
})

const convertObjectsToCsv = ((doc) => {
  var values = getValuesFromObject(doc);
  return values.join(',');
})

const getValuesFromObject = ((obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return [];
  }

  var keys = Object.keys(obj);
  var values = [];
  
  for (var i = 0; i < keys.length; ++i) {
    if (isNormalInteger(obj[keys[i]].toString()) || obj[keys[i]] != null) {
      values.push(obj[keys[i]])
    } else {
      values.push(`"${obj[keys[i]]}"`)
    }
  }

  return values;
})

const isNormalInteger = ((str) => {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
})

export const processFiles = ((sourceFilesPath: string, fileType: string) => {
  return new Promise(((resolve, reject) => {
    readdirAsync(sourceFilesPath).then(function (filenames){
        let filesPath = []
        filenames.forEach((item) => {
          if (item.indexOf(fileType) != -1) {
            filesPath.push(sourceFilesPath + item)
          }
        })
        if (filesPath.length == 0)
            resolve({ succeed: false, fileType: fileType, message: 'non sono presenti file'})
        return Promise.all(filesPath.map(getFile));
    }).then(function (files){
        let summaryFiles = [];
        let rowWithMoreColumns = { rowLength: 0, row: [] };
        files.forEach(function(file, i) {
          file.forEach(function(row, i) {
            if (Object.keys(row).length > rowWithMoreColumns.rowLength) {
              rowWithMoreColumns.rowLength = Object.keys(row).length
              rowWithMoreColumns.row = row
            }
            summaryFiles.push(row)
          })
        });
        
        let header = Object.keys(rowWithMoreColumns.row).join(",");
        
        summaryFiles = summaryFiles.sort((a,b) => {
          return new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime();
        });
        
        try {
          let csv = convertCollectionToCsv(summaryFiles, header)
          console.log(csv);
          fs.appendFile(`./files/destination/result${fileType}.csv`, csv, function(err) {
              if (err)
                  reject({ succeed: false, fileType: fileType, message: err})
              else 
                  resolve({ succeed: true, fileType: fileType, message: 'creato con successo'})
          })
        } catch (e) {
          console.log(e);
        } finally {
          
        }
    }).catch(function (something) {
      reject({ succeed: false, fileType: fileType, message: something})
    })
  }))
})