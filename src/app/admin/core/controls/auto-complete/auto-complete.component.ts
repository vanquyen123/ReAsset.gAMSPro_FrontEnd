import { Component, Input, OnInit, Injector, Output, AfterViewInit, EventEmitter } from "@angular/core";
import { createCustomInputControlValueAccessor, ControlComponent } from "@app/admin/core/controls/control.component";

@Component({
    selector: "auto-complete",
    templateUrl: "./auto-complete.component.html",
    providers: [createCustomInputControlValueAccessor(AutoCompleteComponent)]
})

export class AutoCompleteComponent extends ControlComponent implements OnInit {

    id : string;

    constructor(
        injector: Injector
    ) {
        super(injector);
        this.id = this.generateUUID();
    }

    @Output() onChangeValue: EventEmitter<any> = new EventEmitter<any>();

    onChange() {
    }

    _ngModel: string;

    _checked: boolean;

    _list: Array<any>;

    @Input() fieldName: string;

    @Input() disabled: string;


    @Input() inputCss: string = 'form-control';

    setNgModelValue(value) {
        this.ngModel = value || '';
    }

    updateControlView() {
        this.inputRef.nativeElement.value = this.ngModel;
    }

    public get list(): Array<any> {
        return this._list;
    }

    @Input() public set list(pList) {
        if (pList) {
            $(this.inputRef.nativeElement).autocomplete({
                source: pList.map((x) => { return x[this.fieldName] }).filter(x => x)
            });
            this._list = pList;
        }
    }

    @Output() @Input() public get ngModel(): string {
        return this._ngModel;
    }
    public set ngModel(value) {
        this._ngModel = value;
    }

    onChangeInput(evt) {
        this.onChangeCallback(evt.target.value);
        this.onChangeValue.emit(this._list.firstOrDefault(x => x[this.fieldName] == evt.target.value));
    }

    afterViewInit() {

    }

    ngOnInit(): void {
    }
}