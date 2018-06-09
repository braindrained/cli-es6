// @flow
import fs from 'fs'
import parse from 'csv-parse'

export default class Cli {
  readFiles(inputFile: string, delimiter: string) {
    const parser = parse({ delimiter: delimiter }, (err, data) => {
      if (err) {
        console.log('Error')
      } else {
        console.log(`file: ${inputFile}, righe: ${data.length}`)

        data.forEach((line, i) => {
          line.forEach((item, x) => {
            // console.log(i, item)
          })
        })
      }
    })
    fs.createReadStream(inputFile).pipe(parser)
  }
}
