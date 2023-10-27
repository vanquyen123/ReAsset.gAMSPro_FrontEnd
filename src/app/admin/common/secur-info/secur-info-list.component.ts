import { Component, OnInit, Injector, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { ListComponentBase } from '@app/ultilities/list-component-base';
import { IUiAction } from '@app/ultilities/ui-action';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
	AsposeServiceProxy,
	CM_SECUR_INFO_ENTITY,
    ReportInfo,
	SecurInfoServiceProxy
} from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { finalize } from 'rxjs/operators';

@Component({
	templateUrl: './secur-info-list.component.html',
	encapsulation: ViewEncapsulation.None,
	animations: [ appModuleAnimation() ]
})
export class SecurInfoListComponent extends ListComponentBase<CM_SECUR_INFO_ENTITY>
	implements OnInit, IUiAction<CM_SECUR_INFO_ENTITY>, AfterViewInit {
	filterInput: CM_SECUR_INFO_ENTITY = new CM_SECUR_INFO_ENTITY();

	constructor(
		injector: Injector,
		private securInfoService: SecurInfoServiceProxy,
		private asposeService: AsposeServiceProxy,
		private fileDownloadService: FileDownloadService
	) {
		super(injector);
	}

	ngOnInit(): void {
		this.appToolbar.setUiAction(this);
		this.appToolbar.setRole('SecurInfo', true, true, false, true, true, true, false, true);
		this.appToolbar.setEnableForListPage();
	}

	ngAfterViewInit(): void {
		this.updateView();
	}

	search(): void {
		this.showTableLoading();
		this.setSortingForFilterModel(this.filterInputSearch);
		this.securInfoService
			.cM_SECUR_INFO_Search(this.filterInputSearch)
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
		this.filterInput = new CM_SECUR_INFO_ENTITY();
		this.filterInput.creatE_DT = undefined;
		this.changePage(0);
		this.updateView();
	}

	onAdd(): void {
		this.navigatePassParam('/app/admin/secur-info-add', null, {
			filterInput: JSON.stringify(this.filterInputSearch)
		});
	}

	onUpdate(item: CM_SECUR_INFO_ENTITY): void {
		this.navigatePassParam(
			'/app/admin/secur-info-edit',
			{ id: item.secuR_INFO_ID },
			{
				filterInput: JSON.stringify(this.filterInputSearch)
			}
		);
	}

	onViewDetail(item: CM_SECUR_INFO_ENTITY): void {
		this.navigatePassParam(
			'/app/admin/secur-info-view',
			{ id: item.secuR_INFO_ID },
			{
				filterInput: JSON.stringify(this.filterInputSearch)
			}
		);
	}

	onDelete(item: CM_SECUR_INFO_ENTITY): void {
		this.message.confirm(
			this.l('SecurInfoDeleteMessageConfirm', item.secuR_INFO_CODE),
			this.l('AreYouSure'),
			(isConfirmed) => {
				if (isConfirmed) {
					this.saving = true;
					this.securInfoService
						.cM_SECUR_INFO_Del(item.secuR_INFO_ID)
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
				} else {
				}
			}
		);
	}

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

		reportInfo.pathName = '/COMMON/BC_MUCDO_ANTOAN_THONGTIN.xlsx';
		reportInfo.storeName = 'CM_SECUR_INFO_Search';
		reportInfo.values = this.GetParamsFromFilter({
			A1: this.l('CompanyNameHeader')
		});
		this.asposeService.getReport(reportInfo).subscribe((res) => {
			this.fileDownloadService.downloadTempFile(res);
		});
    }

	onApprove(item: CM_SECUR_INFO_ENTITY): void {}
	onSave(): void {}
}
