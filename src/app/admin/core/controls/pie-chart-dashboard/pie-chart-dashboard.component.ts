import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { ChartBaseComponent } from './chart-base.component';

@Component({
  selector: 'pie-chart-dashboard',
  templateUrl: './pie-chart-dashboard.component.html',
})
export class PieChartDashboardComponent extends ChartBaseComponent implements OnInit, AfterViewInit, AfterViewChecked {

  constructor(private cdr: ChangeDetectorRef, private ref : ElementRef) {
		super();
		monkeyPatchChartJsTooltip();
		monkeyPatchChartJsLegend();
		console.log(this);
	}

	ngAfterViewChecked(): void {
	}

	ngAfterViewInit(): void {
	}

	ngOnInit(): void {
	}

	@ViewChild(BaseChartDirective) chart: BaseChartDirective;
	sum = 0;
	// Pie
	public pieChartOptions: ChartOptions = {
		responsive: true,
		tooltips: {
			enabled: true,
			mode: 'single',
			callbacks: {
			  label: (tooltipItem, data) => {
				var label = data.labels[tooltipItem.index];
				var datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
				return label + ': ' + datasetLabel.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			  }
			}
		},
		plugins: {
			datalabels: {
				formatter: (value, ctx) => {
					let sum = 0;
					let dataArr : any[] = ctx.chart.data.datasets[0].data;
					
					dataArr.map(data => {
						sum += data;
					});
					
					// return ctx.chart.data.datasets[0].data
					if(value != 0){
						return value
					}
					// if(this.pieChartData.length <=2){
					// 	let percentage = (value*100 / sum).toFixed(1)+"%";
					// 	return percentage;
					// }
					// // if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
					// // 	let sum = datasets[0].data.reduce((a, b) => a + b, 0);
					// // 	let percentage = Math.round((value / sum) * 100) + '%';
					// // 	console.log(percentage)
					// // 	return percentage;
					// // }
					else{
						return '';
					}
				},
				
				color: '#000',
			},
		},
		legend: {position: 'bottom'},
		title: {fontColor: '#fff'}
	  };
	  public pieChartLabels: Label[] = [];
	  public pieChartData = [];
	  public pieChartType: ChartType = 'doughnut';
	  public pieChartLegend = false;
	  public pieChartPlugins = [];
	  public chartColors: Array<any> = [];

	  parseData(response) {
		let values = Object.values(response);

		let allData : any = values.reduce(function (flat : any[], toFlatten) {
			return flat.concat(toFlatten);
		  }, []);

		let n = allData.length;

		this.pieChartLabels = [];
		this.pieChartData = [];
		this.chartColors= [];
		
		let colors = [];

		for(let i=0;i<n;i++){
			let v : any[] = Object.values(allData[i]);
			this.pieChartLabels.push(v[0]);

			let c = v[1];
			colors.push(c);

			this.pieChartData.push(v[2]);
		}
		
		this.chartColors.push({ 
				backgroundColor: colors,
				borderColor: colors,
				pointBackgroundColor: colors,
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: colors
			}
		)

		this.chart.update();
		this.updateParentView();
	  }

	  updateParentView(preventChildUpdateView = false) {
		  var par = this.cdr['_view'].parent;
		  if (par && par.component && par.component.updateView) {
			  par.component.updateView(true, preventChildUpdateView);
		  }
	  }

}
