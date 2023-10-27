import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { DepartmentServiceProxy, CM_DEPARTMENT_ENTITY, DeptGroupServiceProxy,BranchServiceProxy,CM_BRANCH_ENTITY, CM_DEPT_GROUP_ENTITY, ReportInfo, AsposeServiceProxy, } from "@shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './department-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class DepartmentListComponent extends ListComponentBase<CM_DEPARTMENT_ENTITY> implements IUiAction<CM_DEPARTMENT_ENTITY>, OnInit, AfterViewInit {

    filterInput: CM_DEPARTMENT_ENTITY = new CM_DEPARTMENT_ENTITY();
    deptGroups: CM_DEPT_GROUP_ENTITY[];
    branchs: CM_BRANCH_ENTITY[];

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private _deptGroupService: DeptGroupServiceProxy,
        private _departmentService: DepartmentServiceProxy,
        private branchService: BranchServiceProxy
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
        this.appToolbar.setRole('Department', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();

        this._deptGroupService.cM_DEPT_GROUP_Search(this.getFillterForCombobox()).subscribe(response => {
            this.deptGroups = response.items;
            this.updateView();
        });
        var filterCombobox=this.getFillterForCombobox();
        this.branchService.cM_BRANCH_Search(filterCombobox).subscribe(response => {
            this.branchs = response.items;
            this.updateView();
        });
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

        reportInfo.pathName = "/COMMON/BC_PHONGBAN.xlsx";
        //reportInfo.storeName = "rpt_BC_PHONGBAN";
        reportInfo.storeName = "cM_DEPARTMENT_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    search(): void {
        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        this._departmentService.cM_DEPARTMENT_Search(this.filterInputSearch)
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
        this.navigatePassParam('/app/admin/department-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: CM_DEPARTMENT_ENTITY): void {
        this.navigatePassParam('/app/admin/department-edit', { dep: item.deP_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: CM_DEPARTMENT_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.deP_NAME),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this._departmentService.cM_DEPARTMENT_Del(item.deP_ID)
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

    onApprove(item: CM_DEPARTMENT_ENTITY): void {

    }

    onViewDetail(item: CM_DEPARTMENT_ENTITY): void {
        this.navigatePassParam('/app/admin/department-view', { dep: item.deP_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }



    onResetSearch(): void {
        this.filterInput = new CM_DEPARTMENT_ENTITY();
        this.changePage(0);
    }

    onSelectBranch(branch: CM_BRANCH_ENTITY) {
        this.appToolbar.search();
    }

    onSelectKhoi(khoi: CM_DEPT_GROUP_ENTITY) {
        this.appToolbar.search();
    }
}
