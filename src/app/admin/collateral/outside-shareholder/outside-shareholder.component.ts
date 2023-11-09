import {
    AfterViewInit,
    Component,
    Injector,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AsposeServiceProxy, BranchServiceProxy, CM_BRANCH_ENTITY, OutsideShareholderServiceProxy, PagedResultDtoOfREA_OUTSIDE_SHAREHOLDER_ENTITY, REA_OUTSIDE_SHAREHOLDER_ENTITY, ReportInfo } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";

@Component({
    // selector: 'app-outside-shareholder',
    templateUrl: "./outside-shareholder.component.html",
    animations: [appModuleAnimation()],
    encapsulation: ViewEncapsulation.None,
})
export class OutsideShareholderComponent extends ListComponentBase<REA_OUTSIDE_SHAREHOLDER_ENTITY> implements IUiAction<REA_OUTSIDE_SHAREHOLDER_ENTITY>, OnInit, AfterViewInit{
    filterInput: REA_OUTSIDE_SHAREHOLDER_ENTITY =new REA_OUTSIDE_SHAREHOLDER_ENTITY();
    outside_shareholders: REA_OUTSIDE_SHAREHOLDER_ENTITY[];
    records = [
        {
            recorD_STATUS: '0',
            recordName: "Không hoạt động"
        },
        {
            recorD_STATUS: '1',
            recordName: "Hoạt động"
        }
    ];
    auths = [
        {
            autH_STATUS: 'U',
            autH_STATUS_NAME: "Chờ duyệt"
        },
        {
            autH_STATUS: 'A',
            autH_STATUS_NAME: "Đã duyệt"
        }
    ]

    constructor(
        injector: Injector,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
        private _outsideShareholderService: OutsideShareholderServiceProxy,
        private pageResultService: OutsideShareholderServiceProxy,
        // private branchService: BranchServiceProxy
    ) {
        super(injector);
        this.initFilter();
    }

    initDefaultFilter() {
        this.filterInput.top = 200;
    }

    ngOnInit() {
      this.appToolbar.setUiAction(this);
      // set role toolbar
      this.appToolbar.setRole('OutsideShareholder', true, true, false, true, true, true, false, true);
      this.appToolbar.setEnableForListPage();

      this._outsideShareholderService.rEA_OUTSIDE_SHAREHOLDER_Search(this.getFillterForCombobox()).subscribe(response => {
          this.outside_shareholders = response.items;
          this.updateView();
      });
      var filterCombobox=this.getFillterForCombobox();
    //   this.branchService.cM_BRANCH_Search(filterCombobox).subscribe(response => {
    //       this.branchs = response.items;
    //       this.updateView();
    //   });
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

      reportInfo.pathName = "/COMMON/BC_CODONGNGOAI.xlsx";
      //reportInfo.storeName = "rpt_BC_PHONGBAN";
      reportInfo.storeName = "rEA_OUTSIDE_SHAREHOLDER_Search";

      this.asposeService.getReport(reportInfo).subscribe(x => {
          this.fileDownloadService.downloadTempFile(x);
      });
  }

  search(): void {
        this.showTableLoading();

        this.setSortingForFilterModel(this.filterInputSearch);

        this._outsideShareholderService.rEA_OUTSIDE_SHAREHOLDER_Search(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading()))
            .subscribe(result => {
                this.dataTable.records = result.items;
                this.dataTable.totalRecordsCount = result.totalCount;
                // this.filterInputSearch.totalCounT = result.totalCount; 
                this.appToolbar.setEnableForListPage();
                this.updateView();
            });
        console.log('Running');
    }

    onAdd(): void {
        this.navigatePassParam('/app/admin/outside-shareholder-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: REA_OUTSIDE_SHAREHOLDER_ENTITY): void {
        this.navigatePassParam('/app/admin/outside-shareholder-edit', { osh: item.o_SHAREHOLDER_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: REA_OUTSIDE_SHAREHOLDER_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.o_SHAREHOLDER_NAME),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this._outsideShareholderService.rEA_OUTSIDE_SHAREHOLDER_Del(item.o_SHAREHOLDER_ID)
                        .pipe(finalize(() => { this.saving = false; }))
                        .subscribe((response) => {
                            if (response.result != '0') {
                                this.showErrorMessage(response.errorDesc);
                            }
                            else {
                                this.showSuccessMessage(this.l('SuccessfullyDeleted'));
                                // this.filterInputSearch.totalCount = 0;
                                this.reloadPage();
                            }
                        });
                }
            }
        );
    }

    onApprove(item: REA_OUTSIDE_SHAREHOLDER_ENTITY): void {

    }

    onViewDetail(item: REA_OUTSIDE_SHAREHOLDER_ENTITY): void {
        this.navigatePassParam('/app/admin/outside-shareholder-view', { osh: item.o_SHAREHOLDER_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }



    onResetSearch(): void {
        this.filterInput = new REA_OUTSIDE_SHAREHOLDER_ENTITY();
        this.changePage(0);
    }

    onSelectActivity(branch: CM_BRANCH_ENTITY) {
        this.appToolbar.search();
    }

    onSelectRecord() {
        this.appToolbar.search();
    }

    // onSelectKhoi(khoi: CM_DEPT_GROUP_ENTITY) {
    //     this.appToolbar.search();
    // }
}
