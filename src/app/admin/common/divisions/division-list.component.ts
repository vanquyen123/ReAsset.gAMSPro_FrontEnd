import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { DivisionServiceProxy, CM_DIVISION_ENTITY, AsposeServiceProxy, ReportInfo, } from "@shared/service-proxies/service-proxies";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './division-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class DivisionListComponent extends ListComponentBase<CM_DIVISION_ENTITY> implements IUiAction<CM_DIVISION_ENTITY>, OnInit, AfterViewInit {
    filterInput: CM_DIVISION_ENTITY = new CM_DIVISION_ENTITY();

    constructor(injector: Injector,
        private asposeService : AsposeServiceProxy,
        private fileDownloadService: FileDownloadService,
        private _divisionService: DivisionServiceProxy) {
        super(injector);
        this.initFilter();
        // console.log(this);
    }

    initDefaultFilter() {
        this.filterInput.top = 200;
        this.filterInput.brancH_LOGIN = this.appSession.user.subbrId; 
    }

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('Division', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
    }

    ngAfterViewInit(): void {
        // COMMENT: this.stopAutoUpdateView();
    }

    exportToExcel() {
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;

        let reportFilter = { ...this.filterInputSearch };

        reportFilter.maxResultCount = -1;

        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

        reportInfo.values = this.GetParamsFromFilter({
            A1 : this.l('CompanyReportHeader')
        });

        reportInfo.pathName = "/COMMON/BC_DIADIEM.xlsx";
        reportInfo.storeName = "rpt_BC_DIADIEM";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    search(): void {
        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        this._divisionService.cM_DIVISION_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                this.filterInputSearch.totalCount = result.totalCount;
                this.appToolbar.setEnableForListPage();
                this.updateView();
            });
    }


    onAdd(): void {
        this.navigatePassParam('/app/admin/division-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: CM_DIVISION_ENTITY): void {
        this.navigatePassParam('/app/admin/division-edit', { id: item.diV_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: CM_DIVISION_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.diV_NAME),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this._divisionService.cM_DIVISION_Del(item.diV_ID)
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

    onApprove(item: CM_DIVISION_ENTITY): void {

    }

    onViewDetail(item: CM_DIVISION_ENTITY): void {
        this.navigatePassParam('/app/admin/division-view', { id: item.diV_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }



    onResetSearch(): void {
        this.filterInput = new CM_DIVISION_ENTITY();
        this.changePage(0);
    }
}
