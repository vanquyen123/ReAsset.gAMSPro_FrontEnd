import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { SupplierTypeServiceProxy, CM_SUPPLIERTYPE_ENTITY, ReportInfo, AsposeServiceProxy, } from "@shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './supplier-type-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class SupplierTypeListComponent extends ListComponentBase<CM_SUPPLIERTYPE_ENTITY> implements IUiAction<CM_SUPPLIERTYPE_ENTITY>, OnInit, AfterViewInit {
    filterInput: CM_SUPPLIERTYPE_ENTITY = new CM_SUPPLIERTYPE_ENTITY();
    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private supplierTypeService: SupplierTypeServiceProxy) {
        super(injector);
        this.initFilter();
    }



    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('SupplierType', true, true, false, true, true, true, false, true);
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

        reportInfo.pathName = "/COMMON/BC_LOAI_NCC.xlsx";
        reportInfo.storeName = "CM_SUPPLIERTYPE_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    search(): void {
        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        this.supplierTypeService.cM_SUPPLIERTYPE_Search(this.filterInputSearch)
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
        this.navigatePassParam('/app/admin/supplier-type-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: CM_SUPPLIERTYPE_ENTITY): void {
        this.navigatePassParam('/app/admin/supplier-type-edit', { id: item.suP_TYPE_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: CM_SUPPLIERTYPE_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.suP_TYPE_NAME),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.supplierTypeService.cM_SUPPLIERTYPE_Del(item.suP_TYPE_ID)
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

    onApprove(item: CM_SUPPLIERTYPE_ENTITY): void {

    }

    onViewDetail(item: CM_SUPPLIERTYPE_ENTITY): void {
        this.navigatePassParam('/app/admin/supplier-type-view', { id: item.suP_TYPE_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }

    onResetSearch(): void {
        this.filterInput = new CM_SUPPLIERTYPE_ENTITY();
        this.changePage(0);
    }
}
