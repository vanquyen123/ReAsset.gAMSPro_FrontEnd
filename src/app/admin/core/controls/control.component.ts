import { Component, forwardRef, ViewChild, ElementRef, OnInit, Injector, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ComponentBase } from '../../../ultilities/component-base';
import { ChangeDetectionComponent } from '../ultils/change-detection.component';
declare var $: JQueryStatic;

export function createCustomInputControlValueAccessor(extendedInputComponent: any) {
    return {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => extendedInputComponent),
        multi: true
    };
}

@Component({
    template: ''
})
export class ControlComponent extends ChangeDetectionComponent implements ControlValueAccessor, AfterViewInit {

    constructor(injector: Injector) {
        super(injector);
    }

    @ViewChild('control') inputRef: ElementRef;

    @Output() onChangeEvent: EventEmitter<any> = new EventEmitter<any>();

    waitingValue: any;

    sendValueOut(value) {
        if (this.onChangeCallback) {
            this.onChangeCallback(value);
        }
        else {
            this.waitingValue = value;
        }
    }

    addTextToImage(imagePath, text, finallyCallback?: (param) => void): any {
        // var circle_canvas = document.createElement("canvas");
        // var context = circle_canvas.getContext("2d");

        // // Draw Image function
        // var img = new Image();
        // img.src = imagePath;
        // img.onload = function () {
        //     circle_canvas.width = img.width;
        //     circle_canvas.height = img.height;
        //     context.drawImage(img, 20, 20);
        //     context.lineWidth = 1;

        //     context.fillStyle = "red";
        //     // context.lineStyle = "#ffff00";
        //     context.font = "bold 2rem sans-serif";
        //     var textToLine = text.split('\\n');
        //     var y = 100;
        //     textToLine.forEach(element => {

        //         context.fillText(element, 50, y);
        //         y += 40;
        //     });
        //     finallyCallback(circle_canvas.toDataURL())
        //     // return circle_canvas.toDataURL();
        // };
        finallyCallback(imagePath)

    }

    // The internal data model
    public innerValue: any = '';

    // Placeholders for the callbacks which are later provided
    // by the Control Value Accessor
    protected onChangeCallback: any;

    protected onChangeOverride(value) {

    }

    setNgModelValue(value) {

    }

    updateControlView() {

    }

    // implements ControlValueAccessor interface
    writeValue(value: any) {
        if (!value && value !== 0) {
            this.innerValue = '';
        }
        else if (value !== this.innerValue) {
            this.innerValue = value;
        }

        this.setNgModelValue(value);
        this.updateControlView();
    }
    // implements ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
        if (this.waitingValue) {
            this.onChangeCallback(this.waitingValue);
        }
    }

    get valueSendOut(): any {
        const input = <HTMLInputElement>this.inputRef.nativeElement;
        return input.value;
    }

    // implements ControlValueAccessor interface - not used, used for touch input
    registerOnTouched() { }

    // change events from the textarea
    protected onChange() {
        // get value from text area
        var newValue = this.valueSendOut;

        if (!newValue && newValue !== 0) {
            newValue = '';
        }

        // update the form
        if (this.onChangeCallback) {
            if (this.waitingValue) {
                this.onChangeCallback(this.waitingValue);
            }
            else {
                this.onChangeCallback(newValue);
            }
        }

        this.onChangeEvent.emit(this.inputRef);
        this.onChangeOverride(newValue);
    }

    afterViewInit() {

    }

    ngAfterViewInit() {
        const inputElement = <HTMLInputElement>this.inputRef.nativeElement;
        inputElement.onchange = () => this.onChange();
        inputElement.onkeyup = () => this.onChange();
        this.afterViewInit();
    }
}