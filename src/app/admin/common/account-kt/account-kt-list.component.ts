import { Component, OnInit, Injector, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { ListComponentBase } from '@app/ultilities/list-component-base';
import { IUiAction } from '@app/ultilities/ui-action';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
	AccountKTServiceProxy,
	AsposeServiceProxy,
	CM_ACCOUNT_KT_ENTITY,
	ReportInfo
} from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { finalize } from 'rxjs/operators';

@Component({
	templateUrl: './account-kt-list.component.html',
	encapsulation: ViewEncapsulation.None,
	animations: [ appModuleAnimation() ]
})
export class AccountKTListComponent extends ListComponentBase<CM_ACCOUNT_KT_ENTITY>
	implements OnInit, IUiAction<CM_ACCOUNT_KT_ENTITY>, AfterViewInit {
	filterInput: CM_ACCOUNT_KT_ENTITY = new CM_ACCOUNT_KT_ENTITY();

	constructor(
		injector: Injector,
		private accountKTService: AccountKTServiceProxy,
		private asposeService: AsposeServiceProxy,
		private fileDownloadService: FileDownloadService
	) {
		super(injector);
	}

	ngOnInit(): void {
		this.appToolbar.setUiAction(this);
		this.appToolbar.setRole('AccountKT', true, true, false, true, true, true, false, true);
		this.appToolbar.setEnableForListPage();
	}

	ngAfterViewInit(): void {
		this.updateView();
	}

	search(): void {
		this.showTableLoading();
		this.setSortingForFilterModel(this.filterInputSearch);
		this.accountKTService
			.cM_ACCOUNT_KT_Search(this.filterInputSearch)
			.pipe(finalize(() => this.hideTableLoading()))
			.subscribe((res) => {
				this.dataTable.records = res.items;
				this.dataTable.totalRecordsCount = res.totalCount;
				this.filterInputSearch.totalCount = res.totalCount;
				this.appToolbar.setEnableForListPage();
				this.updateView();
			});
	}

	onResetSearch(): void {
		this.filterInput = new CM_ACCOUNT_KT_ENTITY();
		this.filterInput.creatE_DT = undefined;
		this.changePage(0);
		this.updateView();
	}

	onAdd(): void {
		this.navigatePassParam('/app/admin/account-kt-add', null, {
			filterInput: JSON.stringify(this.filterInputSearch)
		});
	}

	onUpdate(item: CM_ACCOUNT_KT_ENTITY): void {
		this.navigatePassParam(
			'/app/admin/account-kt-edit',
			{ id: item.accounT_KT_ID },
			{
				filterInput: JSON.stringify(this.filterInputSearch)
			}
		);
	}

	onViewDetail(item: CM_ACCOUNT_KT_ENTITY): void {
		this.navigatePassParam(
			'/app/admin/account-kt-view',
			{ id: item.accounT_KT_ID },
			{
				filterInput: JSON.stringify(this.filterInputSearch)
			}
		);
	}

	onDelete(item: CM_ACCOUNT_KT_ENTITY): void {
		this.message.confirm(
			this.l('AccountKTDeleteMessageConfirm', item.accounT_KT_CODE),
			this.l('AreYouSure'),
			(isConfirmed) => {
				if (isConfirmed) {
					this.saving = true;
					this.accountKTService
						.cM_ACCOUNT_KT_Del(item.accounT_KT_ID)
						.pipe(
							finalize(() => {
								this.saving = false;
							})
						)
						.subscribe((res) => {
							if (res['Result'] != 0) {
								this.showErrorMessage(res['ErrorDesc']);
							} else {
								if (item.autH_STATUS == AuthStatusConsts.Approve) {
									this.showSuccessMessage(this.l('RecordStatusIsChangedToInActive'));
								} else if (item.autH_STATUS == AuthStatusConsts.NotApprove) {
									this.showSuccessMessage(this.l('SuccessfullyDeleted'));
								}
								this.filterInputSearch.totalCount = 0;
								this.reloadPage();
							}
						});
				}
			}
		);
	}

	onApprove(item: CM_ACCOUNT_KT_ENTITY): void {}
	onSave(): void {}

	exportListExcel(): void {
		let reportInfo = new ReportInfo();
		reportInfo.typeExport = ReportTypeConsts.Excel;

		let filterReport = { ...this.filterInputSearch };
		filterReport.maxResultCount = -1;
		filterReport.totalCount = this.isNull(filterReport.totalCount) ? 0 : filterReport.totalCount;
		filterReport.skipCount = 0;
		reportInfo.parameters = this.GetParamsFromFilter(filterReport);

		reportInfo.values = this.GetParamsFromFilter({
			A1: this.l('CompanyNameHeader')
		});

		reportInfo.pathName = '/COMMON/BC_TAIKHOAN_KETOAN.xlsx';
		reportInfo.storeName = 'CM_ACCOUNT_KT_Search';
		reportInfo.values = this.GetParamsFromFilter({
			A1: this.l('CompanyNameHeader')
		});
		this.asposeService.getReport(reportInfo).subscribe((res) => {
			this.fileDownloadService.downloadTempFile(res);
		});
	}
}
