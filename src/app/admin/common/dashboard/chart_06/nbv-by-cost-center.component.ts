import { AfterViewChecked, AfterViewInit,ViewEncapsulation,Injector, ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as echarts from '../../../../../assets/echart/echarts.min.js';
@Component({
  selector: 'nbv-by-cost-center',
  templateUrl: './nbv-by-cost-center.component.html',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  //encapsulation: ViewEncapsulation.None,
})
export class NBVByCostCenterComponent extends DefaultComponentBase implements OnInit  {
  constructor(
      injector: Injector
      ) {
      super(injector);
	}

  @Input() barChartOptions: any = {};
  @Input() barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  chartColors: any[] = [
    { backgroundColor:"#1BABF7" },
    { backgroundColor:"#F68709" },
  ];

  @Input() barChartData: any[] = [];
  //series: any;
	ngOnInit(): void {
    if(this.barChartData.length==0){
      this.barChartData= [
        { data: [0,0], label: 'Series A',stack: 'a' },
        { data: [0,0], label: 'Series B',stack: 'a' }
      ];
    }
	}
  // onSetValue(data_Increase: any[],data_Decrease: any[],dataX: any[]){
  //   let barWidth=0;
  //   if(data_Increase.length<6){
  //     barWidth=70;
  //   }
  //   else barWidth=30;

  //   var option = {
  //       legend: {
  //         show:true,
  //         left:'right',
  //       },
  //       tooltip: {
  //         //trigger: 'axis',
  //         //axisPointer: { type: 'cross' }
  //       },
  //       xAxis: {
  //         type: 'category',
  //         data: dataX,//[ 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11','T12'],
  //         axisLabel: {
  //           fontSize: 12,
  //           interval: 0,
  //         },
  //       },
  //       yAxis: {
  //         show: true,
  //         type: 'value',
  //         axisLabel: {
  //           formatter: (function(value){
  //             return '';
  //           })
  //         }
  //       },
  //       //chỉnh thêmlayout
  //       grid: {
  //           left: '0%',
  //           right: '2%',
  //           //bottom: '45%',
  //           containLabel: true
  //         },
  //       series: [
  //         {
  //           name: this.l('Increase'),
  //           type: 'bar',
  //           stack:'true',
  //           color:'#1BABF7',
  //           barWidth:barWidth,
  //           label:{
  //             show: true,
  //             position: "inside",
  //             fontSize:12
  //           },
  //           data:data_Increase //[18203, 23489, 29034, 104970, 131744, 630230]
  //         },
  //         {
  //           name: this.l('Decrease'),
  //           type: 'bar',
  //           stack:'true',
  //           color:'#F58F14',
  //           barWidth:barWidth,
  //           label:{
  //             show: true,
  //             position: "inside",
  //             fontSize:12
  //           },
  //           data:data_Decrease// [-19325, -23438, -31000, -121594, -134141, -681807]
  //         }
  //       ]
  //   };
  //   setTimeout(x=>{
  //     var dom = document.getElementById("container");
  //     var myChart = echarts.init(dom);
  //     if(option&&typeof option==='object'){
  //         myChart.setOption(option);
  //     }
  //   },2400);
  //   this.series=option;
  // }
  // SetValue(option: any){
  //     var dom = document.getElementById("container");
  //     var myChart = echarts.init(dom);
  //     setTimeout(x=>{
  //       if(option&&typeof option==='object'){
  //         myChart.setOption(option);
  //     }
  //     },2400);
  // }
  // onResize(event) {
  //     this.SetValue(this.series);
  //     var dom = document.getElementById("container");
  //     var myChart = echarts.init(dom);
  //     myChart.resize();
  // }
}
