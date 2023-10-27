import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { WorkflowServiceProxy, CM_WORKFLOW_ENTITY, TL_MENU_ENTITY, AppMenuServiceProxy, AppMenuDto, } from "@shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";

@Component({
    templateUrl: './workflow-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class WorkflowListComponent extends ListComponentBase<CM_WORKFLOW_ENTITY> implements IUiAction<CM_WORKFLOW_ENTITY>, OnInit, AfterViewInit {
    filterInput: CM_WORKFLOW_ENTITY = new CM_WORKFLOW_ENTITY();
    menus: AppMenuDto[];

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private menuService: AppMenuServiceProxy,
        private workflowService: WorkflowServiceProxy) {
        super(injector);
        this.initFilter();
    }



    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('Workflow', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
        this.initCombobox();
    }

    ngAfterViewInit(): void {
        // COMMENT: this.stopAutoUpdateView();
    }

    exportToExcel() {
        this.workflowService.cM_WORKFLOW_ToExcel(this.filterInputSearch).subscribe(response => {
            this.fileDownloadService.downloadTempFile(response);
        })
    }

    initCombobox() {
        this.menuService.getAllMenus().subscribe(response => {
            this.menus = response.filter(x=>x.route);
            this.updateView();
        });
    }

    search(): void {
        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        this.workflowService.cM_WORKFLOW_Search(this.filterInputSearch)
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
        this.navigatePassParam('/app/admin/workflow-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: CM_WORKFLOW_ENTITY): void {
        this.navigatePassParam('/app/admin/workflow-edit', { id: item.workfloW_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: CM_WORKFLOW_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.workfloW_ID),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.workflowService.cM_WORKFLOW_Del(item.workfloW_ID)
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

    onApprove(item: CM_WORKFLOW_ENTITY): void {

    }

    onViewDetail(item: CM_WORKFLOW_ENTITY): void {
        this.navigatePassParam('/app/admin/workflow-view', { id: item.workfloW_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }



    onResetSearch(): void {
        this.filterInput = new CM_WORKFLOW_ENTITY();
        this.changePage(0);
    }
}
