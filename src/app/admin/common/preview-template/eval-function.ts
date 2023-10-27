import { Component, ViewEncapsulation, Injector } from "@angular/core";
import * as moment from 'moment';
import { Encoder, QRByte, QRKanji, ErrorCorrectionLevel } from '@nuintun/qrcode';
import { ReportTable } from "@shared/service-proxies/service-proxies";
import { AccentsCharService } from "@app/admin/core/ultils/accents-char.service";

export class EvalFunctionComponent {
    accentsCharService: AccentsCharService;
    constructor(
        injector: Injector,
    ) {
        this.accentsCharService = injector.get(AccentsCharService);
        window.parent['genQRCode'] = this.genQRCode;
    }
    formatDate(m: string) {
        if (!m) {
            return '';
        }
        return moment(m).format("DD/MM/YYYY");
    }
    formatMoney(num) {
        if (isNaN(num)) {
            return '';
        }
        if (num == 0) {
            return "0";
        }
        if (!num) {
            return '';
        }
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    }
    SumByProperTy(tableName: string, propertyName: string, item: ReportTable[]): string {
        if (propertyName && tableName) {
            for (var value of item) {
                if (value.tableName == tableName) {
                    var sum = 0;
                    var colIndex = value.columns.findIndex(x => x.colName == propertyName);
                    for (var number of value.rows) {
                        sum += parseInt(number.cells[colIndex]);
                    }
                    if (isNaN(sum)) {
                        return '';
                    }
                    return sum.toString();
                }
            }
        }
        return "";
    }
    Single(tableName: string, propertyName: string, item: ReportTable[]): string {
        if (propertyName && tableName) {
            for (var value of item) {
                if (value.tableName == tableName) {
                    var colIndex = value.columns.findIndex(x => x.colName == propertyName);
                    if (value.rows.length > 0) {
                        return value.rows[0].cells[colIndex];
                    }
                }
            }
        }
        return "";
    }
    Sum(numbers): string {
        if (numbers && numbers.length > 0 && !(numbers.includes(null) || numbers.includes(undefined))) {
            return numbers.reduce((a, b) => a + b);
        }
        return '';
    }

    genQRCode(data: string, type?) {
        if (data) {
            data = data.split("\\n").join(`
`);
            const qrcode = new Encoder();
            qrcode.setEncodingHint(true);
            qrcode.setErrorCorrectionLevel(ErrorCorrectionLevel.L);
            qrcode.write(data);
            qrcode.make();

            return qrcode.toDataURL(8,1);
            return qrcode.toDataURL(1,1);
            if(type=='image')
            {return qrcode.toDataURL(10,1); }
            return qrcode.toDataURL(1,1);
        }
        return '';
    }

    formatDecimal(val) {
        return this.formatMoney(val.toFixed(2));
    }

    CountRow(tableName: string, item: ReportTable[]): string {
        if (tableName) {
            for (var value of item) {
                if (value.tableName == tableName) {
                    return value.rows.length.toString();
                }
            }
        }
        return "";
    }

    TotalRowByCondition(propertyName: string, condition: string, tableName: string, item: ReportTable[]): string {
        if (tableName)
            for (var value of item)
                if (value.tableName == tableName)
                    if (propertyName && condition) {
                        var propertyIndex = -1;
                        for (var i = 0; i < value.columns.length; i++) {
                            if (value.columns[i].colName == propertyName) {
                                propertyIndex = i;
                                break;
                            }
                        }
                        if (propertyIndex > -1) {
                            var evalString = 'value.rows.filter(x=>x.cells[' + propertyIndex + ']' + condition + ').length';
                            return eval(evalString);
                        }
                    }
        return "0";

    }

    removeDiacritics(str) {
        return this.accentsCharService.removeDiacritics(str);
    }

    SumByCondition(propertyName: string, condition: string, colNameToSum: string, tableName: string, item: ReportTable[]): string {
        if (tableName)
            for (var value of item)
                if (value.tableName == tableName)
                    if (propertyName && condition && colNameToSum) {
                        var sum = 0;
                        var colPropIndex = value.columns.findIndex(x => x.colName == propertyName);
                        var colSumIndex = value.columns.findIndex(x => x.colName == colNameToSum);
                        var evalString: string = '';
                        for (var number of value.rows) {
                            evalString = (!number.cells[colPropIndex] ? "''" : number.cells[colPropIndex]) + condition;
                            if (eval(evalString) as boolean)
                                sum += parseInt(number.cells[colSumIndex]);
                        }
                        if (isNaN(sum)) {
                            return '';
                        }
                        return sum.toString();
                    }
        return "0";
    }

}
