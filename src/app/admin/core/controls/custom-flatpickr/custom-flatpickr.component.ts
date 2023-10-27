import { EventEmitter, Component, Input, OnInit, Output, ViewEncapsulation, Injector, ChangeDetectionStrategy, AfterViewChecked } from "@angular/core";
import { createCustomInputControlValueAccessor, ControlComponent } from "@app/admin/core/controls/control.component";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js"
import * as moment from 'moment'

declare var $: JQueryStatic;

@Component({
    selector: 'date-control',
    templateUrl: './custom-flatpickr.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,

    providers: [createCustomInputControlValueAccessor(CustomFlatpickrComponent)]
})
export class CustomFlatpickrComponent extends ControlComponent implements OnInit, AfterViewChecked {

    @Input() name: string;
    @Input() inpCss: string;
    private _disabled = false;
    get disabled() {
        return this._disabled;
    }

    @Input() set disabled(value) {
        this._disabled = value;
        if (!this.inputRef.nativeElement._flatpickr || !this.inputRef.nativeElement._flatpickr.altInput) {
            return;
        }

        if (this.disabled) {
            $(this.inputRef.nativeElement._flatpickr.altInput).prop('disabled', true);
            $(this.inputRef.nativeElement).prop('disabled', true);
        }
        else {
            $(this.inputRef.nativeElement._flatpickr.altInput).prop('disabled', false);
            $(this.inputRef.nativeElement).prop('disabled', false);
        }
    }

    @Input() hasTime = false;

    @Output() change: EventEmitter<any> = new EventEmitter<any>();
    @Output() focusout: EventEmitter<any> = new EventEmitter<any>();


    _config: any;

    constructor(injector: Injector) {
        super(injector);
    }

    public get config() {
        return this._config;
    }
    @Input() public set config(value) {
        value['altInput'] = true;
        value['altFormat'] = this.s('gAMSProCore.DatePickerDisplayFormat');
        value['locale'] = Vietnamese;
        value['allowInput'] = true;
        value['dateFormat'] = this.s('gAMSProCore.DatePickerValueFormat');
        if (this.hasTime) {
            value['enableTime'] = true;
            value['time_24hr'] = true;
            value['altFormat'] += ' H:i'
            value['dateFormat'] += ' H:i'
        }
        this._config = value;
    }

    _ngModel: any;

    @Input() @Output() public get ngModel(): any {
        return this._ngModel;
    }

    registerOnChange(fn: any) {
        var t = this;
        this.onChangeCallback = function (value) {
            if (!t.hasTime && value && value instanceof moment) {
                value = value['startOf']('day');
            }
            fn(value);
        }

        if (this.waitingValue) {
            this.onChangeCallback(this.waitingValue);
            this.waitingValue = undefined;
        }
    }

    setNgModelValue(value) {
        this.ngModel = value;
    }

    updateControlView() {
        //this.initValue();
    }

    ngAfterViewChecked(): void {
        if (!this.ngModel) {
            $(this.inputRef.nativeElement._flatpickr.altInput).val('');
        }
    }

    public set ngModel(value) {
        if (typeof (value) == 'string') {
            value = value['toMoment']();
        }
        if (value && !this.hasTime && value instanceof moment) {
            value = value['startOf']('day');
            this.sendValueOut(value);
        }
        this._ngModel = value;
        this.initValue();
    }

    initValue() {
        if (!this._ngModel) {
            if (!this.inputRef.nativeElement._flatpickr) {
                return;
            }
            this.inputRef.nativeElement._flatpickr
                .setDate(undefined);
        }
        if (this.inputRef.nativeElement._flatpickr && this._ngModel && typeof (this._ngModel) != 'string') {
            setTimeout(() => {
                if (this._ngModel) {
                    var format = this.s('gAMSProCore.DatePickerValueFormat')
                        .replace('d', 'DD')
                        .replace('m', 'MM');
                    var a = this._ngModel;
                    this.inputRef.nativeElement._flatpickr
                        .setDate(this._ngModel.format(this.hasTime ? format + " HH:mm" : format));
                }

            })
        }
    }

