import { Component, Injector, Input, OnInit } from "@angular/core";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { Chart } from "chart.js";

@Component({
    selector: 'project-type-chart',
    templateUrl: './project-type-chart.component.html',
})
export class ProjectTypeChart extends DefaultComponentBase implements OnInit {
    constructor(
        injector: Injector
        ) {
        super(injector);
	}

    @Input() projectTypeData;

    chart: any;
    chartLabels = ['Dự án đầu tư', 'Dự án thu mua', 'Bất động sản riêng lẻ']
    chartOptions: any = {
        plugins: {
            datalabels: {
                display: false
            }
        },
        title: {
            text: 'Tỷ lệ dự án đầu tư, dự án thu mua và bất động sản riêng lẻ',
            display: true
        },
        responsive: true,
    }; 

    ngOnInit(): void {
        this.createChart()
    }
    
    createChart(){
        this.chart = new Chart("ProjectTypeChart", {
          type: 'pie', //this denotes tha type of chart
    
          data: {// values on X-Axis
            labels: this.chartLabels,
            datasets: [
            {
                data: this.projectTypeData ? [this.projectTypeData.dtProject, this.projectTypeData.tmProject, this.projectTypeData.rlProject] : [0,0,0],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
            }
            ]
          },
          options: this.chartOptions
          
        });
      }
}