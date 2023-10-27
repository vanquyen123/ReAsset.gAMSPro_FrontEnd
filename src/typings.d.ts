///<reference path="../node_modules/abp-web-resources/Abp/Framework/scripts/abp.d.ts"/>
///<reference path="../node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.jquery.d.ts"/>
///<reference path="../node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.signalr.d.ts"/>
///<reference path="../node_modules/moment/moment.d.ts"/>
///<reference path="../node_modules/@types/moment-timezone/index.d.ts"/>

// Typings reference file, see links for more information
// https://github.com/typings/typings
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;

declare var mOffcanvas: any; // Related to Metronic
declare var mMenu: any; // Related to Metronic
declare var mToggle: any; // Related to Metronic
declare var mUtil: any; // Related to Metronic
declare var mHeader: any; // Related to Metronic
declare var StripeCheckout: any;
declare module '*.css';

declare namespace abp {
    namespace ui {
        function setBusy(elm?: any, text?: any, optionsOrPromise?: any): void;
    }
}


interface JQuery {
    select2(options?: any): JQuery;
    flatpickr(options?: any): JQuery;
    dialog(options?: any): JQuery;
    autocomplete(option?: any): JQuery;
    printThis(option?: any): JQuery;
    print(option?: any): JQuery;

    tooltip(option?: any): JQuery;
    resizable(option?: any): JQuery;
}

interface Array<T> {
    firstOrDefault: (callbackfn: (value: T, index: number, array: T[]) => boolean, option1?: any) => T;
    sum: (callbackfn?: (value: T, index: number, array: T[]) => number) => number;
    sumWDefault: (callbackfn?: (value: T, index: number, array: T[]) => number, valDefault?: any = 0) => number;
    distinct: () => T[]
}
/**
 * rtl-detect
 */

declare module 'rtl-detect';
