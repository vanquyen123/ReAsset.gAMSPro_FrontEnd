import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { ModelServiceProxy, CM_MODEL_ENTITY, CM_CAR_TYPE_ENTITY, CarTypeServiceProxy, IUserLoginBranch, ReportInfo, AsposeServiceProxy } from "@shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './model-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class ModelListComponent extends ListComponentBase<CM_MODEL_ENTITY> implements IUiAction<CM_MODEL_ENTITY>, OnInit, AfterViewInit {
    filterInput: CM_MODEL_ENTITY = new CM_MODEL_ENTITY();
    carTypes: CM_CAR_TYPE_ENTITY[];

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private carTypeService: CarTypeServiceProxy,
        private modelService: ModelServiceProxy) {
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
        this.appToolbar.setRole('Model', true, true, false, true, true, true, false, true);
        this.appToolbar.setEnableForListPage();

        this.carTypeService.cM_CAR_TYPE_Search(this.getFillterForCombobox()).subscribe(response => {
            this.carTypes = response.items;
            this.updateView();
        });
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

        reportInfo.pathName = "/COMMON/BC_MODEL.xlsx";
        reportInfo.storeName = "CM_MODEL_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    search(): void {

        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        this.modelService.cM_MODEL_Search(this.filterInputSearch)
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
        this.navigatePassParam('/app/admin/model-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: CM_MODEL_ENTITY): void {
        this.navigatePassParam('/app/admin/model-edit', { id: item.mO_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: CM_MODEL_ENTITY): void {
        if (item.autH_STATUS == 'A') {
            this.showErrorMessage(this.l('DeleteFailed'));
            return;
        }
        this.message.confirm(
            this.l('DeleteWarningMessage', item.mO_NAME),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.modelService.cM_MODEL_Del(item.mO_ID)
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

    onApprove(item: CM_MODEL_ENTITY): void {

    }

    onViewDetail(item: CM_MODEL_ENTITY): void {
        this.navigatePassParam('/app/admin/model-view', { id: item.mO_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }



    onResetSearch(): void {
        this.filterInput = new CM_MODEL_ENTITY();
        this.changePage(0);
    }
}
