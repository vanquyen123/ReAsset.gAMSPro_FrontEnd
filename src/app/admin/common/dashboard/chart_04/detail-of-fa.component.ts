import { Injector,AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
@Component({
  selector: 'detail-of-fa',
  templateUrl: './detail-of-fa.component.html',
})
export class DetailOfFaComponent extends DefaultComponentBase implements OnInit, AfterViewInit, AfterViewChecked {
    constructor(
        injector: Injector
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
}
