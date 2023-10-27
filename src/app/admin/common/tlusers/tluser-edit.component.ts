import { Component, Injector, ViewChild, Output, EventEmitter, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { TlUserServiceProxy, TL_USER_ENTITY, RoleServiceProxy, AppPermissionServiceProxy, UltilityServiceProxy, BranchServiceProxy, CM_BRANCH_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { IUiAction } from '@app/ultilities/ui-action';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';

@Component({
    templateUrl: './tluser-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class TlUserEditComponent extends DefaultComponentBase implements OnInit, IUiAction<TL_USER_ENTITY>, AfterViewInit {

    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private tlUserService: TlUserServiceProxy,
        private branchService: BranchServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.tlid = this.getRouteParam('id');
        this.initFilter();
        this.initIsApproveFunct();
        this.initComboboxs();
        this.initDefaultValue();
    }

    @ViewChild('editForm') editForm: ElementRef;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;
    branchs: CM_BRANCH_ENTITY[];

    inputModel: TL_USER_ENTITY = new TL_USER_ENTITY();
    filterInput: TL_USER_ENTITY;
    isApproveFunct: boolean;

    initComboboxs() {
        let filterCombobox = this.getFillterForCombobox();
        this.branchService.cM_BRANCH_Search(filterCombobox).subscribe(response => {
            this.branchs = response.items;
            this.updateView();
        })
    }

    initDefaultValue(){
        this.inputModel.brancH_ID = this.appSession.user.subbrId;
    }

    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail;
    }

    isShowError = false;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.appToolbar.setRole('TlUser', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('TlUser', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getTlUser();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('TlUser', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getTlUser();
                break;
        }

        this.appToolbar.setUiAction(this);
    }

    ngAfterViewInit(): void {
        // COMMENT: this.stopAutoUpdateView();
        this.setupValidationMessage();
    }

    initIsApproveFunct() {
        this.ultilityService.isApproveFunct(this.getCurrentFunctionId()).subscribe(isApproveFunct => {
            this.isApproveFunct = isApproveFunct;
        })
    }


    getTlUser() {
        this.tlUserService.tL_USER_ById(this.inputModel.tlid).subscribe(response => {
            this.inputModel = response;
            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
            }
            this.updateView();
        });
    }

    saveInput() {
        if (this.isApproveFunct == undefined) {
            this.showErrorMessage(this.l('PageLoadUndone'));
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
            this.inputModel.makeR_ID = this.appSession.user.userName;
            if (!this.inputModel.tlid) {
                this.tlUserService.tL_USER_Ins(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                    .subscribe((response) => {
                        if (response['Result'] != '0') {
                            this.showErrorMessage(response['ErrorDesc']);
                        }
                        else {
                            this.addNewSuccess();
                            if (!this.isApproveFunct) {
                                this.tlUserService.tL_USER_App(response['Id'], this.appSession.user.userName)
                                    .pipe(finalize(() => { this.saving = false; }))
                                    .subscribe((response) => {
                                        if (response['Result'] != '0') {
                                            this.showErrorMessage(response['ErrorDesc']);
                                        }
                                    });
                            }
                        }
                    });
            }
            else {
                this.tlUserService.tL_USER_Upd(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                    .subscribe((response) => {
                        if (response['Result'] != '0') {
                            this.showErrorMessage(response['ErrorDesc']);
                        }
                        else {
                            this.updateSuccess();
                            if (!this.isApproveFunct) {
                                this.tlUserService.tL_USER_App(this.inputModel.tlid, this.appSession.user.userName)
                                    .pipe(finalize(() => { this.saving = false; }))
                                    .subscribe((response) => {
                                        if (response['Result'] != '0') {
                                            this.showErrorMessage(response['ErrorDesc']);
                                        }
                                        else {
                                            this.inputModel.autH_STATUS = AuthStatusConsts.Approve;
                                            this.appToolbar.setButtonApproveEnable(false);
                                            this.updateView();
                                        }
                                    });
                            }
                            else {
                                this.inputModel.autH_STATUS = AuthStatusConsts.NotApprove;
                                this.updateView();
                            }
                        }
                    });
            }
        }
    }

    goBack() {
        this.navigatePassParam('/app/admin/tluser', null, undefined);
    }

    onAdd(): void {
    }

    onUpdate(item: TL_USER_ENTITY): void {
    }

    onDelete(item: TL_USER_ENTITY): void {
    }

    onApprove(item: TL_USER_ENTITY): void {
        if (!this.inputModel.tlid) {
            return;
        }
        var currentUserName = this.appSession.user.userName;
        if (currentUserName == this.inputModel.makeR_ID) {
            this.showErrorMessage(this.l('ApproveFailed'));
            return;
        }
        this.message.confirm(
            this.l('ApproveWarningMessage', this.l(this.inputModel.tlFullName)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.tlUserService.tL_USER_App(this.inputModel.tlid, currentUserName)
                        .pipe(finalize(() => { this.saving = false; }))
                        .subscribe((response) => {
                            if (response['Result'] != '0') {
                                this.showErrorMessage(response['ErrorDesc']);
                            }
                            else {
                                this.approveSuccess();
                            }
                        });
                }
            }
        );
    }

    onViewDetail(item: TL_USER_ENTITY): void {
    }

    onSave(): void {
        this.saveInput();
    }

    onSearch(): void {
    }

    onResetSearch(): void {
    }
}
