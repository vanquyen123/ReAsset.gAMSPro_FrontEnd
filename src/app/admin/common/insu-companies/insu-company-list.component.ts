import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { InsuCompanyServiceProxy, CM_INSU_COMPANY_ENTITY, ReportInfo, AsposeServiceProxy, } from "@shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './insu-company-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class InsuCompanyListComponent extends ListComponentBase<CM_INSU_COMPANY_ENTITY> implements IUiAction<CM_INSU_COMPANY_ENTITY>, OnInit, AfterViewInit {
    filterInput: CM_INSU_COMPANY_ENTITY = new CM_INSU_COMPANY_ENTITY();

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private insuCompanyService: InsuCompanyServiceProxy) {
        super(injector);

        this.initFilter();
    }



    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('InsuCompany', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
    }

    initDefaultFilter() {
        this.filterInput.top = 200;
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

        reportInfo.pathName = "/COMMON/BC_CTBH.xlsx";
        reportInfo.storeName = "INSU_COMPANY_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    search(): void {

        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        this.insuCompanyService.cM_INSU_COMPANY_Search(this.filterInputSearch)
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
        this.navigatePassParam('/app/admin/insu-company-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: CM_INSU_COMPANY_ENTITY): void {
        this.navigatePassParam('/app/admin/insu-company-edit', { id: item.insU_COMPANY_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: CM_INSU_COMPANY_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.name),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.insuCompanyService.cM_INSU_COMPANY_Del(item.insU_COMPANY_ID)
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

    onApprove(item: CM_INSU_COMPANY_ENTITY): void {

    }

    onViewDetail(item: CM_INSU_COMPANY_ENTITY): void {
        this.navigatePassParam('/app/admin/insu-company-view', { id: item.insU_COMPANY_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }



    onResetSearch(): void {
        this.filterInput = new CM_INSU_COMPANY_ENTITY();
        this.changePage(0);
    }
}
