import { Component, Injector, ViewChild, Output, EventEmitter, OnInit, ViewEncapsulation, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { RegionServiceProxy, CM_REGION_ENTITY, RoleServiceProxy, AppPermissionServiceProxy, UltilityServiceProxy, CM_MANAGER_REGION_ENTITY, SecurInfoServiceProxy, AsposeServiceProxy, SysParametersServiceProxy, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { IUiAction } from '@app/ultilities/ui-action';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { TL_USER_ENTITY } from '../../../../shared/service-proxies/service-proxies';
import { EditableTableComponent } from '../../core/controls/editable-table/editable-table.component';
import { PreviewTemplateService } from '../preview-template/preview-template.service';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { NgForm } from '@angular/forms';

@Component({
    templateUrl: './region-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionEditComponent extends DefaultComponentBase implements OnInit, IUiAction<CM_REGION_ENTITY>, AfterViewInit {
    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private regionService: RegionServiceProxy,

        private securInfoService: SecurInfoServiceProxy,
        private previewTemplateService: PreviewTemplateService,
        private asposeService: AsposeServiceProxy,
        private fileDownloadService: FileDownloadService,
        private sysParametersService: SysParametersServiceProxy,
        private profileServiceProxy: ProfileServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.regioN_ID = this.getRouteParam('region');
        this.initFilter();
        this.initIsApproveFunct();
    }
    @ViewChild('editForm') editForm: ElementRef;
    @ViewChild("ngFormAssUse") ngFormAssUse: NgForm;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: CM_REGION_ENTITY = new CM_REGION_ENTITY();
    filterInput: CM_REGION_ENTITY;
    isApproveFunct: boolean;


    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail || this.inputModel.autH_STATUS == AuthStatusConsts.Approve;
    }

    isShowError = false;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.appToolbar.setRole('Region', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('Region', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getRegion();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('Region', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getRegion();
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

    getRegion() {
        this.regionService.cM_REGION_ById(this.inputModel.regioN_ID).subscribe(response => {
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
            if (!this.inputModel.regioN_ID) {
                this.regionService.cM_REGION_Ins(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                    .subscribe((response) => {
                        if (response.result != '0') {
                            this.showErrorMessage(response.errorDesc);
                        }
                        else {
                            this.addNewSuccess();
                            if (!this.isApproveFunct) {
                                this.regionService.cM_REGION_App(response.id, this.appSession.user.userName)
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
                this.regionService.cM_REGION_Upd(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                    .subscribe((response) => {
                        if (response.result != '0') {
                            this.showErrorMessage(response.errorDesc);
                        }
                        else {
                            this.updateSuccess();
                            if (!this.isApproveFunct) {
                                this.regionService.cM_REGION_App(this.inputModel.regioN_ID, this.appSession.user.userName)
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
        this.navigatePassParam('/app/admin/region', null, undefined);
    }

    onAdd(): void {
    }

    onUpdate(item: CM_REGION_ENTITY): void {
    }

    onDelete(item: CM_REGION_ENTITY): void {
    }

    onApprove(item: CM_REGION_ENTITY): void {
        if (!this.inputModel.regioN_ID) {
            return;
        }
        var currentUserName = this.appSession.user.userName;
        if (currentUserName == this.inputModel.makeR_ID) {
            this.showErrorMessage(this.l('ApproveFailed'));
            return;
        }
        this.message.confirm(
            this.l('ApproveWarningMessage', this.l(this.inputModel.regioN_NAME)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.regionService.cM_REGION_App(this.inputModel.regioN_ID, currentUserName)
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

    onViewDetail(item: CM_REGION_ENTITY): void {
    }

    onSave(): void {
        this.saveInput();
    }

    onSearch(): void {
    }

    onResetSearch(): void {
    }

}
