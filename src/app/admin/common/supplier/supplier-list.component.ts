import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy, AfterViewInit } from "@angular/core";
import { SupplierServiceProxy, CM_SUPPLIER_ENTITY, ReportInfo, AsposeServiceProxy, } from "@shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './supplier-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class SupplierListComponent extends ListComponentBase<CM_SUPPLIER_ENTITY> implements IUiAction<CM_SUPPLIER_ENTITY>, OnInit, AfterViewInit {
    filterInput: CM_SUPPLIER_ENTITY = new CM_SUPPLIER_ENTITY();
    isHS: boolean = false;

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private supplierService: SupplierServiceProxy) {
        super(injector);
        this.initFilter();
    }

    initDefaultFilter() {
        this.filterInput.top = 200;
    }

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('Supplier', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
        this.isHS = this.appSession.user.branch.brancH_TYPE == 'HS';
        this.filterInput.brancH_LOGIN = this.appSession.user.subbrId;
        this.filterInput.useR_LOGIN = this.appSession.user.userName;
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

        reportInfo.pathName = "/COMMON/BC_NCC.xlsx";
        reportInfo.storeName = "rpt_BC_NHA_CC";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    search(): void {
        this.showTableLoading();
        this.filterInputSearch.brancH_TYPE = this.appSession.user.branch.brancH_TYPE;
        this.setSortingForFilterModel(this.filterInputSearch);

        this.supplierService.cM_SUPPLIER_Search(this.filterInputSearch)
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
        this.navigatePassParam('/app/admin/supplier-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: CM_SUPPLIER_ENTITY): void {
        this.navigatePassParam('/app/admin/supplier-edit', { id: item.suP_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: CM_SUPPLIER_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.suP_NAME),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.supplierService.cM_SUPPLIER_Del(item.suP_ID)
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

    onApprove(item: CM_SUPPLIER_ENTITY): void {

    }

    onViewDetail(item: CM_SUPPLIER_ENTITY): void {
        this.navigatePassParam('/app/admin/supplier-view', { id: item.suP_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }

    onResetSearch(): void {
        this.filterInput = new CM_SUPPLIER_ENTITY();
        this.changePage(0);
    }
}
