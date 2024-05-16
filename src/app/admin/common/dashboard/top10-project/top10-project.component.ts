import { Component, Injector, OnInit } from "@angular/core";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";

@Component({
    selector: 'top10-project',
    templateUrl: './top10-project.component.html',
})
export class Top10Project extends DefaultComponentBase implements OnInit {
    constructor(
        injector: Injector
        ) {
        super(injector);
	}

    projectList = [
        {
            projecT_ID: "PRJ100001",
            projecT_NAME: "Project 1",
            projecT_VALUATION: 100000
        },
        {
            projecT_ID: "PRJ100002",
            projecT_NAME: "Project 2",
            projecT_VALUATION: 100000
        }
    ]
    
    ngOnInit(): void {
    }

    onViewDetail(projecT_ID: string): void {
        this.navigatePassParam('/app/admin/project-view', { project: projecT_ID }, undefined);
    }
}