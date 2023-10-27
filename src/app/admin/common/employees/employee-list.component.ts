import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewChild, ViewEncapsulation, ElementRef, AfterViewInit } from "@angular/core";
import { EmployeeServiceProxy, CM_EMPLOYEE_ENTITY, CM_BRANCH_ENTITY, DepartmentServiceProxy, CM_DEPARTMENT_ENTITY, BranchServiceProxy, ReportInfo, AsposeServiceProxy, } from "@shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";

import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './employee-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class EmployeeListComponent extends ListComponentBase<CM_EMPLOYEE_ENTITY> implements IUiAction<CM_EMPLOYEE_ENTITY>, OnInit, AfterViewInit {
    filterInput: CM_EMPLOYEE_ENTITY = new CM_EMPLOYEE_ENTITY();
    departments: CM_DEPARTMENT_ENTITY[];
    branchs: CM_BRANCH_ENTITY[];

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private _departmentService: DepartmentServiceProxy,
        private _branchService: BranchServiceProxy,
        private _employeeService: EmployeeServiceProxy) {
        super(injector);

        this.initFilter();
    }

    initDefaultFilter() {
        this.filterInput.level = 'UNIT';
    }


    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('Employee', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
        this.initCombobox();
        // this.onChangeBranch({
        //     brancH_ID: this.appSession.user.subbrId
        // } as any);
    }

    initCombobox() {
        let filterCombobox = this.getFillterForCombobox();

        this._branchService.cM_BRANCH_Search(filterCombobox).subscribe(response => {
            this.branchs = response.items;
            this.updateView();
        });

        this.onChangeBranch(undefined);

    }

    ngAfterViewInit(): void {
        // COMMENT: this.stopAutoUpdateView();
    }

    exportToExcel() {
        let reportInfo = new ReportInfo();
        reportInfo.typeExport = ReportTypeConsts.Excel;
        this.initFilterInputSearch();

        let reportFilter = { ...this.filterInputSearch };

        reportFilter.maxResultCount = -1;

        reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

        reportInfo.values = this.GetParamsFromFilter({
            A1: this.l('CompanyReportHeader')
        });

        reportInfo.pathName = "/COMMON/BC_NHANVIEN.xlsx";
        reportInfo.storeName = "CM_EMPLOYEE_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    initFilterInputSearch() {
        if (!this.filterInputSearch.brancH_ID) {
            this.filterInputSearch.brancH_ID = this.appSession.user.subbrId;
        }
    }

    search(): void {

        this.showTableLoading();

        this.initFilterInputSearch();

        this.setSortingForFilterModel(this.filterInputSearch);

        this._employeeService.cM_EMPLOYEE_Search(this.filterInputSearch)
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
        this.navigatePassParam('/app/admin/employee-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: CM_EMPLOYEE_ENTITY): void {
        this.navigatePassParam('/app/admin/employee-edit', { id: item.emP_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: CM_EMPLOYEE_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.emP_NAME),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this._employeeService.cM_EMPLOYEE_Del(item.emP_ID)
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

    onApprove(item: CM_EMPLOYEE_ENTITY): void {

    }

    onViewDetail(item: CM_EMPLOYEE_ENTITY): void {
        this.navigatePassParam('/app/admin/employee-view', { id: item.emP_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }

    onChangeBranch(branch: CM_BRANCH_ENTITY) {
        if (!branch) {
            branch = { brancH_ID: this.appSession.user.subbrId } as any
        }
        this.filterInput.deP_ID = undefined;
        this.filterInput.deP_NAME = undefined;
        let filterCombobox = this.getFillterForCombobox();
        filterCombobox.brancH_ID = branch.brancH_ID;
        this._departmentService.cM_DEPARTMENT_Search(filterCombobox).subscribe(response => {
            this.departments = response.items;
            this.updateView();
        })
    }

    onResetSearch(): void {
        this.filterInput = new CM_EMPLOYEE_ENTITY();
        this.filterInput.level = 'UNIT';
        this.filterInput.brancH_ID = this.appSession.user.subbrId;
        this.changePage(0);
    }
}
