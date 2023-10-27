import { ElementRef } from '@angular/core';
import { Component, Input, ViewEncapsulation, Output, Injector, Optional, Inject, ViewChild } from "@angular/core";
import * as XLSX from 'xlsx';
import { EventEmitter } from '@angular/core';
import * as moment from "moment";
import { HttpClient, HttpHandler } from "@angular/common/http";
import * as _ from "lodash";
import { FileUploaderComponent } from "../file-uploader/file-uploader.component";
import { API_BASE_URL } from "@shared/service-proxies/service-proxies";
import { ComponentBase } from "@app/ultilities/component-base";
import { forEach, reject } from 'lodash';
import { async } from '@angular/core/testing';
import { resolve } from 'dns';
import { time, timeLog } from 'console';
import { Parser } from '@angular/compiler/src/ml_parser/parser';

@Component({
    selector: "import-excel-multi",
    templateUrl: "./import-excel-multi.component.html",
    encapsulation: ViewEncapsulation.None
})

export class ImportExcelMultiComponent extends ComponentBase {

    // XLSX = require('xlsx');
    // request = require('request');

    constructor(
        injector: Injector,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(injector);
        console.log(this);
    }
    handler: HttpHandler;
    http: HttpClient;
    arrayBuffer: any;
    file: File;
    listFile:Array<File>=[];
    sheetlistFile: Array<IterableIterator<Object>>=[];
    toObjects_: any[];
    toArrObjectFromEx_: any;
    toArrayObject_: any[];
    fileInfo_: any[];
    numberTemp: any;
    resultData:Array<IterableIterator<Object>>=[];
    @Input() inputCss: string;
    @Input() customStyle: string;
    @Input() hidden: boolean = false;
    @Input() disable: boolean = false;
    @Input() id: string = 'file';
    @Input() startPosition: string = '';
    // @Input() endPosition: string = '';
    @Input() workSheetName: string = '';
    @Input() fileExtension: string = '.xlsx,.xls';


    @Input() validateImportExcelMessage: string = null

    @Output() toObjects: EventEmitter<any> = new EventEmitter<any>();
    @Output() toArrayObject: EventEmitter<any> = new EventEmitter<any>();
    @Output() toArrObjectFromEx: EventEmitter<any> = new EventEmitter<any>();
    @Output() toTableOjectFromEx: EventEmitter<any> = new EventEmitter<any>();
    @Output() fileInfo: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('fileControl') fileControl: any

    fileInputClick($event) {
        if (this.validateImportExcelMessage) {
            this.showWarningMessage(this.validateImportExcelMessage)
            event.preventDefault();
            event.stopPropagation();
            return
        }

        this.fileControl.value = null
    }

     
    async onUploadFile(fileInput: any) { 

        this.setLoadingUI(true);

        console.log('startImportAssLiquidationTotal')
        console.time('onImportAssLiquidationTotal')
        console.time('readingAsset')

        let listSheet:Array<IterableIterator<Object>>=[]
        if (fileInput.target.files && fileInput.target.files[0]) {

            if (this.checkUploadedFile(fileInput)) {

                this.file = fileInput.target.files[0];

                this.listFile = fileInput.target.files;

                this.numberTemp=this.listFile.length;
                await this.readMultiFileUploadedAsync(this.listFile);

                // for(let i=0;i<this.listFile.length;i++){

                    

                //     //this.resultData.push(result);

                // }

                //this.toArrayObject.emit(this.resultData);

            }

            else {

                this.showErrorMessage(this.l('FileNotCorrect'));

            }

        }
        
        this.setLoadingUI(false);
    }
    async readMultiFileUploadedAsync(file) {
                try {
                var this_=this;
                let count=0;
                for(let j=0;j<this_.numberTemp;j++){
                    let fileReader = new FileReader();
                    fileReader.readAsArrayBuffer(file[j]);
                        fileReader.addEventListener("load", function (event) {

                            this_.arrayBuffer = fileReader.result;
    
                            var data = new Uint8Array(this_.arrayBuffer);
    
                            let arr = new Array();
    
                            for (let i = 0; i != data.length; ++i)
    
                                arr[i] = String.fromCharCode(data[i]);
    
                            let bstr = arr.join("");
    
                            console.time('reading');
                            //timeRun = time.toString
    
                            let workbook = XLSX.read(bstr, { type: 'binary', cellFormula: false, cellHTML: false, cellText: false });
    
                            console.timeEnd('reading');
    
                            //workSheetName has value
    
                            let sheetName = this_.workSheetName ? this_.workSheetName : workbook.SheetNames[0];
    
                            let worksheet = workbook.Sheets[sheetName];
    
       
    
                            let datas: IterableIterator<Object> = this_.iiCreateIteratorWithStartPosition(this_.getObjectKey(worksheet), worksheet, this_.startPosition);
    
                            //this_.toArrayObject.emit(this_._toIterableArrObject(datas));
    
                            //luu ep kieu ve IterableArrObject
                            
                            this_.resultData.push(this_._toIterableArrObject(datas));
                            if(worksheet!=null||worksheet!=undefined)
                            {
                                count++
                                datas=null
                            }
                            if(count==this_.numberTemp){
    
                                this_.toTableOjectFromEx.emit(this_.resultData);
                                
                            }
    
                        });

                    

                    // return  fileReader.onload = await function() {

                    // };

                }



            //gan ve emit cho toArrayObject

            //this.toArrayObject.emit(this.resultData);

        }

        catch (err) {

            this.showErrorMessage(err);

        }
        finally {

         //   this.setLoadingUI(false);

            this.clearInputFile();

        }

    }
    checkUploadedFile(fileInput: any): boolean {
        var ext: string[] = fileInput.target.files[0].name.split('.');
        return !!this.fileExtension.split(',').find(x => x.toLowerCase() == '.' + ext[ext.length - 1].toLowerCase());
    }

