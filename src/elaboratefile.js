// @flow
import fs from 'fs'
import parse from 'csv-parse'

export const elaborateFile = ((inputFile: string, delimiter: string, callback: Function) => {
  const parser = parse({ delimiter: delimiter }, (err, data) => {
    if (err) {
      console.log('Error')
    } else {
      console.log(`lettura file: ${inputFile}, righe: ${data.length}`)
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
        
        if (obj.Params != '{}') {
          let params = JSON.parse(obj.Params.replace(/{ /g, '{ "').replace(/ : /g, '": "').replace(/;  /g, '","').replace(/}/g, '"}'))
          obj = Object.assign({},obj, params)
          
          delete obj["Params"]
        } else {
          obj = Object.assign({},obj, {})
          
          delete obj["Params"]
        }
        
        let publisher = inputFile.replace('./files/origin/', '').replace('.csv', '').split('_')
        obj = Object.assign({},obj, { Publisher: `${publisher[1]}_${publisher[2]}` })
        arrayList.push(obj)
      })

      callback(null, arrayList)
    }
  })
  fs.createReadStream(inputFile).pipe(parser)
})
