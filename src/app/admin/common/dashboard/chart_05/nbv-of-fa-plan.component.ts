import { Injector,AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { data } from 'jquery';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
// import * as echarts from '../../../../../assets/echart/echarts.min.js';
@Component({
  selector: 'nbv-of-fa-plan',
  templateUrl: './nbv-of-fa-plan.component.html',
})
export class NBVOfFaInPlanComponent extends DefaultComponentBase implements OnInit {
    constructor(
        injector: Injector
        //private cdr: ChangeDetectorRef, 
        //private ref : ElementRef
        ) {
        super(injector);
	}
  
  barChartOptions: any = {
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        gridLines: {
            //drawTicks:false,
            display: false,
            tickMarkLength: 18,
        }
      }],
      yAxes: [
          {
            formatter: (value,context) => {
            const xLabel = context.chart.config.data.labels[context.dataIndex];
            const datasetLabel = context.dataset.label;
            
              return (value) ;
            },
            gridLines: {
              //drawTicks:false,
              tickMarkLength: 10,
          },
          barThickness: 47,
        }
      ]
    },
    plugins: { datalabels: {
       anchor: 'end', 
       align: 'end', 
       
       formatter: (value,context) => {
        const xLabel = context.chart.config.data.labels[context.dataIndex];
        const datasetLabel = context.dataset.label;
        
        return (value) ;
      }
      } }
  };
  @Input() barChartLabels: any[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  public chartColors: any[] = [
    { backgroundColor:"#1BABF7" }
  ];
  @Input() barChartData: any[] = [];

  // seriesX: any[]=[];
  // seriesY: any[]=[];
	ngOnInit(): void {
    if(this.barChartData.length==0){
      this.barChartData = [
        { data: [0], label: '' }
      ];
    }
	}
//   textInline(value) {
//     // debugger
//     var ret = ""; 
//     var maxLength = 3; 
//     var valLength = value.length; 
//     var rowN = Math.ceil(valLength / maxLength); 
//     if (rowN > 1) 
//     {
//         for (var i = 0; i < rowN; i++) {
//             var temp = ""; 
//             var start = i * maxLength; 
//             var end = start + maxLength; 
//             temp = value.substring(start, end) + "\n";
//             ret += temp; 
//         }
//         return ret;
//     } else {
//         return value;
//     }
// }
//   onSetValue(dataX: any[],dataY: any[]) {
//     this.seriesX=dataX;
//     this.seriesY=dataY;
//     var option = {
//       tooltip: {
//         //trigger: 'axis',
//         //axisPointer: { type: 'cross' }
//       },
//       grid: {
//         left: '0%',
//         right: '3%',
//         bottom: '-4%',
//         containLabel: true
//       },
//       xAxis: {
//         type: 'category',
//         axisLabel: {
//           fontSize: 12,
//           interval: 0,
//           formatter: function(value) {
//             var ret = "";
//             var maxLength = 3;
//             var valLength = value.length;
//             var rowN = Math.ceil(valLength / maxLength);
//             if (rowN > 1)
//             {
//                 for (var i = 0; i < rowN; i++) {
//                     var temp = "";
//                     var start = i * maxLength;
//                     var end = start + maxLength;
//                     temp = value.substring(start, end+4) + "\n";
//                     ret += temp;
//                 }
//                 return ret;
//             } else {
//                 return value;
//             }
//           }
//         },
//         data: dataX,//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        
//       },
//       yAxis: {
//         show: false,
//         type: 'value'
//       },
//       series: [
//         {
//           label: {
//               show: true,
//               position: [0, -16],
//           },  
//           showBackground: false,
//           color: '#1BABF7',
//           barWidth:20,
//           data: dataY,//[120, 200, 150, 80, 70, 110, 130],
//           type: 'bar'
//         }
//       ]
//     };
    
//     setTimeout(() => {
//       var dom = document.getElementById("BarChartMulti");
//       var myChart = echarts.init(dom);
//       if (option && typeof option === 'object') {
//         myChart.setOption(option);
//       }
//     }, 2400);
//   }

//   onResize(event) {
//     this.onSetValue(this.seriesX,this.seriesY);
//     var dom = document.getElementById("BarChartMulti");
//     var myChart = echarts.init(dom);
//     myChart.resize();
//   }

}