    readUploadedFile() {
        try {
            let fileReader = new FileReader();
            fileReader.readAsArrayBuffer(this.file);
            fileReader.onload = () => {
                this.arrayBuffer = fileReader.result;
                var data = new Uint8Array(this.arrayBuffer);
                let arr = new Array();
                for (let i = 0; i != data.length; ++i)
                    arr[i] = String.fromCharCode(data[i]);
                let bstr = arr.join("");
                console.time('reading');
                let workbook = XLSX.read(bstr, { type: 'binary', cellFormula: false, cellHTML: false, cellText: false });
                console.timeEnd('reading');
                //workSheetName has value
                let sheetName = this.workSheetName ? this.workSheetName : workbook.SheetNames[0];
                let worksheet = workbook.Sheets[sheetName];

                //khangth 1/11/2019, datas -> iterableItarator
                // -- let datas = this.createNewObjectWithStartPosition(this.getObjectKey(worksheet), worksheet, this.startPosition);
                let datas: IterableIterator<Object> = this.iiCreateIteratorWithStartPosition(this.getObjectKey(worksheet), worksheet, this.startPosition);

                // this.toObjects.emit(this.createNewObjectWithStartPosition(this.getObjectKey(worksheet), worksheet, this.startPosition));
                //khangth -4.12 ---> this.toArrayObject.emit(this._toArrayObject(datas));
                this.toArrayObject.emit(this._toIterableArrObject(datas));
                this.fileInfo.emit(this.file.name);
            };
        }
        catch (err) {
            this.showErrorMessage(err);
        }
        finally {
         //   this.setLoadingUI(false);
            this.clearInputFile();
        }
    }
    readMultiSheetUploadedFile() {
        setTimeout(() => {
            try {
                //this.readMultiFileUploadedSheet(this.listFile);
                let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(this.file);
                fileReader.onload = () => {
                    this.arrayBuffer = fileReader.result;
                    var data = new Uint8Array(this.arrayBuffer);
                    let arr = new Array();
                    for (let i = 0; i != data.length; ++i)
                        arr[i] = String.fromCharCode(data[i]);
                    let bstr = arr.join("");
                    console.time('reading');
                    let workbook = XLSX.read(bstr, { type: 'binary', cellFormula: false, cellHTML: false, cellText: false });
                    console.timeEnd('reading');
                    //workSheetName has value
                    let sheetName = this.workSheetName ? this.workSheetName : workbook.SheetNames[0];
                    let worksheet = workbook.Sheets[sheetName];
                    let sheetlist: Array<IterableIterator<Object>>=[]
                    workbook.SheetNames.forEach(x => {
                        var worksheets = workbook.Sheets[x];
                        let data: IterableIterator<Object> = this.iiCreateIteratorWithStartPosition(this.getObjectKey(worksheets), worksheets, this.startPosition);
                        //this.toArrayObject.emit(this._toIterableArrObject(data));
                        sheetlist.push(data)
                    });
                    //khangth 1/11/2019, datas -> iterableItarator.
                    let datas: IterableIterator<Object> = this.iiCreateIteratorWithStartPosition(this.getObjectKey(worksheet), worksheet, this.startPosition);
                    // -- let datas = this.createNewObjectWithStartPosition(this.getObjectKey(worksheet), worksheet, this.startPosition);
                    //let datas: IterableIterator<Object> = this.iiCreateIteratorWithStartPosition(this.getObjectKey(worksheet), worksheet, this.startPosition);
                    // this.toObjects.emit(this.createNewObjectWithStartPosition(this.getObjectKey(worksheet), worksheet, this.startPosition));
                    //khangth -4.12 ---> this.toArrayObject.emit(this._toArrayObject(datas));
                    this.toArrayObject.emit(this._toIterableArrObject(datas));
                    //get data multisheet on a file excel 
                    //this.toArrObjectFromEx.emit(this._toIterableArrObjectFromList(sheetlist));

                    this.fileInfo.emit(this.file.name);

                    
                };
            }
            catch (err) {
                this.showErrorMessage(err);
            }
            finally {
             //   this.setLoadingUI(false);
                this.clearInputFile();
            }
        });
    }
    readMultiFileUploadedSheet(listFile) : any{
        try {
            return new Promise((resolve, reject)=>{
                let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(listFile);
                fileReader.onload = () => {
                    this.arrayBuffer = fileReader.result;
                    var data = new Uint8Array(this.arrayBuffer);
                    let arr = new Array();
                    for (let i = 0; i != data.length; ++i)
                        arr[i] = String.fromCharCode(data[i]);
                    let bstr = arr.join("");
                    console.time('reading');
                    let workbook = XLSX.read(bstr, { type: 'binary', cellFormula: false, cellHTML: false, cellText: false });
                    console.timeEnd('reading');
                    //workSheetName has value
                    let sheetName = this.workSheetName ? this.workSheetName : workbook.SheetNames[0];
                    let worksheet = workbook.Sheets[sheetName];
                    let sheetlist: Array<IterableIterator<Object>>=[]
                    workbook.SheetNames.forEach(x => {
                        var worksheets = workbook.Sheets[x];
                        let data: IterableIterator<Object> = this.iiCreateIteratorWithStartPosition(this.getObjectKey(worksheets), worksheets, this.startPosition);
                        //this.toArrayObject.emit(this._toIterableArrObject(data));
                        sheetlist.push(data)
                    });
                    //khangth 1/11/2019, datas -> iterableItarator.
                    let datas: IterableIterator<Object> = this.iiCreateIteratorWithStartPosition(this.getObjectKey(worksheet), worksheet, this.startPosition);
                    // -- let datas = this.createNewObjectWithStartPosition(this.getObjectKey(worksheet), worksheet, this.startPosition);
                    //let datas: IterableIterator<Object> = this.iiCreateIteratorWithStartPosition(this.getObjectKey(worksheet), worksheet, this.startPosition);
                    // this.toObjects.emit(this.createNewObjectWithStartPosition(this.getObjectKey(worksheet), worksheet, this.startPosition));
                    //khangth -4.12 ---> this.toArrayObject.emit(this._toArrayObject(datas));
                    return datas;
                    //this.toArrObjectFromEx_.push(this._toIterableArrObjectFromList(sheetlist));
                    //this.fileInfo_.push(this.file.name);
                    
                    //get data multisheet on a file excel 
                    //this.toArrObjectFromEx.emit(this._toIterableArrObjectFromList(sheetlist));
                };
            })
        }
        catch (err) {
            this.showErrorMessage(err);
        }
        
    }

