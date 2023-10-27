import { Component, OnInit, Injector, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { IUiAction } from '@app/ultilities/ui-action';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
	AccountKTServiceProxy,
	CM_ACCOUNT_KT_ENTITY,
	UltilityServiceProxy
} from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';

@Component({
	templateUrl: './account-kt-edit.component.html',
	animations: [ appModuleAnimation() ],
	encapsulation: ViewEncapsulation.None
})
export class AccountKTEditComponent extends DefaultComponentBase
	implements IUiAction<CM_ACCOUNT_KT_ENTITY>, OnInit, AfterViewInit {
	inputModel: CM_ACCOUNT_KT_ENTITY = new CM_ACCOUNT_KT_ENTITY();

	editPageState: EditPageState;
	EditPageState = EditPageState;

	isShowError = false;
	isApproveFunct: boolean;

	@ViewChild('editForm') editForm: ElementRef;

	constructor(
		injector: Injector,
		private accountKTService: AccountKTServiceProxy,
		private ultilityService: UltilityServiceProxy
	) {
		super(injector);
		this.editPageState = this.getRouteData('editPageState');
		this.inputModel.accounT_KT_ID = this.getRouteParam('id');
		this.initFilter();
		this.initIsApproveFunct();
	}

	ngOnInit(): void {
		switch (this.editPageState) {
			case EditPageState.add:
				this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
				this.inputModel.creatE_DT = moment();
				this.appToolbar.setRole('AccountKT', false, false, true, false, false, false, false, false);
				this.appToolbar.setEnableForEditPage();
				break;
			case EditPageState.edit:
				this.appToolbar.setRole('AccountKT', false, false, true, false, false, false, true, false);
				this.appToolbar.setEnableForEditPage();
				this.getAccountKT();
				break;
			case EditPageState.viewDetail:
				this.appToolbar.setRole('AccountKT', false, false, false, false, false, false, true, false);
				this.appToolbar.setEnableForViewDetailPage();
				this.getAccountKT();
				break;
		}
		this.appToolbar.setUiAction(this);
		this.updateView();
	}

	ngAfterViewInit(): void {}

	get disableInput(): boolean {
		return (
			this.editPageState == EditPageState.viewDetail ||
			(this.editPageState == EditPageState.edit && this.inputModel.autH_STATUS == AuthStatusConsts.Approve)
		);
	}

	focusOut(): void {
		this.updateView();
	}

	getAccountKT(): void {
		this.accountKTService.cM_ACCOUNT_KT_ById(this.inputModel.accounT_KT_ID).subscribe((res) => {
			this.inputModel = res;
			if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
				this.appToolbar.setButtonApproveEnable(false);
				this.appToolbar.setButtonSaveEnable(false);
			}
			this.updateView();
		});
	}

	saveInput(): void {
		if (this.isApproveFunct == undefined) {
			this.showErrorMessage(this.l('PageLoadUndone'));
			this.updateView();
			return;
		}

		if ((this.editForm as any).form.invalid) {
			this.isShowError = true;
			this.showErrorMessage(this.l('FormInvalid'));
			this.updateView();
			return;
		}

		if (this.editPageState != EditPageState.viewDetail) {
			this.saving = true;
			this.isShowError = false;

			if (!this.inputModel.accounT_KT_ID) {
				this.inputModel.makeR_ID = this.appSession.user.userName;
				this.insertAccountKT();
			} else {
				if (this.inputModel.makeR_ID != this.appSession.user.userName) {
					this.showErrorMessage(this.l('YouCantBeAllowedToUpdate'));
					abp.ui.clearBusy();
				} else {
					this.updateAccountKT();
				}
			}
		}
	}

	private insertAccountKT(): void {
		this.inputModel.autH_STATUS = AuthStatusConsts.NotApprove;
		this.accountKTService
			.cM_ACCOUNT_KT_Ins(this.inputModel)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe((res) => {
				if (res['Result'] != 0) {
					this.showErrorMessage(res['ErrorDesc']);
				} else {
					this.inputModel.accounT_KT_ID = res['id'];
					this.addNewSuccess();
				}
				this.updateView();
			});
	}

	private updateAccountKT(): void {
		this.accountKTService
			.cM_ACCOUNT_KT_Upd(this.inputModel)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe((res) => {
				if (res['Result'] != 0) {
					this.showErrorMessage(res['ErrorDesc']);
				} else {
					this.updateSuccess();
					if (!this.isApproveFunct) {
						this.accountKTService
							.cM_ACCOUNT_KT_Appr(this.inputModel.accounT_KT_ID, this.appSession.user.userName)
							.pipe(
								finalize(() => {
									this.saving = false;
								})
							)
							.subscribe((res) => {
								if (res['Result'] != 0) {
									this.showErrorMessage(res['ErrorDesc']);
								} else {
									this.inputModel.autH_STATUS = AuthStatusConsts.Approve;
								}
								this.updateView();
							});
					} else {
						this.inputModel.autH_STATUS = AuthStatusConsts.NotApprove;
					}
				}
				this.updateView();
			});
	}

	onSave(): void {
		this.saveInput();
	}

	initIsApproveFunct(): void {
		this.ultilityService.isApproveFunct(this.getCurrentFunctionId()).subscribe((res) => {
			this.isApproveFunct = res;
		});
	}

	onApprove(item: CM_ACCOUNT_KT_ENTITY): void {
		if (!this.inputModel.accounT_KT_ID) {
			return;
		}
		var currentUserName = this.appSession.user.userName;
		if (currentUserName == this.inputModel.makeR_ID || this.inputModel.autH_STATUS == AuthStatusConsts.Reject) {
			this.showErrorMessage(this.l('ApproveFailed'));
			return;
		}

		this.message.confirm(
			this.l('AccountKTApproveMessageConfirm', this.inputModel.accounT_KT_CODE),
			this.l('AreYouSure'),
			(isConfirmed) => {
				if (isConfirmed) {
					this.saving = true;
					this.accountKTService
						.cM_ACCOUNT_KT_Appr(this.inputModel.accounT_KT_ID, currentUserName)
						.pipe(
							finalize(() => {
								this.saving = false;
							})
						)
						.subscribe((res) => {
							if (res['Result'] != 0) {
								this.showErrorMessage(res['ErrorDesc']);
							} else {
								this.appToolbar.setButtonApproveEnable(false);
								this.approveSuccess();
							}
							this.updateView();
						});
				}
			}
		);
	}

	onAdd(): void {}
	onUpdate(item: CM_ACCOUNT_KT_ENTITY): void {}
	onDelete(item: CM_ACCOUNT_KT_ENTITY): void {}
	onViewDetail(item: CM_ACCOUNT_KT_ENTITY): void {}
	onSearch(): void {}
	onResetSearch(): void {}

	goBack(): void {
		this.navigatePassParam('/app/admin/account-kt', null, null);
	}
}
