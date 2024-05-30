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
import { AsposeServiceProxy, ReportInfo, CM_SUBSIDIARY_COMPANY_ENTITY, CM_SUBSIDIARY_COMPANY_SEARCH_DTO, SubsidiaryCompanyServiceProxy } from "@shared/service-proxies/service-proxies";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { finalize } from "rxjs/operators";

@Component({
    templateUrl: "./company.component.html",
    animations: [appModuleAnimation()],
    encapsulation: ViewEncapsulation.None,
})
export class CompanyComponent extends ListComponentBase2<CM_SUBSIDIARY_COMPANY_ENTITY, CM_SUBSIDIARY_COMPANY_SEARCH_DTO> implements IUiAction<CM_SUBSIDIARY_COMPANY_ENTITY>, OnInit, AfterViewInit{
    filterInput: CM_SUBSIDIARY_COMPANY_SEARCH_DTO =new CM_SUBSIDIARY_COMPANY_SEARCH_DTO();
    companies: CM_SUBSIDIARY_COMPANY_ENTITY[];
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
        private _subsidiaryCompanyService: SubsidiaryCompanyServiceProxy,
        private pageResultService: SubsidiaryCompanyServiceProxy,
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
      this.appToolbar.setRole('SubsidiaryCompany', true, true, false, true, true, true, false, true);
      this.appToolbar.setEnableForListPage();

      this._subsidiaryCompanyService.cM_SUBSIDIARY_COMPANY_Search(this.getFillterForCombobox()).subscribe(response => {
          this.companies = response.items;
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

        this._subsidiaryCompanyService.cM_SUBSIDIARY_COMPANY_Search(this.filterInputSearch)
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
        this.navigatePassParam('/app/admin/subsidiary-company-add', null, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onUpdate(item: CM_SUBSIDIARY_COMPANY_ENTITY): void {
        this.navigatePassParam('/app/admin/subsidiary-company-edit', { company: item.id }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onDelete(item: CM_SUBSIDIARY_COMPANY_ENTITY): void {
        this.message.confirm(
            this.l('DeleteWarningMessage', item.subsidiarY_NAME),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this._subsidiaryCompanyService.cM_SUBSIDIARY_COMPANY_Del(item.id)
                        .pipe(finalize(() => { this.saving = false; }))
                        .subscribe((response) => {
                            this.showSuccessMessage(this.l('SuccessfullyDeleted'));
                            this.reloadPage();
                        });
                }
            }
        );
    }

    onApprove(item: CM_SUBSIDIARY_COMPANY_ENTITY): void {

    }

    onViewDetail(item: CM_SUBSIDIARY_COMPANY_ENTITY): void {
        this.navigatePassParam('/app/admin/subsidiary-company-view', { company: item.id }, { filterInput: JSON.stringify(this.filterInputSearch) });
    }

    onSave(): void {

    }

    onResetSearch(): void {
        this.filterInput = new CM_SUBSIDIARY_COMPANY_SEARCH_DTO();
        this.changePage(0);
    }

    onSelectRecord(record: CM_SUBSIDIARY_COMPANY_ENTITY) {
        this.appToolbar.search();
    }
}