   readMultiFileUploadedFile(listFile):any {
        setTimeout(() => {
            try {
                let fileReader = new FileReader();
                //this.readMultiFileUploadedSheet(this.listFile);
                for (let index = 0; index < listFile.length; index++) {
                fileReader.readAsArrayBuffer(listFile[index]);
                var _this=this
                fileReader.onload = function (e) {
                    _this.arrayBuffer = fileReader.result;
                    var data = new Uint8Array(_this.arrayBuffer);
                    let arr = new Array();
                    for (let i = 0; i != data.length; ++i)
                        arr[i] = String.fromCharCode(data[i]);
                    let bstr = arr.join("");
                    console.time('reading');
                    let workbook = XLSX.read(bstr, { type: 'binary', cellFormula: false, cellHTML: false, cellText: false });
                    console.timeEnd('reading');
                    //workSheetName has value
                    let sheetName = _this.workSheetName ? _this.workSheetName : workbook.SheetNames[0];
                    let worksheet = workbook.Sheets[sheetName];
                    //let sheetlist: Array<IterableIterator<Object>>=[]
                    
                    //khangth 1/11/2019, datas -> iterableItarator.
                    let datas: IterableIterator<Object> = _this.iiCreateIteratorWithStartPosition(_this.getObjectKey(worksheet), worksheet, _this.startPosition);
                    // -- let datas = this.createNewObjectWithStartPosition(this.getObjectKey(worksheet), worksheet, this.startPosition);
                    //let datas: IterableIterator<Object> = this.iiCreateIteratorWithStartPosition(this.getObjectKey(worksheet), worksheet, this.startPosition);
                    // this.toObjects.emit(this.createNewObjectWithStartPosition(this.getObjectKey(worksheet), worksheet, this.startPosition));
                    //khangth -4.12 ---> this.toArrayObject.emit(this._toArrayObject(datas));
                    //this.toArrayObject.emit(this._toIterableArrObject(datas));
                    //get data multisheet on a file excel 
                    //this.toArrObjectFromEx.emit(this._toIterableArrObjectFromList(sheetlist));
                    _this.sheetlistFile.push(datas)
                    
                    //this.toArrObjectFromEx.emit(this._toIterableArrObjectFromList(this.sheetlistFile));
                    //this.fileInfo.emit(this.file.name);
                };
                }
                return this.sheetlistFile
            }
            catch (err) {
                this.showErrorMessage(err);
            }
            
        });
    }

