import { Injector,AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
//import * as echarts from '../../../../../assets/echart/echarts.min.js';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
// Pie Chart
@Component({
  selector: 'classification-by-nature',
  templateUrl: './classification-by-nature.component.html',
})
export class ClassificationByNatureComponent extends DefaultComponentBase implements OnInit {
  constructor(
      injector: Injector,
      //private cdr: ChangeDetectorRef, 
      //private ref : ElementRef
      ) {
      super(injector);
	}
  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: { position: 'right' },
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const xLabel = context.chart.config.data.labels[context.dataIndex];
          const datasetLabel = context.dataset.label;
          return '';
        }
      }
    }
  };
  @Input() pieChartLabels: Label[] = [];
  @Input() pieChartData: SingleDataSet = [];
  chartColors: any[] = [
    { 
      backgroundColor:['#1FACF3','#F49214','#BEC3C4','#EFDE31','#1578E0','#30A80A','#0D5E77','#CA0C18','#7FDF9D','#E8A407']
  }];
  pieChartType: ChartType = 'pie';
  pieChartLegend = {show:true };
  pieChartPlugins = [];

	ngOnInit(): void {
	}

  // onSetValue(seriesData: any[]) {
  //   this.seriesData=seriesData;
  //   var option = {
  //       title: {
  //         //text: 'PIE CHART 2',
  //         //subtext: '纯属虚构',
  //         left: 'center',
  //       },
  //       tooltip: {
  //         trigger: 'item',
  //         formatter: '{a} <br/>{b} : {c} ({d}%)'
  //       },
  //       legend: {
  //         type: 'scroll',
  //         orient: 'vertical',
  //         right: '10',
  //         top: 0,
  //         textStyle: {
  //           fontSize: '12',
  //         },
  //         bottom: 20,
  //       },
  //       series: [
  //         {
  //           name: this.l('Cost Center Group'),
  //           type: 'pie',
  //           radius: '75%',
  //           center: ['35%', '50%'],
  //           data: seriesData,
  //           label: false,
  //           labelLine: false,
  //           itemStyle: {
  //               borderColor: '#fff',
  //               borderWidth: 1.5
  //           },
  //         }
  //       ]
  //     };
  //   setTimeout(() => {
  //     var dom = document.getElementById("doughnutChart");
  //     var myChart = echarts.init(dom);
  //     if (option && typeof option === 'object') {
  //         myChart.setOption(option);
  //     }
  //   }, 2400);
  // }

  // onResize(event) {
  //     this.onSetValue(this.seriesData);
  //     var dom = document.getElementById("doughnutChart");
  //     var myChart = echarts.init(dom);
  //     myChart.resize();
  // }
}
