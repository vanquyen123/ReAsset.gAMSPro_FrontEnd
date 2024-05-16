import {
  AfterViewInit,
  Component,
  Injector,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import { ListComponentBase2 } from "@app/ultilities/list-component-base2";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AsposeServiceProxy, CM_ALLCODE_ENTITY, REA_SODO_ENTITY, REA_SODO_SEARCH_DTO, ReportInfo, SodoServiceProxy } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";

@Component({
  templateUrl: "./sodo.component.html",
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class SodoComponent extends ListComponentBase2<REA_SODO_ENTITY, REA_SODO_SEARCH_DTO> implements IUiAction<REA_SODO_ENTITY>, OnInit, AfterViewInit{
  filterInput: REA_SODO_SEARCH_DTO =new REA_SODO_SEARCH_DTO();
  sodos: REA_SODO_ENTITY[];
  // ownerTypes: CM_ALLCODE_ENTITY[];
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
  ];

  constructor(
      injector: Injector,
      private fileDownloadService: FileDownloadService,
      private asposeService: AsposeServiceProxy,
      private _sodoService: SodoServiceProxy,
      private pageResultService: SodoServiceProxy,
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
    this.appToolbar.setRole('Sodo', true, true, false, true, true, true, false, true);
    this.appToolbar.setEnableForListPage();

    this._sodoService.rEA_SODO_Search(this.getFillterForCombobox()).subscribe(response => {
        this.sodos = response.items;
        this.updateView();
    });
    var filterCombobox=this.getFillterForCombobox();
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
    reportInfo.storeName = "rEA_SODO_Search";

    this.asposeService.getReport(reportInfo).subscribe(x => {
        this.fileDownloadService.downloadTempFile(x);
    });
}

search(): void {
      this.showTableLoading();

      this.setSortingForFilterModel(this.filterInputSearch);

      this._sodoService.rEA_SODO_Search(this.filterInputSearch)
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
      this.navigatePassParam('/app/admin/sodo-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onUpdate(item: REA_SODO_ENTITY): void {
      this.navigatePassParam('/app/admin/sodo-edit', { sodo: item.id }, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onDelete(item: REA_SODO_ENTITY): void {
      this.message.confirm(
          this.l('DeleteWarningMessage', item.id),
          this.l('AreYouSure'),
          (isConfirmed) => {
              if (isConfirmed) {
                  this.saving = true;
                  this._sodoService.rEA_SODO_Del(item.id)
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

  onApprove(item: REA_SODO_ENTITY): void {

  }

  onViewDetail(item: REA_SODO_ENTITY): void {
      this.navigatePassParam('/app/admin/sodo-view', { sodo: item.id }, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onSave(): void {

  }

  onResetSearch(): void {
      this.filterInput = new REA_SODO_SEARCH_DTO();
      this.changePage(0);
  }

  onSelectRecord(record: REA_SODO_ENTITY) {
      this.appToolbar.search();
  }
}
