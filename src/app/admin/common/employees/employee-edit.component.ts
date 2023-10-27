import { Component, Injector, ViewChild, Output, EventEmitter, OnInit, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { EmployeeServiceProxy, CM_EMPLOYEE_ENTITY, CM_BRANCH_ENTITY, CM_DEPARTMENT_ENTITY, DepartmentServiceProxy, BranchServiceProxy, UltilityServiceProxy } from '@shared/service-proxies/service-proxies';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { finalize } from 'rxjs/operators';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { IUiAction } from '@app/ultilities/ui-action';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { DepartmentModalComponent } from '@app/admin/core/controls/dep-modal/department-modal.component';

@Component({
    templateUrl: './employee-edit.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class EmployeeEditComponent extends DefaultComponentBase implements OnInit, IUiAction<CM_EMPLOYEE_ENTITY>, AfterViewInit {

    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private departmentService: DepartmentServiceProxy,
        private branchService: BranchServiceProxy,
        private employeeService: EmployeeServiceProxy
    ) {
        super(injector);
        this.editPageState = this.getRouteData('editPageState');
        this.inputModel.emP_ID = this.getRouteParam('id');
        this.initFilter();
        this.initIsApproveFunct();
        this.inputModel.brancH_ID = this.appSession.user.subbrId;
        this.inputModel.brancH_TYPE = this.appSession.user.branch.brancH_TYPE;
    }

    @ViewChild('editForm') editForm: ElementRef;
    @ViewChild('depModal') depModal: DepartmentModalComponent;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    branchs: CM_BRANCH_ENTITY[];

    inputModel: CM_EMPLOYEE_ENTITY = new CM_EMPLOYEE_ENTITY();
    filterInput: CM_EMPLOYEE_ENTITY;
    isApproveFunct: boolean;

    branchType : string;


    get disableInput(): boolean {
        return this.editPageState == EditPageState.viewDetail;
    }

    isShowError = false;

    ngOnInit(): void {
        switch (this.editPageState) {
            case EditPageState.add:
                this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
                this.appToolbar.setRole('Employee', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                break;
            case EditPageState.edit:
                this.appToolbar.setRole('Employee', false, false, true, false, false, false, false, false);
                this.appToolbar.setEnableForEditPage();
                this.getEmployee();
                break;
            case EditPageState.viewDetail:
                this.appToolbar.setRole('Employee', false, false, false, false, false, false, true, false);
                this.appToolbar.setEnableForViewDetailPage();
                this.getEmployee();
                break;
        }

        this.appToolbar.setUiAction(this);
        this.initComboboxs();
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

    initComboboxs() {
        var filterCombobox = this.getFillterForCombobox();
        this.branchService.cM_BRANCH_Search(filterCombobox).subscribe(response => {
            this.branchs = response.items;
            if(this.editPageState == EditPageState.add){
                let branch = this.branchs.firstOrDefault(undefined);
                this.inputModel.brancH_ID = branch.brancH_ID;
                this.branchType = branch.brancH_TYPE;
            }
            this.updateView();
        });
    }

    getEmployee() {
        this.employeeService.cM_EMPLOYEE_ById(this.inputModel.emP_ID).subscribe(response => {
            console.log(response.deP_NAME);
            this.inputModel = response;
            if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
                this.appToolbar.setButtonApproveEnable(false);
            }
            this.updateView();
        });
    }

    onChangeBranch(branch: CM_BRANCH_ENTITY) {
        this.inputModel.brancH_TYPE = branch.brancH_TYPE;
        if(branch.brancH_TYPE != 'HS'){
            this.inputModel.deP_ID = undefined;
            this.inputModel.deP_NAME = undefined;
        }
        if(branch){
            this.branchType = branch.brancH_TYPE;
        }
        else{
            this.branchType = this.appSession.user.branch.brancH_TYPE;
        }
        this.depModal.filterInput.brancH_ID = (branch || { branchID: this.appSession.user.subbrId } as any).brancH_ID;
        this.depModal.dataTable.records = [];
        this.depModal.updateView();
        this.updateView();
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
            if (!this.inputModel.emP_ID) {

                this.employeeService.cM_EMPLOYEE_Ins(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                    .subscribe((response) => {
                        if (response.result != '0') {
                            this.showErrorMessage(response.errorDesc);
                        }
                        else {
                            this.addNewSuccess();
                            if (!this.isApproveFunct) {
                                this.employeeService.cM_EMPLOYEE_App(response.id, this.appSession.user.userName)
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
                this.employeeService.cM_EMPLOYEE_Upd(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                    .subscribe((response) => {
                        if (response.result != '0') {
                            this.showErrorMessage(response.errorDesc);
                        }
                        else {
                            this.updateSuccess();
                            if (!this.isApproveFunct) {
                                this.employeeService.cM_EMPLOYEE_App(this.inputModel.emP_ID, this.appSession.user.userName)
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
        this.navigatePassParam('/app/admin/employee', null, undefined);
    }

    onAdd(): void {
    }

    onUpdate(item: CM_EMPLOYEE_ENTITY): void {
    }

    onDelete(item: CM_EMPLOYEE_ENTITY): void {
    }

    onApprove(item: CM_EMPLOYEE_ENTITY): void {
        if (!this.inputModel.emP_ID) {
            return;
        }
        var currentUserName = this.appSession.user.userName;
        if (currentUserName == this.inputModel.makeR_ID) {
            this.showErrorMessage(this.l('ApproveFailed'));
            return;
        }
        this.message.confirm(
            this.l('ApproveWarningMessage', this.l(this.inputModel.emP_NAME)),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.saving = true;
                    this.employeeService.cM_EMPLOYEE_App(this.inputModel.emP_ID, currentUserName)
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

    onSelectDepartment(dep: CM_DEPARTMENT_ENTITY) {
        this.inputModel.deP_ID = dep.deP_ID;
        this.inputModel.deP_NAME = dep.deP_NAME;
    }

    onViewDetail(item: CM_EMPLOYEE_ENTITY): void {
    }

    onSave(): void {
        this.saveInput();
    }

    onSearch(): void {
    }

    onResetSearch(): void {
    }
}
