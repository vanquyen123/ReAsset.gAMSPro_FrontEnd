import {
  AfterViewInit,
  Component,
  Injector,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { base64ToBlob, saveFile } from "@app/ultilities/blob-exec";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import { ListComponentBase2 } from "@app/ultilities/list-component-base2";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AsposeServiceProxy, CM_ALLCODE_ENTITY, REA_SODO_ENTITY, REA_SODO_SEARCH_DTO, ReportInfo, SodoServiceProxy } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";

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
    this.appToolbar.setRole('SoDo', true, true, false, true, true, true, false, true);
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
    let reportInfo = new REA_SODO_SEARCH_DTO(this.filterInput)
    reportInfo.maxResultCount = 999;
    reportInfo.skipCount = 0;
    this._sodoService.getExcelSoDo(reportInfo).subscribe(response=>{
        let base64String = response.fileContent;
        let blob = base64ToBlob(base64String, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        saveFile(blob, "BC_SO_DO.xlsx")
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
      this.navigatePassParam('/app/admin/so-do-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onUpdate(item: REA_SODO_ENTITY): void {
      this.navigatePassParam('/app/admin/so-do-edit', { sodo: item.id }, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onDelete(item: REA_SODO_ENTITY): void {
      this.message.confirm(
          this.l('DeleteWarningMessage', item.id),
          this.l('AreYouSure'),
          (isConfirmed) => {
              if (isConfirmed) {
                  this.saving = true;
                  this._sodoService.rEA_SODO_Del(item.id)
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

  onApprove(item: REA_SODO_ENTITY): void {

  }

  onViewDetail(item: REA_SODO_ENTITY): void {
      this.navigatePassParam('/app/admin/so-do-view', { sodo: item.id }, { filterInput: JSON.stringify(this.filterInputSearch) });
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

  calcNumOfLandPlot(lanD_PLOT_LIST, isInside:boolean) {
    let num = 0;
    if(lanD_PLOT_LIST) {
        lanD_PLOT_LIST.forEach(land => {
            if(land.lanD_PLOT_IS_INSIDE == isInside) {
                num++;
            }
        });
    }
    return num;
  }

  calcAreaOfLandPlot(lanD_PLOT_LIST, isInside:boolean) {
    let area = 0;
    if(lanD_PLOT_LIST) {
        lanD_PLOT_LIST.forEach(land => {
            if(land.lanD_PLOT_IS_INSIDE == isInside) {
                area+=land.lanD_PLOT_AREA;
            }
        });
    }
    return area;
  }
}
