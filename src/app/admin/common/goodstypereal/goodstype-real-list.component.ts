import {
	AsposeServiceProxy,
	CM_GOODSTYPE_REAL_ENTITY,
	GoodsTypeRealServiceProxy,
	ReportInfo
} from '../../../../shared/service-proxies/service-proxies';
import { ListComponentBase } from '@app/ultilities/list-component-base';
import { Injector, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { LazyLoadEvent } from 'primeng/api';
import { IUiAction } from '@app/ultilities/ui-action';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { finalize } from 'rxjs/operators';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';

@Component({
	templateUrl: './goodstype-real-list.component.html',
	encapsulation: ViewEncapsulation.None,
	animations: [ appModuleAnimation() ]
})
export class GoodsTypeRealListComponent extends ListComponentBase<CM_GOODSTYPE_REAL_ENTITY>
	implements IUiAction<CM_GOODSTYPE_REAL_ENTITY>, OnInit {
	ngAfterViewInit(): void {
		this.updateView();
	}

	initDefaultFilter() {}

	filterInput: CM_GOODSTYPE_REAL_ENTITY = new CM_GOODSTYPE_REAL_ENTITY();

	constructor(
		injector: Injector,
		private fileDownloadService: FileDownloadService,
		private goodsTypeRealService: GoodsTypeRealServiceProxy,
		private asposeService: AsposeServiceProxy
	) {
		super(injector);
		this.initFilter();
	}

	ngOnInit(): void {
		// set ui action
		this.appToolbar.setUiAction(this);
		// set role toolbar
		this.appToolbar.setRole('GoodsTypeReal', true, true, false, true, true, true, false, true);
		this.appToolbar.setEnableForListPage();
	}

	exportToExcel() {
		// this.projectService.tR_PROJECT_ToExcel(this.filterInput).subscribe(response => {
		//     this.fileDownloadService.downloadTempFile(response);
		// })
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

		reportInfo.pathName = '/COMMON/BC_LOAI_HANG_HOA_THUC_TE.xlsx';
		reportInfo.storeName = 'CM_GOODSTYPE_REAL_Search';
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

		this.goodsTypeRealService
			.cM_GOODSTYPE_REAL_Search(this.filterInputSearch)
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
		this.navigatePassParam('/app/admin/goodstype-real-add', null, {
			filterInput: JSON.stringify(this.filterInputSearch)
		});
	}

	onUpdate(item: CM_GOODSTYPE_REAL_ENTITY): void {
		this.navigatePassParam(
			'/app/admin/goodstype-real-edit',
			{ id: item.gD_RETYPE_ID },
			{ filterInput: JSON.stringify(this.filterInputSearch) }
		);
	}

	onDelete(item: CM_GOODSTYPE_REAL_ENTITY): void {
		if (
			(item.autH_STATUS == AuthStatusConsts.Approve && item.recorD_STATUS == RecordStatusConsts.InActive) ||
			(item.autH_STATUS == AuthStatusConsts.NotApprove && item.checkeR_ID)
		) {
			this.showErrorMessage(this.l('CantDeleteApprovedItem'));
			return;
		}
		this.message.confirm(this.l('GoodsTypeRealDeleteMessageConfirm', item.gD_RETYPE_CODE), this.l('AreYouSure'), (isConfirmed) => {
			if (isConfirmed) {
				this.saving = true;
				this.goodsTypeRealService
					.cM_GOODSTYPE_REAL_Del(item.gD_RETYPE_ID)
					.pipe(
						finalize(() => {
							this.saving = false;
						})
					)
					.subscribe((response) => {
						if (response['Result'] != '0') {
							this.showErrorMessage(response['ErrorDesc']);
						} else {
							this.showSuccessMessage(this.l('SuccessfullyDeleted'));
							this.filterInputSearch.totalCount = 0;
							this.reloadPage();
							// this.changePage(0);
						}
					});
			}
		});
	}

	onApprove(item: CM_GOODSTYPE_REAL_ENTITY): void {}

	onViewDetail(item: CM_GOODSTYPE_REAL_ENTITY): void {
		this.navigatePassParam(
			'/app/admin/goodstype-real-view',
			{ id: item.gD_RETYPE_ID },
			{ filterInput: JSON.stringify(this.filterInputSearch) }
		);
	}

	onSave(): void {}

	onResetSearch(): void {
		this.filterInput = new CM_GOODSTYPE_REAL_ENTITY();
		this.filterInput.creatE_DT = undefined;
		this.changePage(0);
		this.updateView();
	}
}
