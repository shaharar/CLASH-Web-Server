import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// The following service provides the ability to convert JSON object to CSV formatted file. It also enables downloading the file through the browser
export class DownloadService {

  constructor() { }

  // converts a given JSON to CSV format using a helper function and enables downloading it through the browser
  downloadFile(data, filename='data', columns) {
    // converts JSON to CSV 
    let csvData = this.ConvertToCSV(data, columns);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
}

// converts JSON object to CSV format using given objarray and headers list
ConvertToCSV(objArray, headerList) {
  let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  let str = '';
  let row = 'S.No,';
for (let index in headerList) {
      row += headerList[index] + ',';
  }
  row = row.slice(0, -1);
  str += row + '\r\n';
  for (let i = 0; i < array.length; i++) {
      let line = (i+1)+'';
      for (let index in headerList) {
         let head = headerList[index];
line += ',' + array[i][head];
      }
      str += line + '\r\n';
  }
  return str;
} 
}
