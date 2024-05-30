import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { Chart } from "chart.js";
import * as moment from "moment";

@Component({
    selector: 'project-sodo-chart',
    templateUrl: './project-sodo-chart.component.html',
})
export class ProjectSodoChart extends DefaultComponentBase implements OnInit, OnChanges {
    constructor(
        injector: Injector
        ) {
        super(injector);
	}

    @Input() projectData;
    @Input() sodoData;

    selectedYear = moment().year()
    yearNow = moment().year()

    chart: any;
    chartLabels: string[] = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"]
    chartOptions: any = {
        plugins: {
            datalabels: {
                display: false
            }
        },
        title: {
            text: 'Số lượng dự án và sổ đỏ được nhập vào ' + this.selectedYear,
            display: true
        },
        responsive: true,
        interaction: {
            intersect: false,
        },
        scales: {
            xAxes: [{
                display: true,
                offset: true,
                ticks: {
                source: 'data',
                },
                categoryPercentage: 0.7,
                barPercentage: 0.8,
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
        },
    }; 

    ngOnInit(): void {
        this.createChart()
        // this.changeChart()
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['projectData'] || changes['sodoData']) {
            if(this.chart) {
                this.changeChart();
            }
        }
    }
    
    createChart(){
        this.chart = new Chart("ProjectSodoChart", {
          type: 'bar', //this denotes tha type of chart
    
          data: {// values on X-Axis
            labels: this.chartLabels,
            datasets: [
            {
                label: "Dự án",
                data: [],
                backgroundColor: 'blue',
            },
            {
                label: "Sổ đỏ",
                data: [],
                backgroundColor: 'limegreen',
            }  
            ]
          },
          options: this.chartOptions
          
        });
    }

    changeChart() {
        var sodoCounts = [];
        var projectCounts = [];
        for(let i=1; i<=12; i++) {
            let project = this.projectData ? this.projectData.find(e=> e.month==i && e.year==this.selectedYear) : null;
            if(project){
                projectCounts.push(project.count)
            }
            else {
                projectCounts.push(0)
            }

            let sodo = this.sodoData ? this.sodoData.find(e=> e.month==i && e.year==this.selectedYear) : null;
            if(sodo){
                sodoCounts.push(sodo.count)
            }
            else {
                sodoCounts.push(0)
            }
        }

        this.chart.data.datasets[0].data = projectCounts
        this.chart.data.datasets[1].data = sodoCounts
        this.chart.options.title.text = 'Số lượng dự án và sổ đỏ được nhập vào ' + this.selectedYear
        this.chart.update()
        this.updateView()
    }

    setToPreviouYear() {
        if(this.selectedYear > 0) {
            this.selectedYear-=1;
        }
        this.changeChart()
    }

    setToNextYear() {
        if(this.selectedYear < this.yearNow) {
            this.selectedYear+=1;
        }
        this.changeChart()
    }
}