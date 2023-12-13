import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { BranchServiceProxy, CM_ALLCODE_ENTITY, CM_BRANCH_ENTITY, OwnerServiceProxy, REA_OWNER_ENTITY, UltilityServiceProxy } from '@shared/service-proxies/service-proxies';
import { IUiAction } from '@app/ultilities/ui-action';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { finalize } from 'rxjs/operators';

@Component({
  templateUrl: './owner-edit.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class OwnerEditComponent extends DefaultComponentBase implements OnInit, IUiAction<REA_OWNER_ENTITY>, AfterViewInit {

  constructor(
    injector: Injector,
    private ultilityService: UltilityServiceProxy,
    private ownerService: OwnerServiceProxy,
    private branchService: BranchServiceProxy,
    ) { 
    super(injector);
    this.editPageState = this.getRouteData('editPageState');
    this.owner_ID = this.getRouteParam('owner');
    this.inputModel.owneR_ID = this.owner_ID;
    this.initFilter();
    this.initCombobox();
    this.initIsApproveFunct();
  }
  
  @ViewChild('editForm') editForm: ElementRef;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: REA_OWNER_ENTITY = new REA_OWNER_ENTITY();
    filterInput: REA_OWNER_ENTITY;
    isApproveFunct: boolean;
    owner_ID: string;
    checkIsActive = false;
    ownerTypes: CM_ALLCODE_ENTITY[];

  get disableInput(): boolean {
    return this.editPageState == EditPageState.viewDetail;
  }
  isShowError = false;
  branchs: CM_BRANCH_ENTITY[];

  ngOnInit() {
    this.ownerService.getOwnerTypeCodes().subscribe(response=> {
        this.ownerTypes = response;
        this.updateView();
    })
    switch (this.editPageState) {
      case EditPageState.add:
          this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
          this.appToolbar.setRole('Owner', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getNextId();
          break;
      case EditPageState.edit:
          this.appToolbar.setRole('Owner', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getOwner();
          break;
      case EditPageState.viewDetail:
          this.appToolbar.setRole('Owner', false, false, false, false, false, false, true, false);
          this.appToolbar.setEnableForViewDetailPage();
          this.getOwner();
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

  getNextId() {
    this.ownerService.rEA_OWNER_Get_Id().subscribe(response=> {
        this.inputModel.owneR_ID = response.OWNER_NEXT_ID;
        this.updateView();
    });
  }

  getOwner() {
      this.ownerService.rEA_OWNER_ById(this.inputModel.owneR_ID).subscribe(response => {
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
        this.inputModel.recorD_STATUS = "1";
    }
    else {
        this.inputModel.recorD_STATUS = "0";
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
          if (!this.owner_ID) {
              this.ownerService.rEA_OWNER_Ins(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.addNewSuccess();
                          if (!this.isApproveFunct) {
                              this.ownerService.rEA_OWNER_App(response.id, this.appSession.user.userName)
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
              this.ownerService.rEA_OWNER_Upd(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.updateSuccess();
                          if (!this.isApproveFunct) {
                              this.ownerService.rEA_OWNER_App(this.inputModel.owneR_ID, this.appSession.user.userName)
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
      this.navigatePassParam('/app/admin/owner', null, undefined);
  }

  onAdd(): void {
  }

  onUpdate(item: REA_OWNER_ENTITY): void {
  }

  onDelete(item: REA_OWNER_ENTITY): void {
  }

  onApprove(item: REA_OWNER_ENTITY): void {
      if (!this.inputModel.owneR_ID) {
          return;
      }
      var currentUserName = this.appSession.user.userName;
      if (currentUserName == this.inputModel.makeR_ID) {
        this.showErrorMessage(this.l('ApproveFailed'));
        return;
    }
      this.message.confirm(
          this.l('ApproveWarningMessage', this.l(this.inputModel.owneR_NAME)),
          this.l('AreYouSure'),
          (isConfirmed) => {
              if (isConfirmed) {
                  this.saving = true;
                  this.ownerService.rEA_OWNER_App(this.inputModel.owneR_ID, currentUserName)
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

  onSelectOwnerType(ownerType : CM_ALLCODE_ENTITY){
    // this.inputModel.owneR_TYPE_NAME = ownerType.content;
  }

  onViewDetail(item: REA_OWNER_ENTITY): void {
  }

  onSave(): void {
      this.saveInput();
  }

  onSearch(): void {
  }

  onResetSearch(): void {
  }

}
