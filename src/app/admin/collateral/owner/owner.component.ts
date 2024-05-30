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
import { AsposeServiceProxy, CM_ALLCODE_ENTITY, OwnerServiceProxy, REA_OWNER_ENTITY, ReportInfo } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";

@Component({
  templateUrl: "./owner.component.html",
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class OwnerComponent extends ListComponentBase<REA_OWNER_ENTITY> implements IUiAction<REA_OWNER_ENTITY>, OnInit, AfterViewInit{
  filterInput: REA_OWNER_ENTITY =new REA_OWNER_ENTITY();
  owners: REA_OWNER_ENTITY[];
  ownerTypes: CM_ALLCODE_ENTITY[];
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
      private _ownerService: OwnerServiceProxy,
      private pageResultService: OwnerServiceProxy,
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
    this.appToolbar.setRole('Owner', true, true, false, true, true, true, false, true);
    this.appToolbar.setEnableForListPage();

    this._ownerService.rEA_OWNER_Search(this.getFillterForCombobox()).subscribe(response => {
        this.owners = response.items;
        this.updateView();
    });
    var filterCombobox=this.getFillterForCombobox();
    this._ownerService.getOwnerTypeCodes().subscribe(response => {
        this.ownerTypes = response
    })
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
    reportInfo.storeName = "REA_OWNER_Search";

    this.asposeService.getReport(reportInfo).subscribe(x => {
        this.fileDownloadService.downloadTempFile(x);
    });
}

search(): void {
      this.showTableLoading();

      this.setSortingForFilterModel(this.filterInputSearch);

      this._ownerService.rEA_OWNER_Search(this.filterInputSearch)
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
      this.navigatePassParam('/app/admin/owner-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onUpdate(item: REA_OWNER_ENTITY): void {
      this.navigatePassParam('/app/admin/owner-edit', { owner: item.owneR_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onDelete(item: REA_OWNER_ENTITY): void {
      this.message.confirm(
          this.l('DeleteWarningMessage', item.owneR_NAME),
          this.l('AreYouSure'),
          (isConfirmed) => {
              if (isConfirmed) {
                  this.saving = true;
                  this._ownerService.rEA_OWNER_Del(item.owneR_ID)
                  .pipe(
                    catchError(e=>{
                    this.showErrorMessage("Lỗi");
                    return throwError("Lỗi")
                    }),
                    finalize(() => { this.saving = false; })
                )
                .subscribe((response) => {
                  this.showSuccessMessage(this.l('SuccessfullyDeleted'));
                  // this.filterInputSearch.totalCount = 0;
                  this.reloadPage();
                });
              }
          }
      );
  }

  onApprove(item: REA_OWNER_ENTITY): void {

  }

  onViewDetail(item: REA_OWNER_ENTITY): void {
      this.navigatePassParam('/app/admin/owner-view', { owner: item.owneR_ID }, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onSave(): void {

  }

  onResetSearch(): void {
      this.filterInput = new REA_OWNER_ENTITY();
      this.changePage(0);
  }

  onSelectRecord(record: REA_OWNER_ENTITY) {
      this.appToolbar.search();
  }
}
