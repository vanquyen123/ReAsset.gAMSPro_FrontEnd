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

    projectData: any[];
    sodoData: any[];
    expiredContractData: any[];
    projectTypeData;
    top10projects: any[];
    revenueData: any[];
    
    
    ngOnInit(): void {
        this.setDashBoardData()
        this.updateView()
	}

    setDashBoardData() {
        this._DashboardServiceProxy.getDataForDashboard().subscribe(response=>{
            this.projectData = response.soDoProjectDashboard.projectMetrics
            this.sodoData = response.soDoProjectDashboard.soDoMetrics
            this.expiredContractData = response.dueDateContractAndMortgage.dueDateContractMetrics
            this.projectTypeData = response.projectTypeDashboard
            this.top10projects = response.top10ProjectValuation.valuations;
            this.top10projects.forEach((project, index) => {
                project.projecT_NAME = "Dự án Evest " + (index + 1);
            })
            this.revenueData = response.totalRevenuePerMonth.totalRevenueMetrics;
            this.updateView()
        })
    }
}