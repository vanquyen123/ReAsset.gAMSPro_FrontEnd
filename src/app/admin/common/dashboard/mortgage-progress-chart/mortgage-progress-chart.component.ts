import { Component, Injector, Input, OnInit } from "@angular/core";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { Chart } from "chart.js";

@Component({
    selector: 'mortgage-progress-chart',
    templateUrl: './mortgage-progress-chart.component.html',
})
export class MortgageProgressChart extends DefaultComponentBase implements OnInit {
    constructor(
        injector: Injector
        ) {
        super(injector);
	}

    @Input() mortgageData;
    chart: any;
    chartLabels = ['Dự án', 'Khu đất', 'Sổ đỏ']
    chartOptions: any = {
        plugins: {
            datalabels: {
                display: false
            }
        },
        title: {
            text: 'Số lượng dự án, khu đất, sổ đỏ đã thế chấp',
            display: true
        },
        responsive: true,
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                display: true,
                offset: true,
                ticks: {
                source: 'data'
                },
                barThickness: 20,
                // grouped: false,
                stacked: true,
            }],
        },
    }; 

    ngOnInit(): void {
        this.createChart()
    }
    
    createChart(){
        this.chart = new Chart("MortgageProgressChart", {
          type: 'horizontalBar', //this denotes tha type of chart
    
          data: {// values on X-Axis
            labels: this.chartLabels,
            datasets: [
            {
                label: "Đã thế chấp",
                data: this.mortgageData ? [this.mortgageData.projectInMortgage, this.mortgageData.landAreaInMortgage, this.mortgageData.soDoInMortgage] : [0,0,0],
                backgroundColor: 'rgb(50, 205, 50)',
            },
            {
                label: "Tổng",
                data: this.mortgageData ? [this.mortgageData.totalProject, this.mortgageData.totalLandArea, this.mortgageData.totalSoDo] : [0,0,0],
                backgroundColor: 'rgb(50, 205, 50, 0.5)',
            }
            ]
          },
          options: this.chartOptions
          
        });
      }
}