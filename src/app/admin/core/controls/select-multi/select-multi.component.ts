import { Component, Input, OnInit, Output, ViewChild, EventEmitter, ElementRef, Injector, ChangeDetectionStrategy, AfterViewChecked, AfterContentChecked } from "@angular/core";
import { createCustomInputControlValueAccessor, ControlComponent } from "@app/admin/core/controls/control.component";

declare var $: JQueryStatic;

@Component({
	selector: 'select-multi',
	templateUrl: './select-multi.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [createCustomInputControlValueAccessor(SelectMultiComponent)]
})
export class SelectMultiComponent extends ControlComponent implements OnInit {
	constructor(
		injector: Injector
	) {
		super(injector);
	}

	private _listItem: any[];
	public get listItem(): any[] {
		return this._listItem;
	}
	public set listItem(value: any[]) {
		this._listItem = value;
	}

	@ViewChild("control") inputRef: ElementRef;
	@Input() valueMember: string;
	@Input() displayMember: string;
	@Input() emptyText: string;
	@Input() inputCss: string;
	_disabled: boolean;

	get disabled(): boolean {
		return this._disabled || !(this.ref.nativeElement.getAttribute('disabled') == null) && !(this.ref.nativeElement.getAttribute('disabled') == undefined);
	}


	@Input() set disabled(value: boolean) {
		this._disabled = value;
	}

	_list: Array<any>;

	v: any;

	getDisplay(item) {
		if (item[this.valueMember] == null) {
			return this.emptyText;
		}

		if (item[this.valueMember] == ' ') {
			return item[this.displayMember.substr(this.displayMember.indexOf('|') + 1)];
		}

		return this.displayMember.split('|').map(x => item[x]).join(' - ');
	}

	getArrayChecked() {
		let arr = [];

		$(this.inputRef.nativeElement).find('>option:checked').each(function () {
			arr.push(this.value.substr(3))
		})

		return arr;
	}

	createSelect2() {
		var scope = this;
		if (this.inputRef.nativeElement['isCreatedSelect2']) {
			return;
		}
		this.inputRef.nativeElement['isCreatedSelect2'] = true;
		$(this.inputRef.nativeElement).select2({ width: '100%' }).on('select2:select', function (e) {
			let list: any[] = scope.getArrayChecked();
			var value = list.join(';');
			scope.listItem = list;
			scope.sendValueOut(value);
		});
		$(this.inputRef.nativeElement).select2({ width: '100%' }).on('select2:unselect', function (e) {
			let list: any[] = scope.getArrayChecked();
			var value = list.join(';');
			scope.listItem = list;
			scope.sendValueOut(value);
		});

		$(this.inputRef.nativeElement).trigger('change', 'select2')
	}


	afterViewInit() {
		this.createSelect2();
	}

	ngOnInit(): void {
		this.createSelect2();
	}

	@Input() public set ngModel(value) {
		if (!value) {
			value = '';
		}

		if (value.indexOf('v--') == 0) {
			this.sendValueOut(this.ngModel);
			return;
		}

		this.listItem = value.split(';');

		if (!this._list) {
			return;
		}

		// let v = this.listItem.map(x => $(this.inputRef.nativeElement).find('>option').filter((k, v) => v.value.indexOf("'" + x + "'") >= 0).val());

		$(this.inputRef.nativeElement).val(this.listItem.map(x => 'v--' + x)).change();
		this.v = this.listItem;
		$(this.inputRef.nativeElement).trigger('change', 'select2')
		this.sendValueOut(this.ngModel);
	}

	public get ngModel(): any {
		return this.getArrayChecked().join(';');
	}


	@Input() public set list(pList) {
		if (pList == this._list) {
			return;
		}
		this._list = pList;
		this.updateView();
		this.createSelect2();
		if (pList && this.listItem) {

			// let v = this.listItem.map(x => $(this.inputRef.nativeElement).find('>option').filter((k, v) => v.value.indexOf("'" + x + "'") >= 0).val());

			$(this.inputRef.nativeElement).val(this.listItem.map(x => 'v--' + x)).change();
			this.v = this.listItem;
			$(this.inputRef.nativeElement).trigger('change', 'select2')
			this.sendValueOut(this.ngModel);
		}
		// $(this.inputRef.nativeElement).trigger("change.select2")
		// this.updateView.emit(null);
	}
}
