import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { BranchServiceProxy, CM_BRANCH_ENTITY, CM_COMPANY_ENTITY, UltilityServiceProxy, CompanyServiceProxy, REA_SHAREHOLDER_ENTITY } from '@shared/service-proxies/service-proxies';
import { IUiAction } from '@app/ultilities/ui-action';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { finalize } from 'rxjs/operators';
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { EditableTableComponent } from '@app/admin/core/controls/editable-table/editable-table.component';

@Component({
  // selector: 'app-outside-shareholder-edit',
  templateUrl: './company-edit.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class CompanyEditComponent extends DefaultComponentBase implements OnInit, IUiAction<CM_COMPANY_ENTITY>, AfterViewInit {

  constructor(
    injector: Injector,
    private ultilityService: UltilityServiceProxy,
    private companyService: CompanyServiceProxy,
    private branchService: BranchServiceProxy,
    ) { 
    super(injector);
    this.editPageState = this.getRouteData('editPageState');
    this.company_ID = this.getRouteParam('osh');
    this.inputModel.id = this.company_ID;
    this.initFilter();
    this.initCombobox();
    this.initIsApproveFunct();
  }
  
  @ViewChild('editForm') editForm: ElementRef;
  @ViewChild('shareEditTable') shareEditTable: EditableTableComponent<REA_SHAREHOLDER_ENTITY>;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: CM_COMPANY_ENTITY = new CM_COMPANY_ENTITY();
    filterInput: CM_COMPANY_ENTITY;
    isApproveFunct: boolean;
    company_ID: string;
    checkIsActive = false;

  get disableInput(): boolean {
    return this.editPageState == EditPageState.viewDetail;
  }
  isShowError = false;
  branchs: CM_BRANCH_ENTITY[];

  ngOnInit() {
    switch (this.editPageState) {
      case EditPageState.add:
          this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
          this.appToolbar.setRole('OutsideShareholder', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getNextId();
          break;
      case EditPageState.edit:
          this.appToolbar.setRole('OutsideShareholder', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getOutsideShareholder();
          break;
      case EditPageState.viewDetail:
          this.appToolbar.setRole('OutsideShareholder', false, false, false, false, false, false, true, false);
          this.appToolbar.setEnableForViewDetailPage();
          this.getOutsideShareholder();
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

  initCombobox() {
      // this.branchService.cM_BRANCH_Search(this.getFillterForCombobox()).subscribe(response => {
      //     this.branchs = response.items;
      //     this.updateView();
      // });
      // this.deptGroupService.cM_DEPT_GROUP_Search(this.getFillterForCombobox()).subscribe(response => {
      //     this.deptGroups = response.items;
      //     this.updateView();
      // });
  }
  addNewAsset(){
    this.navigatePassParam('/app/admin/shareholder-add', null, undefined);
  }

  getNextId() {
    
  }

  getOutsideShareholder() {
      this.companyService.cM_COMPANY_ById(this.inputModel.id).subscribe(response => {
          this.inputModel = response;
          if(response.recorD_STATUS === "1") {
            this.checkIsActive = true;
          }
          if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
              this.appToolbar.setButtonApproveEnable(false);
          }
          this.updateView();
      });
  }

  onCheckActive() {
    if(!this.checkIsActive) {
        this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
    }
    else {
        this.inputModel.recorD_STATUS = RecordStatusConsts.InActive;
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
          if (!this.company_ID) {
              this.companyService.cM_COMPANY_Ins(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.addNewSuccess();
                          if (!this.isApproveFunct) {
                              this.companyService.cM_COMPANY_App(response.id, this.appSession.user.userName)
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
              this.companyService.cM_COMPANY_Upd(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.updateSuccess();
                          if (!this.isApproveFunct) {
                              this.companyService.cM_COMPANY_App(this.inputModel.id, this.appSession.user.userName)
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
      this.navigatePassParam('/app/admin/company', null, undefined);
  }

  onAdd(): void {
  }

  onUpdate(item: CM_COMPANY_ENTITY): void {
  }

  onDelete(item: CM_COMPANY_ENTITY): void {
  }

  onApprove(item: CM_COMPANY_ENTITY): void {
      if (!this.inputModel.id) {
          return;
      }
      var currentUserName = this.appSession.user.userName;
      if (currentUserName == this.inputModel.makeR_ID) {
        this.showErrorMessage(this.l('ApproveFailed'));
        return;
    }
      this.message.confirm(
          this.l('ApproveWarningMessage', this.l(this.inputModel.companY_NAME)),
          this.l('AreYouSure'),
          (isConfirmed) => {
              if (isConfirmed) {
                  this.saving = true;
                  this.companyService.cM_COMPANY_App(this.inputModel.id, currentUserName)
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

  onSelectBranch(branch : CM_BRANCH_ENTITY){
      // this.inputModel.brancH_ID = branch.brancH_ID;
      // this.inputModel.brancH_NAME = branch.brancH_NAME;
      // setTimeout(()=>{
      //     this.updateView();
      // })
  }

  onViewDetail(item: CM_COMPANY_ENTITY): void {
  }

  onSave(): void {
      this.saveInput();
  }

  onSearch(): void {
  }

  onResetSearch(): void {
  }

}
