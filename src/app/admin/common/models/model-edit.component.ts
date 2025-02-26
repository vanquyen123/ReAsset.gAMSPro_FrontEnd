import { Component, Injector, ViewChild, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { ModelServiceProxy, CM_MODEL_ENTITY, CM_CAR_TYPE_ENTITY, CarTypeServiceProxy, UltilityServiceProxy, CM_ALLCODE_ENTITY } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { IUiAction } from '@app/ultilities/ui-action';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';

@Component({
    templateUrl: './model-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ModelEditComponent extends DefaultComponentBase implements OnInit, IUiAction<CM_MODEL_ENTITY> {
    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private carTypeService: CarTypeServiceProxy,
        private modelService: ModelServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.mO_ID = this.getRouteParam('id');
        this.initFilter();
        this.initIsApproveFunct();
    }

    @ViewChild('editForm') editForm: ElementRef;

    carTypes: CM_CAR_TYPE_ENTITY[];
    filterInput: CM_MODEL_ENTITY;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: CM_MODEL_ENTITY = new CM_MODEL_ENTITY();
    isApproveFunct: boolean;


    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail;
    }

    isShowError = false;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.appToolbar.setRole('Model', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.inputModel.poweR_RATE = 0;
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('Model', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getModel();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('Model', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getModel();
                break;
        }

        this.appToolbar.setUiAction(this);
        this.initCombobox();
    }

    ngAfterViewInit(): void {
        this.updateView();
        this.setupValidationMessage();
    }

    initIsApproveFunct() {
        this.ultilityService.isApproveFunct(this.getCurrentFunctionId()).subscribe(isApproveFunct => {
            this.isApproveFunct = isApproveFunct;
        })
    }

    initCombobox() {
        this.carTypeService.cM_CAR_TYPE_Search(this.getFillterForCombobox()).subscribe(response => {
            this.carTypes = response.items;
            if(this.editPageState == EditPageState.add){
                this.inputModel.caR_TYPE_ID = response.items.firstOrDefault(x => x != undefined, {}).caR_TYPE_ID;
            }
            this.onChangeProperty('caR_TYPE_ID');
            this.updateView();
        });
    }

    onSetListAllCode(list : CM_ALLCODE_ENTITY[]){
        if(this.editPageState == EditPageState.add){
            this.inputModel.manufacturer = list.firstOrDefault(x => x != undefined, {}).cdval;
            this.onChangeProperty('manufacturer')
        }
    }

    getModel() {
        this.modelService.cM_MODEL_ById(this.inputModel.mO_ID).subscribe(response => {
            this.inputModel = response;
            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
            }
            this.updateView();
        });
    }

    private isValid() {
        let errorMessage = ''
        try {
            //valid here
            if (this.inputModel.poweR_RATE <= 0) {
                errorMessage = this.l('PowerRate') + ' ' + this.l("CannotLessThanZero").toLocaleLowerCase();
            }
        } catch{
            errorMessage = this.l('ValidException')
        }

        return errorMessage
    }

    saveInput() {
        if (this.isApproveFunct == undefined) {
            this.showErrorMessage(this.l('PageLoadUndone'));
            return;
        }

        if ((this.editForm as any).form.invalid || this.inputModel.poweR_RATE == 0) {
            this.isShowError = true;
            this.showErrorMessage(this.l('FormInvalid'));
            this.updateView();
            return;
        }

        let errorMessage = this.isValid();

        if (errorMessage) {
            this.isShowError = true;
            this.showErrorMessage(errorMessage);
            this.updateView();
            return;
        }


        if (this.editPageState != EditPageState.viewDetail) {
            this.saving = true;
            this.inputModel.makeR_ID = this.appSession.user.userName;
            if (!this.inputModel.mO_ID) {

                this.modelService.cM_MODEL_Ins(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                    .subscribe((response) => {
                        if (response.result != '0') {
                            this.showErrorMessage(response.errorDesc);
                        }
                        else {
                            this.addNewSuccess();
                            if (!this.isApproveFunct) {
                                this.modelService.cM_MODEL_App(response.id, this.appSession.user.userName)
                                    .pipe(finalize(() => { this.saving = false; }))
                                    .subscribe((response) => {
                                        if (response.result != '0') {
                                            this.showErrorMessage(response.errorDesc);
                                        }
                                    });
                            }
                        }
                    });
            }
            else {
                this.modelService.cM_MODEL_Upd(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                    .subscribe((response) => {
                        if (response.result != '0') {
                            this.showErrorMessage(response.errorDesc);
                        }
                        else {
                            this.updateSuccess();
                            if (!this.isApproveFunct) {
                                this.modelService.cM_MODEL_App(this.inputModel.mO_ID, this.appSession.user.userName)
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
        this.navigatePassParam('/app/admin/model', null, undefined);
    }

    onAdd(): void {
    }

    onUpdate(item: CM_MODEL_ENTITY): void {
    }

    onDelete(item: CM_MODEL_ENTITY): void {
    }

    onApprove(item: CM_MODEL_ENTITY): void {
        if (!this.inputModel.mO_ID) {
            return;
        }
        var currentUserName = this.appSession.user.userName;
        if (currentUserName == this.inputModel.makeR_ID) {
            this.showErrorMessage(this.l('ApproveFailed'));
            return;
        }
        this.message.confirm(
            this.l('ApproveWarningMessage', this.l(this.inputModel.mO_NAME)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.modelService.cM_MODEL_App(this.inputModel.mO_ID, currentUserName)
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

    onViewDetail(item: CM_MODEL_ENTITY): void {
    }

    onSave(): void {
        this.saveInput();
    }

    onSearch(): void {
    }

    onResetSearch(): void {
    }
}
