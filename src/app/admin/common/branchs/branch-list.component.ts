import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { BranchServiceProxy, CM_BRANCH_ENTITY, ReportInfo, AsposeServiceProxy, } from "@shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import * as $ from 'jquery';
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './branch-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class BranchListComponent extends ListComponentBase<CM_BRANCH_ENTITY> implements IUiAction<CM_BRANCH_ENTITY>, OnInit, AfterViewInit {

    filterInput: CM_BRANCH_ENTITY = new CM_BRANCH_ENTITY();

    constructor(injector: Injector,
        private _branchService: BranchServiceProxy,
        private asposeService: AsposeServiceProxy,
        private fileDownloadService: FileDownloadService, ) {
        super(injector);
        this.initFilter();
        this.pagingClient = true;
    }

    initDefaultFilter() {
        this.filterInput.top = 200;
    }

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('Branch', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
        
        setTimeout(()=>{this.filterInputSearch=this.filterInput,this.search()}, 1000);
    }

    ngAfterViewInit(): void {
        // COMMENT: this.stopAutoUpdateView();
    }

    search(): void {

        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        // this._branchService.cM_BRANCH_Search(this.filterInputSearch)
        //     .pipe(finalize(() => this.hideTableLoading()))
        //     .subscribe(result => {
        //         this.setRecords(result);
        //         this.appToolbar.setEnableForListPage();
        //         this.updateView();
        //     });
        this._branchService.cM_BRANCH_GetAll(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.setRecords(result);
                this.appToolbar.setEnableForListPage();
                this.updateView();
            });
    }

    exportToExcel() {
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let reportFilter = { ...this.filterInputSearch };

        reportFilter.maxResultCount = -1;

        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

        reportInfo.values = this.GetParamsFromFilter({
            A1: this.l('CompanyReportHeader')
        });

        reportInfo.pathName = "/COMMON/BC_DONVI.xlsx";
        // reportInfo.storeName = "rpt_BC_DONVI";
        reportInfo.storeName = "cM_BRANCH_GetAll";


        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    onUploadExcelError(): void {
        this.showErrorMessage(this.l('ExportExcelFailed'));
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/branch-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: CM_BRANCH_ENTITY): void {
        this.navigatePassParam('/app/admin/branch-edit', { branch: item.brancH_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: CM_BRANCH_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.brancH_NAME),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this._branchService.cM_BRANCH_Del(item.brancH_ID)
                        .pipe(finalize(() => { this.saving = false; }))
                        .subscribe((response) => {
                            if (response.result != '0') {
                                this.showErrorMessage(response.errorDesc);
                            }
                            else {
                                this.showSuccessMessage(this.l('SuccessfullyDeleted'));
                                this.filterInputSearch.totalCount = 0;
                                this.reloadPage();
                            }
                        });
                }
            }
        );
    }

    onApprove(item: CM_BRANCH_ENTITY): void {
    }

    onViewDetail(item: CM_BRANCH_ENTITY): void {
        this.navigatePassParam('/app/admin/branch-view', { branch: item.brancH_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {
    }



    onResetSearch(): void {
        this.filterInput = new CM_BRANCH_ENTITY();
        this.changePage(0);
    }
}
