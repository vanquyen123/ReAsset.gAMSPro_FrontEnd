import { ClassificationByNatureComponent } from "./chart_02/classification-by-nature.component";
import { AfterViewInit, Component, Injector, ViewEncapsulation, ViewChild, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { DashboardServiceProxy, AllCodeServiceProxy } from '@shared/service-proxies/service-proxies';
import { ChangeDetectionComponent } from '@app/admin/core/ultils/change-detection.component';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import * as moment from 'moment';
import {NBVByCostCenterComponent} from './chart_06/nbv-by-cost-center.component'
import {NBVOfFaInPlanComponent} from './chart_05/nbv-of-fa-plan.component'
import {FixedAssetsAndNBVComponent} from './chart_03/fixed-assets-and-nbv.component'
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { isBuffer } from "lodash";
import { ProjectSodoChart } from "./project-sodo-chart/project-sodo-chart.component";
@Component({
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DashboardComponent extends DefaultComponentBase implements OnInit{
    constructor(injector: Injector,
        private _DashboardServiceProxy: DashboardServiceProxy,
        private el : ElementRef
        ){
        super(injector);
    }

    mockData = {
        soDoProjectDashboard: {
            soDoMetrics: [
                {
                    month: 1,
                    year: 2024,
                    count: 100
                },
                {
                    month: 3,
                    year: 2024,
                    count: 300
                },
                {
                    month: 10,
                    year: 2023,
                    count: 1000
                }
            ],
            projectMetrics: [
                {
                    month: 1,
                    year: 2024,
                    count: 100
                },
                {
                    month: 3,
                    year: 2024,
                    count: 300
                },
                {
                    month: 10,
                    year: 2023,
                    count: 1000
                }
            ]
          },
          dueDateContractAndMortgage: {
            dueDateContractMetrics: [
                {
                    month: 1,
                    year: 2024,
                    count: 100
                },
                {
                    month: 3,
                    year: 2024,
                    count: 300
                },
                {
                    month: 10,
                    year: 2023,
                    count: 1000
                }
            ],
            dueDateMortgageMetrics: [
                {
                    month: 1,
                    year: 2024,
                    count: 100
                },
                {
                    month: 3,
                    year: 2024,
                    count: 300
                },
                {
                    month: 10,
                    year: 2023,
                    count: 1000
                }
            ]
          },
          mortgageItemDashboard: {
            projectInMortgage: 15,
            totalProject: 20,
            landAreaInMortgage: 5,
            totalLandArea: 10,
            soDoInMortgage: 5,
            totalSoDo: 10
          },
          projectTypeDashboard: {
            dtProject: 10,
            tmProject: 10,
            rlProject: 10,
            totalProject: 30
          },
    }

    projectData: any[];
    sodoData: any[];
    expiredMortgageData: any[];
    expiredContractData: any[];
    mortgageProgressData;
    projectTypeData;
    
    
    ngOnInit(): void {
        this.setDashBoardData()
	}

    setDashBoardData() {
        // this._DashboardServiceProxy.getDataForDashboard().subscribe(response=>{
        //     this.projectData = response.soDoProjectDashboard.projectMetrics
        //     this.sodoData = response.soDoProjectDashboard.soDoMetrics
        //     this.expiredMortgageData = response.dueDateContractAndMortgage.dueDateMortgageMetrics
        //     this.expiredContractData = response.dueDateContractAndMortgage.dueDateContractMetrics
        //     this.mortgageProgressData = response.mortgageItemDashboard
        //     this.projectTypeData = response.projectTypeDashboard
        // })
        this.projectData = this.mockData.soDoProjectDashboard.projectMetrics
        this.sodoData = this.mockData.soDoProjectDashboard.soDoMetrics
        this.expiredMortgageData = this.mockData.dueDateContractAndMortgage.dueDateMortgageMetrics
        this.expiredContractData = this.mockData.dueDateContractAndMortgage.dueDateContractMetrics
        this.mortgageProgressData = this.mockData.mortgageItemDashboard
        this.projectTypeData = this.mockData.projectTypeDashboard

    }
}