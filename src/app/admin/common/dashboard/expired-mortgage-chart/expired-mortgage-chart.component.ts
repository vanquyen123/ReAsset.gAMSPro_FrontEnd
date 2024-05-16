import { Component, Injector, Input, OnInit } from "@angular/core";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { Chart } from "chart.js";
import * as moment from "moment";

@Component({
    selector: 'expired-mortgage-chart',
    templateUrl: './expired-mortgage-chart.component.html',
})
export class ExpiredMortgageChart extends DefaultComponentBase implements OnInit {
    constructor(
        injector: Injector
        ) {
        super(injector);
	}

    @Input() mortgageData;
    selectedYear = moment().year()
    
    chart: any;
    chartLabels = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"]
    chartOptions: any = {
        plugins: {
            datalabels: {
                display: false
            }
        },
        title: {
            text: 'Số lượng thế chấp tới ngày đáo hạn năm ' + this.selectedYear,
            display: true
        },
        responsive: true,
        scales: {
            xAxes: [{
                display: true,
                offset: true,
                ticks: {
                source: 'data',
                },
                barThickness: 20,
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
        this.changeChart()
    }
    
    createChart(){
        this.chart = new Chart("ExpiredMortgageChart", {
          type: 'bar', //this denotes tha type of chart
    
          data: {// values on X-Axis
            labels: this.chartLabels,
            datasets: [
            {
                label: "Thế chấp",
                data: [],
                backgroundColor: 'limegreen',
            }
            ]
          },
          options: this.chartOptions
          
        });
    }

    changeChart() {
        var mortgageCounts = [];
        for(let i=1; i<=12; i++) {
            let mortgage = this.mortgageData ? this.mortgageData.find(e=> e.month==i && e.year==this.selectedYear) : null;
            if(mortgage){
                mortgageCounts.push(mortgage.count)
            }
            else {
                mortgageCounts.push(0)
            }
        }

        this.chart.data.datasets[0].data = mortgageCounts
        this.chart.options.title.text = 'Số lượng thế chấp tới ngày đáo hạn năm ' + this.selectedYear
        this.chart.update()
        this.updateView()
    }

    setToPreviouYear() {
        this.selectedYear-=1;
        this.changeChart()
    }

    setToNextYear() {
        this.selectedYear+=1;
        this.changeChart()
    }
}