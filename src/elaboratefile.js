// @flow
import fs from 'fs'
import parse from 'csv-parse'

export const elaborateFile = (inputFile: string, delimiter: string, callback: Function) => {
  const parser = parse({ delimiter: delimiter }, (err, data) => {
    if (err) {
      console.log('Error')
    } else {
      console.log(`Reading file: ${inputFile}, rows count: ${data.length}`)
      let arrayList = []
      let header = []
      
      data[0].forEach((item) => {
        header.push(item.replace(/\s/,''))
      })
      data.shift()

      data.forEach((line, i) => {
        let obj = {}
        line.forEach((item, x) => {
          obj[header[x].trim()] = item.trim()
        })
        
        arrayList.push(obj)
      })

      callback(null, arrayList)
    }
  })
  fs.createReadStream(inputFile).pipe(parser)
}
