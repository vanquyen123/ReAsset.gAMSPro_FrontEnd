import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { AuthorizedPersonServiceProxy, BranchServiceProxy, CM_BRANCH_ENTITY, REA_AUTHORIZED_PERSON_ENTITY, UltilityServiceProxy, EmployeeServiceProxy, CM_EMPLOYEE_ENTITY } from '@shared/service-proxies/service-proxies';
import { IUiAction } from '@app/ultilities/ui-action';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { finalize } from 'rxjs/operators';

@Component({
  // selector: 'app-outside-shareholder-edit',
  templateUrl: './authorized-person-edit.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class AuthorizedPersonEditComponent extends DefaultComponentBase implements OnInit, IUiAction<REA_AUTHORIZED_PERSON_ENTITY>, AfterViewInit {

  constructor(
    injector: Injector,
    private ultilityService: UltilityServiceProxy,
    private authorizedPersonService: AuthorizedPersonServiceProxy,
    private employeeServiceProxy: EmployeeServiceProxy,
    ) { 
    super(injector);
    this.editPageState = this.getRouteData('editPageState');
    this.a_person_ID = this.getRouteParam('a_person');
    this.inputModel.a_PERSON_ID = this.a_person_ID;
    this.initFilter();
    this.initCombobox();
    this.initIsApproveFunct();
  }
  
  @ViewChild('editForm') editForm: ElementRef;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: REA_AUTHORIZED_PERSON_ENTITY = new REA_AUTHORIZED_PERSON_ENTITY();
    filterInput: REA_AUTHORIZED_PERSON_ENTITY;
    isApproveFunct: boolean;
    a_person_ID: string;
    checkIsActive = false;
    employees: CM_EMPLOYEE_ENTITY[];

  get disableInput(): boolean {
    return this.editPageState == EditPageState.viewDetail;
  }
  isShowError = false;
  branchs: CM_BRANCH_ENTITY[];

  ngOnInit() {
    switch (this.editPageState) {
      case EditPageState.add:
          this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
          this.appToolbar.setRole('AuthorizedPeople', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getNextId();
          break;
      case EditPageState.edit:
          this.appToolbar.setRole('AuthorizedPeople', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getAuthorizedPerson();
          break;
      case EditPageState.viewDetail:
          this.appToolbar.setRole('AuthorizedPeople', false, false, false, false, false, false, true, false);
          this.appToolbar.setEnableForViewDetailPage();
          this.getAuthorizedPerson();
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
      this.employeeServiceProxy.cM_EMPLOYEE_Search(this.getFillterForCombobox()).subscribe(response=> {
        this.employees = response.items;
        this.updateView();
    })
  }

  getNextId() {
    this.authorizedPersonService.rEA_AUTHORIZED_PEOPLE_Get_Id().subscribe(response=> {
        this.inputModel.a_PERSON_ID = response.A_PERSON_NEXT_ID;
        this.updateView();
    });
  }

  getAuthorizedPerson() {
      this.authorizedPersonService.rEA_AUTHORIZED_PEOPLE_ById(this.inputModel.a_PERSON_ID).subscribe(response => {
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
//   getEmployeeList() {
//     this.employeeServiceProxy.cM_EMPLOYEE_Search(this.getFillterForCombobox()).subscribe(response=> {
//         this.employees = response.items;
//         this.updateView();
//         console.log(this.employees)
//     })
//   }

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
          if (!this.a_person_ID) {
              this.authorizedPersonService.rEA_AUTHORIZED_PEOPLE_Ins(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.addNewSuccess();
                          if (!this.isApproveFunct) {
                              this.authorizedPersonService.rEA_AUTHORIZED_PEOPLE_App(response.id, this.appSession.user.userName)
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
              this.authorizedPersonService.rEA_AUTHORIZED_PEOPLE_Upd(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.updateSuccess();
                          if (!this.isApproveFunct) {
                              this.authorizedPersonService.rEA_AUTHORIZED_PEOPLE_App(this.inputModel.a_PERSON_ID, this.appSession.user.userName)
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
      this.navigatePassParam('/app/admin/authorized-people', null, undefined);
  }

  onAdd(): void {
  }

  onUpdate(item: REA_AUTHORIZED_PERSON_ENTITY): void {
  }

  onDelete(item: REA_AUTHORIZED_PERSON_ENTITY): void {
  }

  onApprove(item: REA_AUTHORIZED_PERSON_ENTITY): void {
      if (!this.inputModel.a_PERSON_ID) {
          return;
      }
      var currentUserName = this.appSession.user.userName;
      if (currentUserName == this.inputModel.makeR_ID) {
        this.showErrorMessage(this.l('ApproveFailed'));
        return;
    }
      this.message.confirm(
          this.l('ApproveWarningMessage', this.l(this.inputModel.a_PERSON_NAME)),
          this.l('AreYouSure'),
          (isConfirmed) => {
              if (isConfirmed) {
                  this.saving = true;
                  this.authorizedPersonService.rEA_AUTHORIZED_PEOPLE_App(this.inputModel.a_PERSON_ID, currentUserName)
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

  onSelectEmployee(employee : CM_EMPLOYEE_ENTITY){
      // this.inputModel.brancH_ID = branch.brancH_ID;
      // this.inputModel.brancH_NAME = branch.brancH_NAME;
      // setTimeout(()=>{
      //     this.updateView();
      // })
      this.inputModel.a_PERSON_NAME = employee.emP_NAME
  }

  onViewDetail(item: REA_AUTHORIZED_PERSON_ENTITY): void {
  }

  onSave(): void {
      this.saveInput();
  }

  onSearch(): void {
  }

  onResetSearch(): void {
  }

  subscriptionEndDateChange(e): void {
    }
  
}