    getDisplayFormat() {

        var format = this.s('gAMSProCore.DatePickerDisplayFormat').replace('D', 'DD')
            .replace('M', 'MM')
            .replace('Y', 'YYYY')
            .replace('d', 'DD')
            .replace('m', 'MM')
            .replace('y', 'YYYY')
        return this.hasTime ? format + ' HH:mm' : format;
    }
    getDisplayFormat1() {
        var format = this.s('gAMSProCore.DatePickerDisplayFormat')
            .replace('Y', 'YYYY')
            .replace('d', 'D')
            .replace('m', 'M')
            .replace('y', 'YYYY');
        return this.hasTime ? format + ' HH:mm' : format;
    }
    getFlatpickDisplayFormat() {

        var format = this.s('gAMSProCore.DatePickerDisplayFormat').replace('D', 'DD')
            .replace('M', 'MM')
            .replace('Y', 'YYYY')
            .replace('d', 'DD')
            .replace('m', 'MM')
            .replace('y', 'YYYY')
        return this.hasTime ? format + ' H:i' : format;
    }

    onChange() {
        const input = <HTMLInputElement>this.inputRef.nativeElement;
        // get value from text area
        var newValue = input.value;

        if (!newValue) {
            newValue = '';
        }

        // update the form
        if (this.onChangeCallback) {
            if (this.waitingValue) {
                this.onChangeCallback(this.waitingValue);
                this.waitingValue = undefined;
            }
            else {
                var format = this.s('gAMSProCore.DatePickerValueFormat')
                    .replace('D', 'DD')
                    .replace('M', 'MM')
                    .replace('Y', 'YYYY')
                    .replace('d', 'DD')
                    .replace('m', 'MM')
                    .replace('y', 'YYYY');
                var value = moment(newValue, this.hasTime ? format + ' HH:mm' : format);
                this.onChangeCallback(value);

                this.change.emit(this._ngModel);
            }
        }

        this.onChangeEvent.emit(this.inputRef);
        this.onChangeOverride(newValue);
    }


    // tu dong chon ngay khi nhap dung dinh dang
    afterViewInit() {
        $(this.inputRef.nativeElement._flatpickr.altInput).attr('placeholder', this.getDisplayFormat());
        var scope = this;

        let keyEnterSubmitForm = true;

        let functProcess = function () {
            let isDateValid = moment(this.value, scope.getDisplayFormat(), true).isValid() ||
                moment(this.value, scope.getDisplayFormat1(), true).isValid();
            if (isDateValid && this.value.length >= 10) {
                let keyEnter = {
                    view: window,
                    keyCode: 13,
                    bubbles: true,
                    cancelable: true,
                };
                keyEnterSubmitForm = false;
                const event = new KeyboardEvent('keydown', keyEnter);
                this.dispatchEvent(event);
                this.focus();
                keyEnterSubmitForm = true;
            }
        }

        $(this.inputRef.nativeElement._flatpickr.altInput).on('input', functProcess);
        $(this.inputRef.nativeElement._flatpickr.altInput).on('paste', functProcess);

        $(this.inputRef.nativeElement._flatpickr.altInput).on('keydown', function (e) {
            if (e.keyCode == 13) {
                let form = $(this).closest('form');
                if (form.length && keyEnterSubmitForm) {
                    form.find('button:submit').click();
                }
            }
        });

        $(this.inputRef.nativeElement._flatpickr.altInput).on('focusout', function () {
            let isDateValid = moment(this.value, scope.getDisplayFormat(), true).isValid() ||
                moment(this.value, scope.getDisplayFormat1(), true).isValid();


            if (isDateValid && this.value.length < 10) {
                let keyEnter = {
                    view: window,
                    keyCode: 13,
                    bubbles: true,
                    cancelable: true,
                };
                const event = new KeyboardEvent('keydown', keyEnter);
                this.dispatchEvent(event);
            }

            scope.sendValueOut(moment(this.value, scope.getDisplayFormat(), true));
            $(scope.ref.nativeElement).focus();

            if (!isDateValid) {
                this.value = null;
                scope.inputRef.nativeElement._flatpickr.setDate(null);
                scope.sendValueOut(undefined);
            }
        });
    }

    ngOnInit(): void {

        this.config = {};

        $(this.inputRef.nativeElement).flatpickr(this._config);
        if (this.disabled) {
            $(this.inputRef.nativeElement._flatpickr.altInput).prop('disabled', true);
        }
        else {
            $(this.inputRef.nativeElement._flatpickr.altInput).prop('disabled', false);
        }
        this.initValue();
    }
}