    getObjectKey(obj: Object): string[] {
        // try {
        let arr = Object.keys(obj).filter(x => !x.startsWith('!'));
        if (arr.length == 0) {
            this.showErrorMessage(this.l('ExcelFileEmpty'));
            return [];
        }
        let rowsLast = this.splitRowIndex(arr[arr.length - 1]); //Math.max.apply(null, arr.map(x => this.splitRowIndex(x)));
        let rowsFirst = this.splitRowIndex(arr[0]); // Math.min.apply(null, arr.map(x => this.splitRowIndex(x)));
        let columns = arr.map(x => x.replace(this.splitRowIndex(x).toString(), '')).filter((value, index, self) => self.indexOf(value) === index);

        columns = columns.sort(function (x, y) {
            if (x.length > y.length) {
                return 1;
            }

            if (x.length < y.length) {
                return -1;
            }

            return x > y ? 1 : -1;
        });

        var result: string[] = [];
        for (let rowI: any = rowsFirst; rowI <= rowsLast; rowI++) {
            for (let column of columns) {
                result.push(column + rowI);
            }
        }
     //   this.setLoadingUI(false);
        return result;
        // } catch (error) {
        //     this.showErrorMessage(error);

        // }

    }

    // _toArrayObject(datas: Object[]): Object[][] {
    //     if (!datas)
    //         return null;

    //     let __obj: Object[][] = [];
    //     let _obj: Object[] = [];

    //     let oldInt: Number = 0;
    //     oldInt = this.splitRowIndex(Object.keys(datas[0])[0]);; // old value of row index
    //     //  _obj.push(datas[0]);

    //     let newInt: Number = 0;
    //     for (let i = 0; i < datas.length; i++) {
    //         newInt = this.splitRowIndex(Object.keys(datas[i])[0]);
    //         if (newInt == oldInt) {
    //             _obj.push(datas[i]);
    //         }
    //         else {
    //             oldInt = newInt; // update oldInt
    //             __obj.push(_obj);
    //             _obj = [datas[i]]; // reset _obj array for pushing new object
    //         }
    //     }

    //     return __obj;
    // }


    *_toIterableArrObject(datas: IterableIterator<Object>): IterableIterator<Array<Object>> {
        if (!datas)
            return null;

        let curIterator = datas.next();
        if (curIterator.done)
            return null

        let _obj: Object[] = [];

        let oldInt: Number = 0;
        oldInt = this.splitRowIndex(Object.keys(curIterator.value)[0]);; // old value of row index


        let newInt: Number = 0;

        while (!curIterator.done) {
            newInt = this.splitRowIndex(Object.keys(curIterator.value)[0]);

            if (newInt == oldInt) {
                _obj.push(curIterator.value);
            }
            else {
                oldInt = newInt; // update oldInt      
                yield _obj
                _obj = [curIterator.value]; // reset _obj array for pushing new object
            }
            curIterator = datas.next();

            if (curIterator.done) {
                yield _obj
                break;
            }

        }
    }
    _toIterableArrObjectFromList(datas: Array<IterableIterator<Object>>) 
    {
        let _obj: Object[] = [];
        datas.forEach(x => {
           _obj.push(this._toIterableArrObject(x))
        });
        return _obj
    }
    _toArrayObject(datas: IterableIterator<Object>): Object[][] {
        if (!datas)
            return null;

        let curIterator = datas.next();
        if (curIterator.done)
            return null

        let __obj: Object[][] = [];
        let _obj: Object[] = [];



        let oldInt: Number = 0;
        oldInt = this.splitRowIndex(Object.keys(curIterator.value)[0]);; // old value of row index


        let newInt: Number = 0;

        while (true) {
            newInt = this.splitRowIndex(Object.keys(curIterator.value)[0]);

            if (newInt == oldInt) {
                _obj.push(curIterator.value);
            }
            else {
                oldInt = newInt; // update oldInt
                __obj.push(_obj);
                _obj = [curIterator.value]; // reset _obj array for pushing new object
            }
            curIterator = datas.next();

            if (curIterator.done) {
                __obj.push(_obj);
                break;
            }

        }

        return __obj;
    }

