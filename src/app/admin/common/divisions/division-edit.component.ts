import { Component, Injector, ViewChild, Output, EventEmitter, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { DivisionServiceProxy, CM_DIVISION_ENTITY, CM_BRANCH_ENTITY, BranchServiceProxy, UltilityServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { IUiAction } from '@app/ultilities/ui-action';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';

@Component({
    templateUrl: './division-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DivisionEditComponent extends DefaultComponentBase implements OnInit, IUiAction<CM_DIVISION_ENTITY>, AfterViewInit {
    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private branchService: BranchServiceProxy,
        private divisionService: DivisionServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.diV_ID = this.getRouteParam('id');
        this.initFilter();
        this.initIsApproveFunct();
        this.initComboboxs();
        // console.log(this);
    }

    @ViewChild('editForm') editForm: ElementRef;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: CM_DIVISION_ENTITY = new CM_DIVISION_ENTITY();
    filterInput: CM_DIVISION_ENTITY;
    isApproveFunct: boolean;

    branchs: CM_BRANCH_ENTITY[];


    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail;
    }

    isShowError = false;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.appToolbar.setRole('Division', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('Division', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getDivision();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('Division', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getDivision();
                break;
        }

        this.appToolbar.setUiAction(this);


    }

    ngAfterViewInit(): void {
        // COMMENT: this.stopAutoUpdateView();
        this.setupValidationMessage();
    }

    initComboboxs() {
        this.branchService.cM_BRANCH_Search(this.getFillterForCombobox()).subscribe(response => {
            this.branchs = response.items;
            this.updateView();
        })
    }

    initIsApproveFunct() {
        this.ultilityService.isApproveFunct(this.getCurrentFunctionId()).subscribe(isApproveFunct => {
            this.isApproveFunct = isApproveFunct;
        })
    }

    onSelectBranch(branch: CM_BRANCH_ENTITY) {
        if (branch) {
            this.inputModel.brancH_NAME = branch.brancH_NAME;
            this.inputModel.brancH_ID = branch.brancH_ID;
            this.inputModel.brancH_CODE = branch.brancH_CODE;
            setTimeout(() => {
                this.updateView();
            })
        }
    }

    getDivision() {
        this.divisionService.cM_DIVISION_ById(this.inputModel.diV_ID).subscribe(response => {
            this.inputModel = response;
            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
            }
            this.updateView();
        });
    }

    onBranchFocusOut(id) {
        if (!id) {
            this.inputModel.brancH_ID = undefined;
            this.inputModel.brancH_CODE = undefined;
            this.inputModel.brancH_NAME = undefined;
            setTimeout(() => {
                this.updateView();
            })
        }
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
            if (!this.inputModel.diV_ID) {
                this.divisionService.cM_DIVISION_Ins(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                    .subscribe((response) => {
                        if (response['Result'] != '0') {
                            this.showErrorMessage(response['ErrorDesc']);
                        }
                        else {
                            this.inputModel.diV_ID = response['ID'];
                            this.getDivision();
                            this.addNewSuccess();
                            if (!this.isApproveFunct) {
                                this.divisionService.cM_DIVISION_App(response['ID'], this.appSession.user.userName)
                                    .pipe(finalize(() => { this.saving = false; }))
                                    .subscribe((response) => {
                                        if (response.result != '0') {
                                            this.showErrorMessage(response.errorDesc);
                                        }
                                    });
                                this.updateView();
                            }
                        }
                        this.updateView();
                    });
            }
            else {
                this.divisionService.cM_DIVISION_Upd(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                    .subscribe((response) => {
                        if (response['Result'] != '0') {
                            this.showErrorMessage(response['ErrorDesc']);
                        }
                        else {
                            this.updateSuccess();
                            if (!this.isApproveFunct) {
                                this.divisionService.cM_DIVISION_App(this.inputModel.diV_ID, this.appSession.user.userName)
                                    .pipe(finalize(() => { this.saving = false; }))
                                    .subscribe((response) => {
                                        if (response.result != '0') {
                                            this.showErrorMessage(response.errorDesc);
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
        this.navigatePassParam('/app/admin/division', null, undefined);
    }

    onAdd(): void {
    }
    onUpdate(item: CM_DIVISION_ENTITY): void {
    }
    onDelete(item: CM_DIVISION_ENTITY): void {
    }
    onApprove(item: CM_DIVISION_ENTITY): void {
        if (!this.inputModel.diV_ID) {
            return;
        }
        var currentUserName = this.appSession.user.userName;
        if (currentUserName == this.inputModel.makeR_ID) {
            this.showErrorMessage(this.l('ApproveFailed'));
            return;
        }
        this.message.confirm(
            this.l('ApproveWarningMessage', this.l(this.inputModel.diV_NAME)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.divisionService.cM_DIVISION_App(this.inputModel.diV_ID, currentUserName)
                        .pipe(finalize(() => { this.saving = false; }))
                        .subscribe((response) => {
                            if (response.result != '0') {
                                this.showErrorMessage(response.errorDesc);
                            }
                            else {
                                this.approveSuccess();
                            }
                        });
                }
            }
        );
    }

    onViewDetail(item: CM_DIVISION_ENTITY): void {
    }

    onSave(): void {
        this.saveInput();
    }

    onSearch(): void {
    }

    onResetSearch(): void {
    }

}
