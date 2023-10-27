import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { AllCodeServiceProxy, CM_ALLCODE_ENTITY, AsposeServiceProxy, ReportInfo, } from "@shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './all-code-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class AllCodeListComponent extends ListComponentBase<CM_ALLCODE_ENTITY> implements IUiAction<CM_ALLCODE_ENTITY>, OnInit, AfterViewInit {

    filterInput: CM_ALLCODE_ENTITY = new CM_ALLCODE_ENTITY();
    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private allCodeService: AllCodeServiceProxy
    ) {
        super(injector);
        this.initFilter();
    }

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('AllCode', true, true, false, true, true, true, false, true);
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
            A1: this.l('CompanyReportHeader')
        });

        reportInfo.pathName = "/COMMON/BC_ALLCODE.xlsx";
        reportInfo.storeName = "CM_ALLCODE_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    search(): void {

        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        this.allCodeService.cM_ALLCODE_Search(this.filterInputSearch)
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
        this.navigatePassParam('/app/admin/all-code-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: CM_ALLCODE_ENTITY): void {
        this.navigatePassParam('/app/admin/all-code-edit', { code: item.id }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: CM_ALLCODE_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.content),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.allCodeService.cM_ALLCODE_Del(item.id)
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

    onApprove(item: CM_ALLCODE_ENTITY): void {
    }

    onViewDetail(item: CM_ALLCODE_ENTITY): void {
        this.navigatePassParam('/app/admin/all-code-view', { code: item.id }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {
    }



    onResetSearch(): void {
        this.filterInput = new CM_ALLCODE_ENTITY();
        this.changePage(0);
    }
}
