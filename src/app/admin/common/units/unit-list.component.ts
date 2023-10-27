import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { UnitServiceProxy, CM_UNIT_ENTITY, ReportInfo, AsposeServiceProxy, } from "@shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './unit-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class UnitListComponent extends ListComponentBase<CM_UNIT_ENTITY> implements IUiAction<CM_UNIT_ENTITY>, OnInit, AfterViewInit {
    filterInput: CM_UNIT_ENTITY = new CM_UNIT_ENTITY();

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService : AsposeServiceProxy,
        private unitService: UnitServiceProxy) {
        super(injector);
        this.initFilter();
    }



    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('Unit', true, true, false, true, true, true, false, true);
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

        reportInfo.pathName = "/COMMON/BC_DONVITINH.xlsx";
        reportInfo.storeName = "CM_UNIT_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    search(): void {
        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        this.unitService.cM_UNIT_Search(this.filterInputSearch)
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
        this.navigatePassParam('/app/admin/unit-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: CM_UNIT_ENTITY): void {
        this.navigatePassParam('/app/admin/unit-edit', { id: item.uniT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: CM_UNIT_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.uniT_NAME),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.unitService.cM_UNIT_Del(item.uniT_ID)
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

    onApprove(item: CM_UNIT_ENTITY): void {

    }

    onViewDetail(item: CM_UNIT_ENTITY): void {
        this.navigatePassParam('/app/admin/unit-view', { id: item.uniT_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }

    onResetSearch(): void {
        this.filterInput = new CM_UNIT_ENTITY();
        this.changePage(0);
    }
}
