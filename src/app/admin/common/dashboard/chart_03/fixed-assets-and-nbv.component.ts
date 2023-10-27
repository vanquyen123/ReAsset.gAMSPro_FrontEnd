import { Injector,AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as echarts from '../../../../../assets/echart/echarts.min.js';
@Component({
  selector: 'fixed-assets-and-nbv',
  templateUrl: './fixed-assets-and-nbv.component.html',
})
export class FixedAssetsAndNBVComponent extends DefaultComponentBase implements OnInit {
    constructor(
        injector: Injector
        //private cdr: ChangeDetectorRef, 
        //private ref : ElementRef
        ) {
        super(injector);
	}

  @Input() data: ChartDataSets[]=[];
  genFormatter = (series) => {
    return (param) => {
        let sum = 0;
        series.forEach(item => {
            sum += item.data[param.dataIndex];
        });
        return ' '+sum+'%';
    }
  };
  isLastSeries(index: any,series: any) {
    return index === series.length - 1
  }

  barChartOptions: any = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{
        display: true,
        gridLines: {
          //drawTicks:false,
          //display: false,
          //borderDash: [4, 4],
          //color: "rgba(64,64,64,100)",
          tickMarkLength: 10,
        },
      }],
      yAxes: [
        {
          display:  true,
          gridLines: {
            display: false,
            //borderDash: [4, 4],
            //color: "rgba(64,64,64,100)",
            //tickMarkLength: 20
          },
          barThickness: 40,
        }
      ]
    },
    plugins: {
      datalabels: {
        // anchor: 'center',
        // align: 'end',
        clamp: true,
        rotation: 0,
        font: {
          size: 12,
        },
        formatter: (value,context) => {
          const xLabel = context.chart.config.data.labels[context.dataIndex];
          const datasetLabel = context.dataset.label;
          if(context.dataset.backgroundColor=="transparent")
          {
            return (value)+'%'
          }
          return (value) ;
        }
      }
    }
  };
  chartColors: any[] = [
    { backgroundColor:"#1BABF7" },
    { backgroundColor:"#F68709" },
    { backgroundColor:"transparent" }
  ];
  barChartLabels: Label[] = ['FCV  ', 'FCH  '];
  barChartType: ChartType = 'horizontalBar';
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];

  @Input() barChartData: any[] = [];
	ngOnInit(): void {
    if(this.barChartData.length==0){
      this.barChartData=[
        { data: [0, 0,0], label: 'FCV', stack:'a' },
        { data: [0, 0,0], label: 'FCH', stack:'a' },
        { data: [0,0,0], label: '', stack:'a' }
      ];
    }
	}
  //series: any[]=[];
  //   onSetValue(series: any[]){
  //     this.series=series;
  //     var option = {
  //       tooltip: {
  //         //trigger: 'axis',
  //         //axisPointer: { type: 'cross' }
  //       },
  //       legend: {
  //         show:true,
  //         //data:['FCV', 'FCH'],
  //         textStyle: {
  //           fontSize: '10',
  //         },
  //       },
  //       grid: {
  //         left: '3%',
  //         right: '4%',
  //         bottom: '45%',
  //         containLabel: true
  //       },
  //       xAxis: {
  //         type: 'value',
            
  //       },
  //       yAxis: {
  //         type: 'category',
  //         data: ['FCV', 'FCH']
  //       },
  //       plugins: {
  //           datalabels: {
  //             anchor: 'end',
  //             align: 'end',
  //             font: {
  //               size: 20,
  //             }
  //           }
  //       },
  //       series: series.map((item, index) => Object.assign(item, {
  //         type: 'bar',
  //         stack: true,
  //         label: {
  //           show: true,
  //           formatter: this.isLastSeries(index,series) ? this.genFormatter(series) : null,
  //           fontSize:  this.isLastSeries(index,series) ? 15 : 13,
  //           color: 'black',
  //           position: this.isLastSeries(index,series) ? 'right' : 'inside'
  //         },
  //       })),
  //     };
  //     setTimeout(() => {
  //       var dom = document.getElementById("barChart");
  //       var myChart = echarts.init(dom);
  //       if (option && typeof option === 'object') {
  //         myChart.setOption(option);
  //       }
  //     }, 2400);
  //   }
  //   onResize(event) {
  //     this.onSetValue(this.series);
  //     var dom = document.getElementById("barChart");
  //     var myChart = echarts.init(dom);
  //     myChart.resize();
  // }
}
