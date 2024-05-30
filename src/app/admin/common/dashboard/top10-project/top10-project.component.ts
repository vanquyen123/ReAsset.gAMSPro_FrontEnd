import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
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
    
    @Input() projectList: any[] = [];

    // projectList = [
    //     {
    //         projecT_ID: "PRJ100001",
    //         projecT_NAME: "Chung cư Đồng Nai",
    //         projecT_VALUATION: 1000000000
    //     },
    //     {
    //         projecT_ID: "PRJ100002",
    //         projecT_NAME: "Chung cư TP.HCM",
    //         projecT_VALUATION: 2000000000
    //     }
    // ]
    
    ngOnInit(): void {
    }

    // ngOnChanges(changes: SimpleChanges): void {
    //     if (changes['projectList']) {
    //         this.updateView();
    //     }
    // }

    onViewDetail(projecT_ID: string): void {
        this.navigatePassParam('/app/admin/project-view', { project: projecT_ID }, undefined);
    }
}