import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { Chart } from "chart.js";
import * as moment from "moment";

@Component({
    selector: 'expired-contract-chart',
    templateUrl: './expired-contract-chart.component.html',
})
export class ExpiredContractChart extends DefaultComponentBase implements OnInit, OnChanges {
    constructor(
        injector: Injector
        ) {
        super(injector);
	}
    @Input() contractData;
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
            text: 'Số lượng hợp đồng tới ngày đáo hạn năm ' + this.selectedYear,
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
        // this.changeChart()
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['contractData']) {
            if(this.chart) {
                this.changeChart();
            }
        }
    }
    
    createChart(){
        this.chart = new Chart("ExpiredContractChart", {
          type: 'bar', //this denotes tha type of chart
    
          data: {// values on X-Axis
            labels: this.chartLabels,
            datasets: [
            {
                label: "Hợp đồng",
                data: [],
                backgroundColor: 'limegreen',
            }
            ]
          },
          options: this.chartOptions
          
        });
    }
    
    changeChart() {
        var contractCounts = [];
        for(let i=1; i<=12; i++) {
            let contract = this.contractData ? this.contractData.find(e=> e.month==i && e.year==this.selectedYear) : null;
            if(contract){
                contractCounts.push(contract.count)
            }
            else {
                contractCounts.push(0)
            }
        }

        this.chart.data.datasets[0].data = contractCounts
        this.chart.options.title.text = 'Số lượng hợp đồng tới ngày đáo hạn năm ' + this.selectedYear
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