import { GoodsTypeRealServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import {
	Component,
	Injector,
	ViewChild,
	Output,
	EventEmitter,
	OnInit,
	ViewEncapsulation,
	ElementRef
} from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { IUiAction } from '@app/ultilities/ui-action';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { CM_GOODSTYPE_REAL_ENTITY, UltilityServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';

@Component({
	templateUrl: './goodstype-real-edit.component.html',
	encapsulation: ViewEncapsulation.None,
	animations: [ appModuleAnimation() ]
})
export class GoodsTypeRealEditComponent extends DefaultComponentBase
	implements OnInit, IUiAction<CM_GOODSTYPE_REAL_ENTITY> {
	constructor(
		injector: Injector,
		private ultilityService: UltilityServiceProxy,
		private goodsTypeRealService: GoodsTypeRealServiceProxy
	) {
		super(injector);
		this.editPageState = this.getRouteData('editPageState');
		this.inputModel.gD_RETYPE_ID = this.getRouteParam('id');
		this.inputModel.creatE_DT = moment();
		this.initFilter();
		this.initIsApproveFunct();
	}

	@ViewChild('editForm') editForm: ElementRef;

	EditPageState = EditPageState;
	AllCodes = AllCodes;
	editPageState: EditPageState;

	inputModel: CM_GOODSTYPE_REAL_ENTITY = new CM_GOODSTYPE_REAL_ENTITY();
	filterInput: CM_GOODSTYPE_REAL_ENTITY;
	isApproveFunct: boolean;

	get disableInput(): boolean {
		return (
			this.editPageState == EditPageState.viewDetail ||
			(this.inputModel.autH_STATUS == AuthStatusConsts.Approve && this.editPageState == EditPageState.edit)
		);
	}

	isShowError = false;

	ngOnInit(): void {
		switch (this.editPageState) {
			case EditPageState.add:
				this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
				this.appToolbar.setRole('GoodsTypeReal', false, false, true, false, false, false, false, false);
				this.appToolbar.setEnableForEditPage();
				break;
			case EditPageState.edit:
				this.appToolbar.setRole('GoodsTypeReal', false, false, true, false, false, false, false, false);
				this.appToolbar.setEnableForEditPage();
				this.getGoodsTypeReal();
				break;
			case EditPageState.viewDetail:
				this.appToolbar.setRole('GoodsTypeReal', false, false, false, false, false, false, true, false);
				this.appToolbar.setEnableForViewDetailPage();
				this.getGoodsTypeReal();
				break;
		}

		this.appToolbar.setUiAction(this);
	}

	initIsApproveFunct() {
		this.ultilityService.isApproveFunct(this.getCurrentFunctionId()).subscribe((isApproveFunct) => {
			this.isApproveFunct = isApproveFunct;
		});
	}

	getGoodsTypeReal() {
		this.goodsTypeRealService.cM_GOODSTYPE_REAL_ById(this.inputModel.gD_RETYPE_ID).subscribe((response) => {
			this.inputModel = response;

			if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
				this.appToolbar.setButtonApproveEnable(false);
				this.appToolbar.setButtonSaveEnable(false);
			}
			this.updateView();
		});
	}

	saveInput() {
		if ((this.editForm as any).form.invalid) {
			this.isShowError = true;
			this.showErrorMessage(this.l('FormInvalid'));
			this.updateView();
			return;
		}
		if (this.editPageState != EditPageState.viewDetail) {
			this.saving = true;
			this.inputModel.makeR_ID = this.appSession.user.userName;
			if (!this.inputModel.gD_RETYPE_ID) {
				this.insertGoodsTypeReal();
			} else {
				this.updateGoodsTypeReal();
			}
		}
	}

	private insertGoodsTypeReal(): void {
		this.inputModel.autH_STATUS = AuthStatusConsts.NotApprove;
		this.goodsTypeRealService
			.cM_GOODSTYPE_REAL_Ins(this.inputModel)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe((response) => {
				if (response['Result'] != '0') {
					this.showErrorMessage(response['ErrorDesc']);
				} else {
                    this.inputModel.gD_RETYPE_ID = response['id'];
					this.addNewSuccess();
					// this.addNewSuccess();
					if (!this.isApproveFunct) {
						this.goodsTypeRealService
							.cM_GOODSTYPE_REAL_Appr(response.id, this.appSession.user.userName)
							.pipe(
								finalize(() => {
									this.saving = false;
								})
							)
							.subscribe((response) => {
								if (response['Result'] != '0') {
									this.showErrorMessage(response['ErrorDesc']);
								}
							});
					}
				}
			});
	}

	private updateGoodsTypeReal(): void {
		this.goodsTypeRealService
			.cM_GOODSTYPE_REAL_Upd(this.inputModel)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe((response) => {
				if (response['Result'] != '0') {
					this.showErrorMessage(response['ErrorDesc']);
				} else {
					this.updateSuccess();
					// this.updateSuccess();
					if (!this.isApproveFunct) {
						this.goodsTypeRealService
							.cM_GOODSTYPE_REAL_Appr(this.inputModel.gD_RETYPE_ID, this.appSession.user.userName)
							.pipe(
								finalize(() => {
									this.saving = false;
								})
							)
							.subscribe((response) => {
								if (response['Result'] != '0') {
									this.showErrorMessage(response['ErrorDesc']);
								} else {
									this.inputModel.autH_STATUS = AuthStatusConsts.Approve;
								}
							});
					} else {
						this.inputModel.autH_STATUS = AuthStatusConsts.NotApprove;
					}
				}
			});
	}

	goBack() {
		this.navigatePassParam('/app/admin/goodstype-real', null, { filterInput: JSON.stringify(this.filterInput) });
	}

	onApprove(item: CM_GOODSTYPE_REAL_ENTITY): void {
		if (!this.inputModel.gD_RETYPE_ID) {
			return;
		}
		var currentUserName = this.appSession.user.userName;
		if (currentUserName == this.inputModel.makeR_ID) {
			this.showErrorMessage(this.l('ApproveFailed'));
			return;
		}
		this.message.confirm(
			this.l('GoodsTypeRealApproveMessageConfirm', this.l(this.inputModel.gD_RETYPE_CODE)),
			this.l('AreYouSure'),
			(isConfirmed) => {
				if (isConfirmed) {
					this.saving = true;
					this.goodsTypeRealService
						.cM_GOODSTYPE_REAL_Appr(this.inputModel.gD_RETYPE_ID, currentUserName)
						.pipe(
							finalize(() => {
								this.saving = false;
							})
						)
						.subscribe((response) => {
							if (response['Result'] != '0') {
								this.showErrorMessage(response['ErrorDesc']);
							} else {
								//

								this.appToolbar.setButtonApproveEnable(false);
								this.approveSuccess();
							}
							this.updateView();
						});
				}
			}
		);
	}

	onSave(): void {
		this.saveInput();
	}

	onAdd(): void {}
	onUpdate(item: CM_GOODSTYPE_REAL_ENTITY): void {}
	onDelete(item: CM_GOODSTYPE_REAL_ENTITY): void {}
	onViewDetail(item: CM_GOODSTYPE_REAL_ENTITY): void {}
	onSearch(): void {}
	onResetSearch(): void {}
}
