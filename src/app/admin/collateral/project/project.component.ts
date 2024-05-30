import {
  AfterViewInit,
  Component,
  Injector,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { base64ToBlob, saveFile } from "@app/ultilities/blob-exec";
import { ReaAllCode } from "@app/ultilities/enum/all-codes";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import { IUiAction } from "@app/ultilities/ui-action";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AllCodeServiceProxy, AsposeServiceProxy, CM_ALLCODE_ENTITY, ProjectServiceProxy, REA_PROJECT_ENTITY, ReportInfo } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";

@Component({
  templateUrl: "./project.component.html",
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectComponent extends ListComponentBase<REA_PROJECT_ENTITY> implements IUiAction<REA_PROJECT_ENTITY>, OnInit, AfterViewInit{
  filterInput: REA_PROJECT_ENTITY =new REA_PROJECT_ENTITY();
  projects: REA_PROJECT_ENTITY[];
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
  projectTypeList;

  constructor(
      injector: Injector,
      private fileDownloadService: FileDownloadService,
      private asposeService: AsposeServiceProxy,
      private _projectService: ProjectServiceProxy,
      private pageResultService: ProjectServiceProxy,
      private allCodeService: AllCodeServiceProxy
      // private branchService: BranchServiceProxy
  ) {
      super(injector);
      this.initFilter();
  }

  initDefaultFilter() {
      // this.filterInput.top = 200;
  }

  ngOnInit() {
    this.getAllTypes()
    this.appToolbar.setUiAction(this);
    // set role toolbar
    this.appToolbar.setRole('Project', true, true, false, true, true, true, false, true, true);
    this.appToolbar.setEnableForListPage();

    this._projectService.rEA_PROJECT_Search(this.getFillterForCombobox()).subscribe(response => {
        this.projects = response.items;
        this.updateView();
    });
    var filterCombobox=this.getFillterForCombobox();
    setTimeout(()=>{this.filterInputSearch=this.filterInput,this.search()}, 1000);
  }

  ngAfterViewInit(): void {
      // COMMENT: this.stopAutoUpdateView();
  }

  exportToExcel() {
    let reportInfo = new REA_PROJECT_ENTITY(this.filterInput)
    reportInfo.maxResultCount = 999;
    reportInfo.skipCount = 0;
    this._projectService.getExcelBySearch(reportInfo).subscribe(response=>{
        let base64String = response.fileContent;
        let blob = base64ToBlob(base64String, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        saveFile(blob, "BC_DU_AN.xlsx")
    });
  }

  

  getAllTypes() {
    this.allCodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.PROJECT_TYPE, "")
    .subscribe(response =>{
        this.projectTypeList = response
    })
  }

  search(): void {
      this.showTableLoading();

      this.setSortingForFilterModel(this.filterInputSearch);

      this._projectService.rEA_PROJECT_Search(this.filterInputSearch)
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
      this.navigatePassParam('/app/admin/project-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onUpdate(item: REA_PROJECT_ENTITY): void {
      this.navigatePassParam('/app/admin/project-edit', { project: item.id }, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onDelete(item: REA_PROJECT_ENTITY): void {
      this.message.confirm(
          this.l('DeleteWarningMessage', item.projecT_NAME),
          this.l('AreYouSure'),
          (isConfirmed) => {
              if (isConfirmed) {
                  this.saving = true;
                  this._projectService.rEA_PROJECT_Del(item.id)
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

  onApprove(item: REA_PROJECT_ENTITY): void {

  }

  onViewDetail(item: REA_PROJECT_ENTITY): void {
      this.navigatePassParam('/app/admin/project-view', { project: item.id }, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onSave(): void {

  }

  onResetSearch(): void {
      this.filterInput = new REA_PROJECT_ENTITY();
      this.changePage(0);
  }

  onSelectRecord(record: REA_PROJECT_ENTITY) {
      this.appToolbar.search();
  }
}
