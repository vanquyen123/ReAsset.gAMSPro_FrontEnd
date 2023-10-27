import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Injector, Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { SysParametersServiceProxy, SYS_PARAMETERS_ENTITY, ReportInfo, AsposeServiceProxy, } from "@shared/service-proxies/service-proxies";
import { LazyLoadEvent } from "primeng/api";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";

@Component({
    templateUrl: './sysparameter-list.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class SysParameterListComponent extends ListComponentBase<SYS_PARAMETERS_ENTITY> implements IUiAction<SYS_PARAMETERS_ENTITY>, OnInit, AfterViewInit {
    filterInput: SYS_PARAMETERS_ENTITY = new SYS_PARAMETERS_ENTITY();

    constructor(injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private sysParameterService: SysParametersServiceProxy
    ) {
        super(injector);
        this.initFilter();
    }

    ngOnInit(): void {
        // set ui action
        this.appToolbar.setUiAction(this);
        // set role toolbar
        this.appToolbar.setRole('SysParameter', true, true, false, true, true, true, false, true);
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
            A1: this.l('CompanyReportHeader')
        });

        reportInfo.pathName = "/COMMON/BC_THAMSO.xlsx";
        reportInfo.storeName = "SYS_PARAMETERS_Search";

        this.asposeService.getReport(reportInfo).subscribe(x => {
            this.fileDownloadService.downloadTempFile(x);
        });
    }

    search(): void {

        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        this.sysParameterService.sYS_PARAMETERS_Search(this.filterInputSearch)
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
        this.navigatePassParam('/app/admin/argument-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: SYS_PARAMETERS_ENTITY): void {
        this.navigatePassParam('/app/admin/argument-edit', { argument: item.id }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: SYS_PARAMETERS_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.paraKey),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.sysParameterService.sYS_PARAMETERS_Del(item.id)
                        .pipe(finalize(() => { this.saving = false; }))
                        .subscribe((response) => {
                            this.showSuccessMessage(this.l('SuccessfullyDeleted'));
                            this.filterInputSearch.totalCount = 0;
                            this.reloadPage();
                        });
                }
            }
        );
    }

    onApprove(item: SYS_PARAMETERS_ENTITY): void {

    }

    onViewDetail(item: SYS_PARAMETERS_ENTITY): void {
        this.navigatePassParam('/app/admin/argument-view', { argument: item.id }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }

    onResetSearch(): void {
        this.filterInput = new SYS_PARAMETERS_ENTITY();
        this.changePage(0);
    }
}
