import * as XLSX from 'xlsx';

const DataSchema={
  string:'string',
  number:'number'
}

//excel converSerion is a promise
export const excelCsvReader=  (file)=>{

    return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    if (!file) return reject('File Is Null');
        

    //Format Checkering
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    const isCsv = file.name.endsWith('.csv');

    //Read The Files
    if (isExcel) {
      reader.readAsArrayBuffer(file); 
    } else if (isCsv) {
      reader.readAsText(file); 
    }else{
      reject("File Not Be xlsx,xls,csv format")
      return;
    }


      reader.onload = (evt) => {
      let data=[]
      if (isExcel) {
        const arrayBuffer = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        workbook.SheetNames.forEach((e)=>{
          data.push( {file:file,sheetData:XLSX.utils.sheet_to_json( workbook.Sheets[e])})
        })
        resolve(data)
      } else if (isCsv) {
        const text = evt.target.result;
        const workbook = XLSX.read(text, { type: 'string' });
        workbook.SheetNames.forEach((e)=>{
          data.push( {file:file,sheetData:XLSX.utils.sheet_to_json( workbook.Sheets[e])})
        })
        resolve(data)
      } 

    };



    })

  }

function excelSerialToJSDate(serial) {
  const excelEpoch = new Date(1900, 0, 1); // Jan 1, 1900
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const offset = (serial - 1) * millisecondsPerDay;
  return new Date(excelEpoch.getTime() + offset);
}  

Array.prototype.getUniqueData = function (key) {
  return key?[...new Set(this.map((e)=>e[key]))]:[...new Set(this)];
};


Array.prototype.getAttributes = function () {  
    
  return this.reduce((acc,e,i)=>{
    return acc.concat(Object.keys(e))
  },[]).getUniqueData()
};


Array.prototype.selectByKey = function (k) {
  if (k === undefined || k === null) throw new Error("Enter The Key");
  return this.map((e)=>e[k]);
};

Array.prototype.filterByKey = function (k, v, all) {
  if (k === undefined || k === null) throw new Error("Enter The Key");
  if (v === undefined || v === null) throw new Error("Enter the Value");
  if (all === undefined || all === null) throw new Error("Enter the All");
  return this.filter((e) => e[k] == v || v == all);
};

Array.prototype.sum= function(k,unit){
 if(k){
  return this.selectByKey(k).reduce((acc,r)=>{
    if(unit&&typeof r=='string'){
     return  acc+parseInt(r.split(unit)[0].trim())
    }else if(typeof r=='number'){
     return acc+r 
    }
  },0)

}else{
  return this.reduce((acc,r)=>{
    return acc+r
  },0)
}
}

Object.prototype.map= function(process){
  let list=[]
  let obj=this
  for(let key of Object.keys(obj)){
  list.push(process(key,obj[key],obj))  
  }
  return list
}



Array.prototype.groupBy= function(k){
  let obj={}
  for(let data of this){
    obj[data[k]]=(obj[data[k]]||[]).concat(data)
  }
  return obj
}


Array.prototype.getSchema = function(){

let list=this
return this.getAttributes().map((e)=>{ 

return {
attribute:e, 
formate:(function(){
    let format=DataSchema.string
    if(list.map((v)=>v[e]).every((val) => typeof val === 'number')){
      format=DataSchema.number
    }else{
      format=DataSchema.string
    }
    return format
}
)()

}

})
}

