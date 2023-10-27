import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { DeptGroupServiceProxy, CM_DEPT_GROUP_ENTITY, AsposeServiceProxy, ReportInfo, } from "@shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './dept-group-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class DeptGroupListComponent extends ListComponentBase<CM_DEPT_GROUP_ENTITY> implements IUiAction<CM_DEPT_GROUP_ENTITY>, OnInit, AfterViewInit {

    filterInput: CM_DEPT_GROUP_ENTITY = new CM_DEPT_GROUP_ENTITY();

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private debtGroupService: DeptGroupServiceProxy
    ) {
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
        this.appToolbar.setRole('DeptGroup', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
        setTimeout(()=>{this.filterInputSearch=this.filterInput,this.search()}, 1000);
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

        reportInfo.pathName = "/COMMON/BC_KHOI.xlsx";
        reportInfo.storeName = "CM_DEPT_GROUP_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    search(): void {
        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        this.debtGroupService.cM_DEPT_GROUP_Search(this.filterInputSearch)
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
        this.navigatePassParam('/app/admin/dept-group-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: CM_DEPT_GROUP_ENTITY): void {
        this.navigatePassParam('/app/admin/dept-group-edit', { dept: item.grouP_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: CM_DEPT_GROUP_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.grouP_NAME),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.debtGroupService.cM_DEPT_GROUP_Del(item.grouP_ID)
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

    onApprove(item: CM_DEPT_GROUP_ENTITY): void {

    }

    onViewDetail(item: CM_DEPT_GROUP_ENTITY): void {
        this.navigatePassParam('/app/admin/dept-group-view', { dept: item.grouP_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }



    onResetSearch(): void {
        this.filterInput = new CM_DEPT_GROUP_ENTITY();
        this.changePage(0);
    }
}
