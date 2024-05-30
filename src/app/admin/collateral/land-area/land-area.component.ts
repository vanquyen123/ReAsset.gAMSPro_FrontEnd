import {
  AfterViewInit,
  Component,
  Injector,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { InvestorField, ProjectField } from "@app/admin/core/ultils/consts/ComboboxConsts";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { base64ToBlob, saveFile } from "@app/ultilities/blob-exec";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import { ListComponentBase2 } from "@app/ultilities/list-component-base2";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AsposeServiceProxy, CM_ALLCODE_ENTITY, ComboboxServiceProxy, LandAreaServiceProxy, REA_LAND_AREA_ENTITY, REA_LAND_AREA_SEARCH_DTO, ReportInfo } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";

@Component({
  templateUrl: "./land-area.component.html",
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class LandAreaComponent extends ListComponentBase2<REA_LAND_AREA_ENTITY, REA_LAND_AREA_SEARCH_DTO> implements IUiAction<REA_LAND_AREA_ENTITY>, OnInit, AfterViewInit{
  filterInput: REA_LAND_AREA_SEARCH_DTO =new REA_LAND_AREA_SEARCH_DTO();
  landAreas: REA_LAND_AREA_ENTITY[];
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
  projectList;
  investorList;

  constructor(
      injector: Injector,
      private fileDownloadService: FileDownloadService,
      private asposeService: AsposeServiceProxy,
      private _landAreaService: LandAreaServiceProxy,
      private _comboboxService: ComboboxServiceProxy,
      private pageResultService: LandAreaServiceProxy,
      // private branchService: BranchServiceProxy
  ) {
      super(injector);
      this.initFilter();
  }

  initDefaultFilter() {
      // this.filterInput.top = 200;
  }

  ngOnInit() {
    this.appToolbar.setUiAction(this);
    // set role toolbar
    this.appToolbar.setRole('LandArea', true, true, false, true, true, true, false, true);
    this.appToolbar.setEnableForListPage();

    this._landAreaService.rEA_LAND_AREA_Search(this.getFillterForCombobox()).subscribe(response => {
        this.landAreas = response.items;
        this.updateView();
    });
    this.getFilterField();
    var filterCombobox=this.getFillterForCombobox();
    setTimeout(()=>{this.filterInputSearch=this.filterInput,this.search()}, 1000);
  }

  ngAfterViewInit(): void {
      // COMMENT: this.stopAutoUpdateView();
  }

  exportToExcel() {
    let reportInfo = new REA_LAND_AREA_SEARCH_DTO(this.filterInput)
    reportInfo.maxResultCount = 999;
    reportInfo.skipCount = 0;
    this._landAreaService.getExcelLandArea(reportInfo).subscribe(response=>{
        let base64String = response.fileContent;
        let blob = base64ToBlob(base64String, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        saveFile(blob, "BC_KHU_DAT.xlsx")
    });
  }

  search(): void {
      this.showTableLoading();

      this.setSortingForFilterModel(this.filterInputSearch);

      this._landAreaService.rEA_LAND_AREA_Search(this.filterInputSearch)
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

  getFilterField() {
    this._comboboxService.getComboboxData(ProjectField.class, ProjectField.attribute).subscribe(response=>{
        this.projectList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(InvestorField.class, InvestorField.attribute).subscribe(response=>{
        this.investorList = response
        this.updateView()
    })
  }
  

  onAdd(): void {
      this.navigatePassParam('/app/admin/land-area-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onUpdate(item: REA_LAND_AREA_ENTITY): void {
      this.navigatePassParam('/app/admin/land-area-edit', { landArea: item.id }, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onDelete(item: REA_LAND_AREA_ENTITY): void {
      this.message.confirm(
          this.l('DeleteWarningMessage', item.lanD_AREA_NAME),
          this.l('AreYouSure'),
          (isConfirmed) => {
              if (isConfirmed) {
                  this.saving = true;
                  this._landAreaService.rEA_LAND_AREA_Del(item.id)
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

  onApprove(item: REA_LAND_AREA_ENTITY): void {

  }

  onViewDetail(item: REA_LAND_AREA_ENTITY): void {
      this.navigatePassParam('/app/admin/land-area-view', { landArea: item.id }, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onSave(): void {

  }

  onResetSearch(): void {
      this.filterInput = new REA_LAND_AREA_SEARCH_DTO();
      this.changePage(0);
  }

  onSelectRecord(record: REA_LAND_AREA_ENTITY) {
      this.appToolbar.search();
  }
}
