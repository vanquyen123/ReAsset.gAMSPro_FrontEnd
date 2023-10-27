import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { ComponentBase } from "@app/ultilities/component-base";
import { PopupFrameComponent } from "../popup-frames/popup-frame.component";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import { CM_BRANCH_ENTITY, BranchServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { AuthStatusConsts } from "../../ultils/consts/AuthStatusConsts";
import { RecordStatusConsts } from "../../ultils/consts/RecordStatusConsts";
import { PopupBaseComponent } from "../../ultils/popup-base.component";

@Component({
    selector: "branch-modal",
    templateUrl: "./branch-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class BranchModalComponent extends PopupBaseComponent<CM_BRANCH_ENTITY> {
    constructor(injector: Injector,
        private branchService: BranchServiceProxy) {
        super(injector);
        this.filterInput = new CM_BRANCH_ENTITY();
        this.filterInput.top = 300;
        this.filterInput.brancH_LOGIN = this.appSession.user.subbrId;
        this.filterInput.autH_STATUS = 'A';
        this.filterInput.isLoadAll = true;

        this.keyMember = 'brancH_ID';

    }

    // Gắn cờ để có được search tất cả hay không : SearchAllFlag = true
    @Input() searchAllFlag: boolean = false;

    initComboFromApi(){
        this.branchService.cM_BRANCH_Search(this.getFillterForCombobox()).subscribe(result => {
            this.lstBranch = result.items;
            this.updateView();
        });
    }


    @Input() branchTitle: string = this.l('SearchBranchInfo') // branch use title: this.l('Search') + ' ' + this.l('BranchNameUse').toLowerCase()
    @Input() showColPotential: boolean = true
    @Input() showColAuthStatus: boolean = true


    lstBranch: CM_BRANCH_ENTITY[];
    async getResult(checkAll: boolean = false): Promise<any> {
        this.setSortingForFilterModel(this.filterInputSearch);

        // this.filterInputSearch.autH_STATUS = AuthStatusConsts.Approve;
        // this.filterInputSearch.recorD_STATUS = RecordStatusConsts.Active;

        if (!this.filterInputSearch.brancH_LOGIN && this.searchAllFlag == false) {
            this.filterInputSearch.brancH_LOGIN = this.appSession.user.subbrId;
        }

        if (checkAll) {
            this.filterInputSearch.maxResultCount = -1;
        }

        var result = await this.branchService.cM_BRANCH_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading())).toPromise();

        if (checkAll) {
            var item = "";
            this.selectedItems = result.items;
        }
        else {
            this.dataTable.records = result.items;
            this.dataTable.totalRecordsCount = result.totalCount;
            this.filterInputSearch.totalCount = result.totalCount;
        }

        return result;
    }
}
