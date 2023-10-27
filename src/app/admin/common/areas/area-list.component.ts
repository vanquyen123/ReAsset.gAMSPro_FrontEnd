import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { AreaServiceProxy, CM_AREAS_ENTITY, ReportInfo, AsposeServiceProxy, } from "@shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './area-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class AreaListComponent extends ListComponentBase<CM_AREAS_ENTITY> implements IUiAction<CM_AREAS_ENTITY>, OnInit, AfterViewInit {

    filterInput: CM_AREAS_ENTITY = new CM_AREAS_ENTITY();

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private http: HttpClient,
        private areaService: AreaServiceProxy) {
        super(injector);
        this.initFilter();
    }

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('Area', true, true, false, true, true, true, false, true);
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

        reportInfo.pathName = "/COMMON/BC_VUNGMIEN.xlsx";
        reportInfo.storeName = "CM_AREA_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    search(): void {

        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        this.areaService.aREAS_Search(this.filterInputSearch)
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
        this.navigatePassParam('/app/admin/area-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: CM_AREAS_ENTITY): void {
        this.navigatePassParam('/app/admin/area-edit', { id: item.areA_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: CM_AREAS_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.areA_NAME),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.areaService.aREA_Del(item.areA_ID)
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

    onApprove(item: CM_AREAS_ENTITY): void {

    }

    onViewDetail(item: CM_AREAS_ENTITY): void {
        this.navigatePassParam('/app/admin/area-view', { id: item.areA_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }



    onResetSearch(): void {
        this.filterInput = new CM_AREAS_ENTITY();
        this.changePage(0);
    }
}
