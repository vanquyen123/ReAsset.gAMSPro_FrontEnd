import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { BranchServiceProxy, CM_BRANCH_ENTITY, OutsideShareholderServiceProxy, REA_OUTSIDE_SHAREHOLDER_ENTITY, UltilityServiceProxy } from '@shared/service-proxies/service-proxies';
import { IUiAction } from '@app/ultilities/ui-action';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { finalize } from 'rxjs/operators';

@Component({
  // selector: 'app-outside-shareholder-edit',
  templateUrl: './outside-shareholder-edit.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class OutsideShareholderEditComponent extends DefaultComponentBase implements OnInit, IUiAction<REA_OUTSIDE_SHAREHOLDER_ENTITY>, AfterViewInit {

  constructor(
    injector: Injector,
    private ultilityService: UltilityServiceProxy,
    private outsideShareholderService: OutsideShareholderServiceProxy,
    private branchService: BranchServiceProxy,
    ) { 
    super(injector);
    this.editPageState = this.getRouteData('editPageState');
    this.osh_ID = this.getRouteParam('osh');
    this.inputModel.o_SHAREHOLDER_ID = this.osh_ID;
    this.initFilter();
    this.initCombobox();
    this.initIsApproveFunct();
  }
  
  @ViewChild('editForm') editForm: ElementRef;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: REA_OUTSIDE_SHAREHOLDER_ENTITY = new REA_OUTSIDE_SHAREHOLDER_ENTITY();
    filterInput: REA_OUTSIDE_SHAREHOLDER_ENTITY;
    isApproveFunct: boolean;
    osh_ID: string;
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

  getNextId() {
    this.outsideShareholderService.rEA_OUTSIDE_SHAREHOLDER_Get_Id().subscribe(response=> {
        this.inputModel.o_SHAREHOLDER_ID = response.O_SHAREHOLDER_NEXT_ID;
        this.updateView();
    });
  }

  getOutsideShareholder() {
      this.outsideShareholderService.rEA_OUTSIDE_SHAREHOLDER_ById(this.inputModel.o_SHAREHOLDER_ID).subscribe(response => {
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
          console.log(this.inputModel.o_SHAREHOLDER_ID)
          if (!this.osh_ID) {
              this.outsideShareholderService.rEA_OUTSIDE_SHAREHOLDER_Ins(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.addNewSuccess();
                          if (!this.isApproveFunct) {
                              this.outsideShareholderService.rEA_OUTSIDE_SHAREHOLDER_App(response.id, this.appSession.user.userName)
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
              this.outsideShareholderService.rEA_OUTSIDE_SHAREHOLDER_Upd(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.updateSuccess();
                          if (!this.isApproveFunct) {
                              this.outsideShareholderService.rEA_OUTSIDE_SHAREHOLDER_App(this.inputModel.o_SHAREHOLDER_ID, this.appSession.user.userName)
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
      this.navigatePassParam('/app/admin/outside-shareholder', null, undefined);
  }

  onAdd(): void {
  }

  onUpdate(item: REA_OUTSIDE_SHAREHOLDER_ENTITY): void {
  }

  onDelete(item: REA_OUTSIDE_SHAREHOLDER_ENTITY): void {
  }

  onApprove(item: REA_OUTSIDE_SHAREHOLDER_ENTITY): void {
      if (!this.inputModel.o_SHAREHOLDER_ID) {
          return;
      }
      var currentUserName = this.appSession.user.userName;
      if (currentUserName == this.inputModel.makeR_ID) {
        this.showErrorMessage(this.l('ApproveFailed'));
        return;
    }
      this.message.confirm(
          this.l('ApproveWarningMessage', this.l(this.inputModel.o_SHAREHOLDER_NAME)),
          this.l('AreYouSure'),
          (isConfirmed) => {
              if (isConfirmed) {
                  this.saving = true;
                  this.outsideShareholderService.rEA_OUTSIDE_SHAREHOLDER_App(this.inputModel.o_SHAREHOLDER_ID, currentUserName)
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

  onViewDetail(item: REA_OUTSIDE_SHAREHOLDER_ENTITY): void {
  }

  onSave(): void {
      this.saveInput();
  }

  onSearch(): void {
  }

  onResetSearch(): void {
  }

}
