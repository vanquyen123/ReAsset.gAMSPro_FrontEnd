import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { TlUserServiceProxy, TL_USER_ENTITY, BranchServiceProxy, CM_BRANCH_ENTITY, } from "@shared/service-proxies/service-proxies";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";

@Component({
    templateUrl: './tluser-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class TlUserListComponent extends ListComponentBase<TL_USER_ENTITY> implements IUiAction<TL_USER_ENTITY>, OnInit {
    filterInput: TL_USER_ENTITY = new TL_USER_ENTITY();
    branchs: CM_BRANCH_ENTITY[];
    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private tlUserService: TlUserServiceProxy,
        private branchService: BranchServiceProxy) {
        super(injector);

        this.initFilter();
        this.initComboboxs();
    }

    initDefaultFilter() {
        this.filterInput.top = 200;
    }

    initComboboxs() {
        let filterCombobox = this.getFillterForCombobox();
        this.branchService.cM_BRANCH_Search(filterCombobox).subscribe(response => {
            this.branchs = response.items;
            this.updateView();
        })
    }

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('TlUser', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();
    }

    exportToExcel() {

    }

    search(): void {
        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        this.tlUserService.tL_USER_Search(this.filterInputSearch)
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
        this.navigatePassParam('/app/admin/tluser-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: TL_USER_ENTITY): void {
        this.navigatePassParam('/app/admin/tluser-edit', { id: item.tlid }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: TL_USER_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.tlFullName),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.tlUserService.tL_USER_Del(item.tlid)
                        .pipe(finalize(() => { this.saving = false; }))
                        .subscribe((response) => {
                            if (response['Result'] != '0') {
                                this.showErrorMessage(response['ErrorDesc']);
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

    onApprove(item: TL_USER_ENTITY): void {

    }

    onViewDetail(item: TL_USER_ENTITY): void {
        this.navigatePassParam('/app/admin/tluser-view', { id: item.tlid }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }

    onResetSearch(): void {
        this.filterInput = new TL_USER_ENTITY();
        this.changePage(0);
    }
}
