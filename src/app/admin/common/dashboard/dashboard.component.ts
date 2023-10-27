import { ClassificationByNatureComponent } from "./chart_02/classification-by-nature.component";
import { AfterViewInit, Component, Injector, ViewEncapsulation, ViewChild, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { DashboardServiceProxy, AllCodeServiceProxy } from '@shared/service-proxies/service-proxies';
import { ChangeDetectionComponent } from '@app/admin/core/ultils/change-detection.component';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import * as moment from 'moment';
import {NBVByCostCenterComponent} from './chart_06/nbv-by-cost-center.component'
import {NBVOfFaInPlanComponent} from './chart_05/nbv-of-fa-plan.component'
import {FixedAssetsAndNBVComponent} from './chart_03/fixed-assets-and-nbv.component'
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { isBuffer } from "lodash";
@Component({
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DashboardComponent extends DefaultComponentBase implements OnInit{
    constructor(injector: Injector,
        private _DashboardServiceProxy: DashboardServiceProxy,
        private el : ElementRef
        ){
        super(injector);
    }
    @ViewChild('dashboard_06') dashboard_06: NBVByCostCenterComponent;
    @ViewChild('dashboard_02') dashboard_02: ClassificationByNatureComponent;
    @ViewChild('dashboard_03') dashboard_03: FixedAssetsAndNBVComponent;
    @ViewChild('dashboard_05') dashboard_05: NBVOfFaInPlanComponent;
    value_d1: string ="";

    dashboard_02_pieChartData: any[]=[];
    dashboard_02_pieChartLabels: any[]=[];

    dashboard_03_barChartData: any[]=[];

    dashboard_05_barChartLabels: any[]=[];
    dashboard_05_barChartData: any[]=[];

    dashboard_06_barChartLabels: any[]=[];
    dashboard_06_barChartData: any[]=[];
    barThickness: Number=0;
    barChartOptions: any={};
    ngOnInit(): void {
       // this.setValue_Dashboard_01();
       // this.setValue_Dashboard_02();
       // this.setValue_Dashboard_05();
       // this.setValue_Dashboard_03();
       // this.setValue_Dashboard_06();

        let style:string =`
        classification-by-nature canvas{
            width:100% !important;
            height:100% !important;
        }
        classification-by-nature .chartjs-render-monitor{
            width:90% !important;
            height:90% !important;
        }
        nbv-of-fa-plan canvas {
            height:100% !important;
            width:100% !important;
        }
        fixed-assets-and-nbv canvas {
            height:100% !important;
            width:100% !important;
        }
        nbv-by-cost-center canvas {
            height:100% !important;
            width:100% !important;
        }
        `
        this.createStyle(style);

	}
    createStyle(style: string): void {
        const styleElement = document.createElement('style');
        styleElement.appendChild(document.createTextNode(style));
        this.el.nativeElement.appendChild(styleElement);
    }
    unitChart(){

    }
    setValue_Dashboard_01(){
        this._DashboardServiceProxy.getValue_Dashboard_01(this.appSession.user.userName,"").subscribe(result => {
            if(result!=null){
                this.value_d1=(result['SUMARY_REMAIN_VALUE'].toString())+" Tỷ";//.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
            }
            else{
                this.value_d1="...";
            }
            this.updateView();
        });
        
    }
    setValue_Dashboard_02(){
        this._DashboardServiceProxy.getValue_Dashboard_02(this.appSession.user.userName,"").subscribe(result => {
            if(result!=null){
                result.forEach(e => {
                    this.dashboard_02_pieChartData.push((Number)(e.values));
                    this.dashboard_02_pieChartLabels.push(e.grouP_NAME.toString());
                });
            }
            this.updateView();
        });
        this.updateView();
    }
    setValue_Dashboard_05(){
        var barChartLabels=[],barChartData=[];
        this._DashboardServiceProxy.getValue_Dashboard_05(this.appSession.user.userName,"").subscribe(result => {
            if(result!=null){
                result.forEach(x=>{
                    barChartLabels.push(x.lbl.toString());
                    barChartData.push((Number)(x.sum_value));
                })
                this.dashboard_05_barChartLabels=barChartLabels;
                this.dashboard_05_barChartData=[
                    { data: barChartData, label: '' }
                ];
            }
            this.updateView();
        });

        // { data: [65, 59, 80, 81, 56, 55, -40], label: 'Series A' },
        // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    }
    setValue_Dashboard_03(){
        this._DashboardServiceProxy.getValue_Dashboard_03(this.appSession.user.userName,"").subscribe(result => {
            if(result!=null){  
                this.dashboard_03_barChartData=[
                    { data: [result.SUMARY_GTKH_3860.toString(),result.SUMARY_GTCL_3860.toString()], label: this.l('Depreciation'), stack:'a' },
                    { data: [result.SUMARY_GTKH_3870.toString(),result.SUMARY_GTCL_3870.toString()], label: this.l('Residual value'), stack:'a' },
                    { data: ['               '+result.RATE_GTKH_3860.toString(),'               '+result.RATE_GTKH_3870.toString()], label: '', stack:'a' }
                ];
                this.updateView();
            }
            this.updateView();
        });
    }
    setValue_Dashboard_06(){
        var data_Increase=[], data_Decrease=[],dataX=[];
        this._DashboardServiceProxy.getValue_Dashboard_06(this.appSession.user.userName,"").subscribe(result => {
            if(result!=null){
                result.forEach(e => {
                    if(e.crdr.toString()=='C'){
                        data_Increase.push((Number)(e.value));
                        dataX.push('T'+e.month.toString());
                    }
                    else{
                        if((Number)(e.value)!=0)
                            data_Decrease.push((Number)(e.value));
                    } 
                    //let randomColor = "#"+Math.floor(Math.random()*16777215).toString(16);
                });
                
                if(data_Increase.length>5){
                    this.barThickness=30;
                }
                else {
                    this.barThickness=50;
                }
                this.dashboard_06_barChartLabels = dataX;
                this.dashboard_06_barChartData = [
                    { data: data_Increase, label: this.l('Increase'),stack: 'a' },
                    { data: data_Decrease, label: this.l('Decrease'),stack: 'a' }
                ];
                let barChartOptions = {
                    
                    responsive: true,
                    legend: { position: 'top' },
                    scales: {
                        x: {
                            min: 0,
                            max: 0
                          },
                        xAxes: [{
                        gridLines: {
                            //drawTicks:false,
                            display: false,
                            tickMarkLength: 20, 
                            zeroLineColor:'transparent'
                        },
                        barThickness: this.barThickness
                      }],
                      yAxes: [{
                        gridLines: {
                            display:true,
                            //drawTicks:false,
                        },
                         ticks: {
                            callback: function(value, index, values) {
                            return ' ';
                          }
                        }
                      }]
                    }
                };
                this.barChartOptions = barChartOptions;
                this.updateView();
            }
            this.updateView();
        });
    }
}