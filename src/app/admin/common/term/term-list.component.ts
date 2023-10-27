import { ListComponentBase } from '@app/ultilities/list-component-base';
import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit, AfterViewChecked } from '@angular/core';
import {
	CM_TERM_ENTITY,
	TermServiceProxy,
	ReportInfo,
	AsposeServiceProxy
} from '@shared/service-proxies/service-proxies';
import { IUiAction } from '@app/ultilities/ui-action';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { finalize } from 'rxjs/operators';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';

@Component({
	templateUrl: './term-list.component.html',
	encapsulation: ViewEncapsulation.None,
	animations: [ appModuleAnimation() ]
})
export class TermListComponent extends ListComponentBase<CM_TERM_ENTITY>
	implements IUiAction<CM_TERM_ENTITY>, OnInit, AfterViewInit {
	ngAfterViewInit(): void {
		this.updateView();
	}

	initDefaultFilter() {}

	filterInput: CM_TERM_ENTITY = new CM_TERM_ENTITY();

	constructor(
		injector: Injector,
		private fileDownloadService: FileDownloadService,
		private termService: TermServiceProxy,
		private asposeService: AsposeServiceProxy
	) {
		super(injector);
		this.initFilter();
	}

	ngOnInit(): void {
		// set ui action
		this.appToolbar.setUiAction(this);
		// set role toolbar
		this.appToolbar.setRole('CommonTerm', true, true, false, true, true, true, false, true);
		this.appToolbar.setEnableForListPage();
	}

	exportToExcel() {
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

		reportInfo.pathName = '/COMMON/BC_DOTKIEMKE.xlsx';
		reportInfo.storeName = 'CM_TERM_SearchParam';
		reportInfo.values = this.GetParamsFromFilter({
			A1: this.l('CompanyNameHeader')
		});
		this.asposeService.getReport(reportInfo).subscribe((x) => {
			this.fileDownloadService.downloadTempFile(x);
		});
	}

	search(): void {
		this.showTableLoading();

		this.setSortingForFilterModel(this.filterInputSearch);

		this.termService
			.cM_TERM_SearchParam(this.filterInputSearch)
			.pipe(finalize(() => this.hideTableLoading()))
			.subscribe((result) => {
				this.dataTable.records = result.items;
				this.dataTable.totalRecordsCount = result.totalCount;
				this.filterInputSearch.totalCount = result.totalCount;

				this.appToolbar.setEnableForListPage();
				this.updateView();
			});
	}

	onAdd(): void {
		this.navigatePassParam('/app/admin/term-add', null, {
			filterInput: JSON.stringify(this.filterInputSearch)
		});
	}

	onUpdate(item: CM_TERM_ENTITY): void {
		this.navigatePassParam(
			'/app/admin/term-edit',
			{ id: item.terM_ID },
			{ filterInput: JSON.stringify(this.filterInputSearch) }
		);
	}

	onViewDetail(item: CM_TERM_ENTITY): void {
		this.navigatePassParam(
			'/app/admin/term-view',
			{ id: item.terM_ID },
			{ filterInput: JSON.stringify(this.filterInputSearch) }
		);
	}

	onDelete(item: CM_TERM_ENTITY): void {
		if (
			(item.autH_STATUS == AuthStatusConsts.Approve && item.recorD_STATUS == RecordStatusConsts.InActive) ||
			(item.autH_STATUS == AuthStatusConsts.NotApprove && item.checkeR_ID)
		) {
			this.showErrorMessage(this.l('CantDeleteApprovedItem'));
			return;
		}
		this.message.confirm(this.l('TermDeleteMessageConfirm', item.terM_ID), this.l('AreYouSure'), (isConfirmed) => {
			if (isConfirmed) {
				this.saving = true;
				this.termService
					.cM_TERM_Del(item.terM_ID)
					.pipe(
						finalize(() => {
							this.saving = false;
						})
					)
					.subscribe((response) => {
						if (response['Result'] != 0) {
							this.showErrorMessage(response['ErrorDesc']);
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
		});
	}

	onApprove(item: CM_TERM_ENTITY): void {}

	onSave(): void {}

	onResetSearch(): void {
		this.filterInput = new CM_TERM_ENTITY();
		this.filterInput.creatE_DT = undefined;
		this.changePage(0);
		this.updateView();
	}
}