    private splitRowIndex(key: string): Number {
        return Number.parseInt((key.length == 2) ? key[1] : key.match(/(\d+)/)[0]);
        // if (key.length == 2)
        //     return Number.parseInt(key.slice(1));
        // return Number.parseInt(key.match(/(\d+)/)[0]);
    }

    //khangth,1/11/2019, replace generator function for createNewObject
    // createNewObject(keys: string[], obj: Object): Object {
    //     let _obj: Object[] = [];
    //     let o: Object;
    //     keys.forEach(key => {
    //         o = new Object();
    //         o[key] = obj[key] ? obj[key]["v"] : undefined;
    //         _obj.push(o);
    //     });
    //     return _obj;
    // }

    //khangth,1/11/2019, replace generator function for createNewObject BEGIN
    *iiCreateNewObject(keys: string[], obj: Object): IterableIterator<Object> {
        for (let key of keys) {
            let o: Object = {};
            o[key] = obj[key] ? obj[key]["v"] : undefined;
            yield o
        }
    }
    createNewObject(keys: string[], obj: Object): Object[] {

        let _obj: Object[] = []
        let iterable = this.iiCreateNewObject(keys, obj)
        let it = iterable.next()
        while (!it.done) {
            _obj.push(it.value)
            it = iterable.next()
        }
        //this.testCreateNewObject(keys, obj)
        //let iterator = this.testCreateNewObject(keys, obj);

        return _obj;
    }
    //khangth,1/11/2019, replace generator function for createNewObject END

    // createNewObjectWithStartPosition(keys: string[], obj: Object, startPosition: string): Object[] {
    //     if (!startPosition)
    //         return this.createNewObject(keys, obj)[0];

    //     let indexOfStartPos = keys.findIndex(key => key == startPosition);
    //     if (indexOfStartPos < 0) // start position not found in keys list
    //         return this.createNewObject(keys, obj)[0];

    //     let _obj: Object[] = [];
    //     let o: Object;
    //     for (let i = indexOfStartPos; i < keys.length; i++) {
    //         o = new Object();
    //         let value = obj[keys[i]] ? obj[keys[i]]["v"] : undefined;
    //         if (value instanceof Date) {
    //             value = moment(value);
    //         }
    //         o[keys[i]] = value;
    //         _obj.push(o);
    //     }
    //     return _obj;
    // }


    //khangth,1/11/2019, replace generator function for createNewObject BEGIN
    *iiCreateIteratorWithStartPosition(keys: string[], obj: Object, startPosition: string): IterableIterator<Object> {
        if (keys.length == 0)
            return null;
        if (!startPosition)
            return this.createNewObject(keys, obj)[0];

        let indexOfStartPos = keys.findIndex(key => key == startPosition);
        if (indexOfStartPos < 0) // start position not found in keys list
            return this.createNewObject(keys, obj)[0];


        for (let i = indexOfStartPos; i < keys.length; i++) {
            let o: Object = {};
            let value = obj[keys[i]] ? obj[keys[i]]["v"] : undefined;
            if (value instanceof Date) {
                value = moment(value);
            }
            o[keys[i]] = value;
            yield o
        }
    }

    createNewObjectWithStartPosition(keys: string[], obj: Object, startPosition: string): Object[] {
        let _obj: Object[] = []
        let iterable = this.iiCreateIteratorWithStartPosition(keys, obj, startPosition)
        let it = iterable.next()
        while (!it.done) {
            _obj.push(it.value)
            it = iterable.next()
        }
        return _obj;
    }
    //khangth,1/11/2019, replace generator function for createNewObject END


    clearInputFile(): void {
        if ((<HTMLInputElement>document.getElementById('file-upload')) == null)
            return;
        (<HTMLInputElement>document.getElementById('file-upload')).value = '';
    }

    setLoadingUI(bool: boolean = true, loadingText: string = ''): void {
        if (bool)
            abp.ui.setBusy(undefined, loadingText, undefined);
        else
            abp.ui.clearBusy();
    }

}