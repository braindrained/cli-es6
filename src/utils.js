// @flow
import fs from 'fs'
import config from './config'
import Cli from './cli'

export const checkOccurence = ((array: Array<string>, value: string) => {
  return array.filter((val) => { return val === value }).length
})

const typesPlain = ['Android', 'iOs', 'Tutti']

export const questions = [
    { type: 'list', name: 'operation', message: 'Scegli file da processare', choices: typesPlain }
]

const readdirAsync = ((dirname: string) => {
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
        var summaryFiles = [];
        files.forEach(function(file, i) {
          file.forEach(function(row, i) {
            summaryFiles.push(row)
          })
        });
        
        summaryFiles = summaryFiles.sort((a,b) => {
          return new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime();
        });
        
        fs.appendFile(`./files/destination/result${fileType}.json`, JSON.stringify(summaryFiles, null, 4), function(err) {
            /*if(err) {
              return console.log(err);
            }
            console.log(`The ${fileType} file was appended!`);*/
            if (err)
                reject({ succeed: false, fileType: fileType, message: err})
            else 
                resolve({ succeed: true, fileType: fileType, message: 'creato con successo'})
        })
    }).catch(function (something) {
      console.log('catch', something);
    })
  }))
})