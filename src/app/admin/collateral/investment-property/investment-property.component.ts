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
import { AsposeServiceProxy, CM_ALLCODE_ENTITY, InvestmentPropertyServiceProxy, REA_INVESTMENT_PROPERTY_ENTITY, REA_INVESTMENT_PROPERTY_SEARCH_DTO, ReportInfo } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";

@Component({
  templateUrl: "./investment-property.component.html",
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class InvestmentPropertyComponent extends ListComponentBase2<REA_INVESTMENT_PROPERTY_ENTITY, REA_INVESTMENT_PROPERTY_SEARCH_DTO> implements IUiAction<REA_INVESTMENT_PROPERTY_ENTITY>, OnInit, AfterViewInit{
  filterInput: REA_INVESTMENT_PROPERTY_SEARCH_DTO =new REA_INVESTMENT_PROPERTY_SEARCH_DTO();
  investProps: REA_INVESTMENT_PROPERTY_ENTITY[];
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
      private _investPropService: InvestmentPropertyServiceProxy,
      private pageResultService: InvestmentPropertyServiceProxy,
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

    this._investPropService.rEA_INVESTMENT_PROPERTY_Search(this.getFillterForCombobox()).subscribe(response => {
        this.investProps = response.items;
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

    // reportFilter.maxResultCount = -1;

    reportInfo.parameters = this.GetParamsFromFilter(reportFilter)

    reportInfo.values = this.GetParamsFromFilter({
        A1 : this.l('CompanyReportHeader')
    });

    reportInfo.pathName = "/COMMON/BC_CODONGNGOAI.xlsx";
    //reportInfo.storeName = "rpt_BC_PHONGBAN";
    reportInfo.storeName = "REA_LANDAREA_Search";

    this.asposeService.getReport(reportInfo).subscribe(x => {
        this.fileDownloadService.downloadTempFile(x);
    });
}

search(): void {
      this.showTableLoading();

      this.setSortingForFilterModel(this.filterInputSearch);

      this.filterInputSearch.id = ""
      this._investPropService.rEA_INVESTMENT_PROPERTY_Search(this.filterInputSearch)
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
      this.navigatePassParam('/app/admin/investment-property-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onUpdate(item: REA_INVESTMENT_PROPERTY_ENTITY): void {
      this.navigatePassParam('/app/admin/investment-property-edit', { investProp: item.id }, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onDelete(item: REA_INVESTMENT_PROPERTY_ENTITY): void {
      this.message.confirm(
          this.l('DeleteWarningMessage', item.invesT_PROP_NAME),
          this.l('AreYouSure'),
          (isConfirmed) => {
              if (isConfirmed) {
                  this.saving = true;
                  this._investPropService.rEA_INVESTMENT_PROPERTY_Del(item.id)
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

  onApprove(item: REA_INVESTMENT_PROPERTY_ENTITY): void {

  }

  onViewDetail(item: REA_INVESTMENT_PROPERTY_ENTITY): void {
      this.navigatePassParam('/app/admin/investment-property-view', { investProp: item.id }, { filterInput: JSON.stringify(this.filterInputSearch) });
  }

  onSave(): void {

  }

  onResetSearch(): void {
      this.filterInput = new REA_INVESTMENT_PROPERTY_SEARCH_DTO();
      this.changePage(0);
  }

  onSelectRecord(record: REA_INVESTMENT_PROPERTY_ENTITY) {
      this.appToolbar.search();
  }
}
