import { Injector,AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DefaultComponentBase } from "@app/ultilities/default-component-base";

@Component({
  selector: 'total-nbv',
  templateUrl: './total-nbv.component.html',
})
export class TotalNBVComponent extends DefaultComponentBase implements OnInit, AfterViewInit, AfterViewChecked {
  constructor(
        injector: Injector,
        //private cdr: ChangeDetectorRef, 
        //private ref : ElementRef
        ) {
        super(injector);
	}

	ngAfterViewChecked(): void {
	}

	ngAfterViewInit(): void {
	}

	ngOnInit(): void {
	}
	
  @Input() total: string = "";
  
  setValue(value: string){
      //unit = billion
      this.total = value;
      this.updateView();
  }
}
