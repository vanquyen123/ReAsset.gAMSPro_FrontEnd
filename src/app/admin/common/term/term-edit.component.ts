import {
	Component,
	Injector,
	ViewChild,
	OnInit,
	ViewEncapsulation,
	ElementRef,
	AfterViewChecked,
	AfterViewInit
} from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { TermServiceProxy,ProfileServiceProxy, CM_TERM_ENTITY, UltilityServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { IUiAction } from '@app/ultilities/ui-action';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import * as moment from 'moment';

@Component({
	templateUrl: './term-edit.component.html',
	encapsulation: ViewEncapsulation.None,
	animations: [ appModuleAnimation() ]
})
export class TermEditComponent extends DefaultComponentBase
	implements OnInit, IUiAction<CM_TERM_ENTITY>, AfterViewInit {
	ngAfterViewInit(): void {
		this.setupValidationMessage();
		this.updateView();
	}
	constructor(
		injector: Injector,
		private ultilityService: UltilityServiceProxy,
        private _profileService: ProfileServiceProxy,
		private termService: TermServiceProxy
	) {
		super(injector);
		this.editPageState = this.getRouteData('editPageState');
		this.inputModel.terM_ID = this.getRouteParam('id');
		this.inputModel.creatE_DT = moment();
		this.initFilter();
		this.initIsApproveFunct();
	}

	@ViewChild('editForm') editForm: ElementRef;

	isDisabled = true;
	EditPageState = EditPageState;
	AllCodes = AllCodes;
	editPageState: EditPageState;

	filterInput: CM_TERM_ENTITY = new CM_TERM_ENTITY();
	inputModel: CM_TERM_ENTITY = new CM_TERM_ENTITY();
	isCheckAdmin = false;

	isApproveFunct: boolean;

	get disableInput(): boolean {
		return (
			this.editPageState == EditPageState.viewDetail 
			//|| (this.inputModel.autH_STATUS == AuthStatusConsts.Approve && this.editPageState == EditPageState.edit && !this.isCheckAdmin)
		);
	}

	isShowError = false;

	ngOnInit(): void {
		switch (this.editPageState) {
			case EditPageState.add:
				this.inputModel.brancH_CREATE = this.appSession.user.subbrId;
				this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
				this.inputModel.creatE_DT = moment();
				this.appToolbar.setRole('CommonTerm', false, false, true, false, false, false, false, false);
				this.appToolbar.setEnableForEditPage();
				break;
			case EditPageState.edit:
				this.appToolbar.setRole('CommonTerm', false, false, true, false, false, false, false, false);
				this.appToolbar.setEnableForEditPage();
				this.getTerm();
				break;
			case EditPageState.viewDetail:
				this.appToolbar.setRole('CommonTerm', false, false, false, false, false, false, true, false);
				this.appToolbar.setEnableForViewDetailPage();
				this.getTerm();
				break;
		}

		this.appToolbar.setUiAction(this);
	}

	initIsApproveFunct() {
		this.ultilityService.isApproveFunct(this.getCurrentFunctionId()).subscribe((isApproveFunct) => {
			this.isApproveFunct = isApproveFunct;
		});
	}

	getTerm() {
		this.termService.cM_TERM_ById(this.inputModel.terM_ID).subscribe((response) => {
			this.inputModel = response;
			if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
				this.appToolbar.setButtonApproveEnable(false);
				this.appToolbar.setButtonSaveEnable(true);
			}
			// this._profileService.getCurrentUserProfileForEdit().subscribe(result=>{
			// 	result.roles.forEach(x=>{
	
			// 		if(x.roleName=="Administrator"){
			// 			this.isCheckAdmin = true;
			// 			this.appToolbar.setButtonSaveEnable(true);
			// 			this.updateView();
			// 			this.disableInput;

			// 			return
			// 		}
			// 	})
	
			// });
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
			this.isShowError = false;
			this.inputModel.recorD_STATUS = '1'
			this.inputModel.makeR_ID = this.appSession.user.userName;
			if (!this.inputModel.terM_ID) {
				this.insertTerm();
			} else {
				this.updateTerm();
			}
		}
	}

	private insertTerm(): void {
		this.inputModel.autH_STATUS = AuthStatusConsts.NotApprove;
		this.termService
			.cM_TERM_Ins(this.inputModel)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe((response) => {
				if (response['Result'] != 0) {
					this.showErrorMessage(response['ErrorDesc']);
				} else {
					this.inputModel.terM_ID = response['id'];
					this.addNewSuccess();
					if (!this.isApproveFunct) {
						this.termService
							.cM_TERM_App(response.id, this.appSession.user.userName)
							.pipe(
								finalize(() => {
									this.saving = false;
								})
							)
							.subscribe((response) => {
								if (response['Result'] != 0) {
									this.showErrorMessage(response['ErrorDesc']);
								}
							});
					}
				}
			});
	}

	private updateTerm(): void {
		this.termService
			.cM_TERM_Upd(this.inputModel)
			.pipe(
				finalize(() => {
					this.saving = false;
				})
			)
			.subscribe((response) => {
				if (response['Result'] != 0) {
					this.showErrorMessage(response['ErrorDesc']);
				} else {
					this.updateSuccess();
					// this.updateSuccess();
					if (!this.isApproveFunct) {
						this.termService
							.cM_TERM_App(this.inputModel.terM_ID, this.appSession.user.userName)
							.pipe(
								finalize(() => {
									this.saving = false;
								})
							)
							.subscribe((response) => {
								if (response['Result'] != 0) {
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
		this.navigatePassParam('/app/admin/term', null, { filterInput: JSON.stringify(this.filterInput) });
	}

	onAdd(): void {}

	onUpdate(item: CM_TERM_ENTITY): void {}

	onDelete(item: CM_TERM_ENTITY): void {}

	onApprove(item: CM_TERM_ENTITY): void {
		// tslint:disable-next-line:no-var-keyword
		var currentUserName = this.appSession.user.userName;
		if (currentUserName == this.inputModel.makeR_ID) {
			this.showErrorMessage(this.l('ApproveFailed'));
			return;
		}
		this.message.confirm(
			this.l('TermApproveMessageConfirm', this.l(this.inputModel.terM_CODE)),
			this.l('AreYouSure'),
			(isConfirmed) => {
				if (isConfirmed) {
					this.saving = true;
					this.termService
						.cM_TERM_App(this.inputModel.terM_ID, currentUserName)
						.pipe(
							finalize(() => {
								this.saving = false;
							})
						)
						.subscribe((response) => {
							if (response['Result'] != '0') {
								this.showErrorMessage(response['ErrorDesc']);
							} else {
								// this.showSuccessMessage(this.l('SuccessfullyApprove'));
								// this.inputModel.autH_STATUS = AuthStatusConsts.Approve;
								this.approveSuccess();
								this.appToolbar.setButtonApproveEnable(false);
								this.updateView();
							}
						});
				}
			}
		);
	}

	onViewDetail(item: CM_TERM_ENTITY): void {}

	onSave(): void {
		this.saveInput();
	}

	onSearch(): void {}

	onResetSearch(): void {}
	focusOut() {
		this.updateView();
	}
}
