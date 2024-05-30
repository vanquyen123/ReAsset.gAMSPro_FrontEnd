import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes, ReaAllCode } from '@app/ultilities/enum/all-codes';
import { AllCodeServiceProxy, BranchServiceProxy, CM_BRANCH_ENTITY, CM_SUBSIDIARY_COMPANY_ENTITY, ComboboxServiceProxy, REA_SHAREHOLDER_ENTITY, ShareholderServiceProxy, SubsidiaryCompanyServiceProxy, UltilityServiceProxy } from '@shared/service-proxies/service-proxies';
import { IUiAction } from '@app/ultilities/ui-action';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { catchError, finalize } from 'rxjs/operators';
import { EmployeeField, InvestorField, OutsideShareholderField } from '@app/admin/core/ultils/consts/ComboboxConsts';
import { throwError } from 'rxjs';
import * as moment from 'moment';

@Component({
  templateUrl: './shareholder-edit.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class ShareholderEditComponent extends DefaultComponentBase implements OnInit, IUiAction<REA_SHAREHOLDER_ENTITY>, AfterViewInit {

  constructor(
    injector: Injector,
    private ultilityService: UltilityServiceProxy,
    private subsidiaryCompanyService: SubsidiaryCompanyServiceProxy,
    private shareholderService: ShareholderServiceProxy,
    private allcodeService: AllCodeServiceProxy,
    private _comboboxService: ComboboxServiceProxy,
) { 
    super(injector);
    this.editPageState = this.getRouteData('editPageState');
    this.shareholder_ID = this.getRouteParam('shareholder');
    this.company_ID = this.getRouteParam('company');
    this.inputModel.id = this.shareholder_ID;
    this.initFilter();
    this.initCombobox();
    this.initIsApproveFunct();
  }
  
  @ViewChild('editForm') editForm: ElementRef;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: REA_SHAREHOLDER_ENTITY = new REA_SHAREHOLDER_ENTITY();
    filterInput: REA_SHAREHOLDER_ENTITY;
    isApproveFunct: boolean;
    shareholder_ID: string;
    company_ID: string;
    company: CM_SUBSIDIARY_COMPANY_ENTITY = new CM_SUBSIDIARY_COMPANY_ENTITY();
    checkIsActive = false;
    employeeList;
    companyList;
    outsideShareholderList;

    shareholderType;

  get disableInput(): boolean {
    return this.editPageState == EditPageState.viewDetail;
  }
  isShowError = false;
  branchs: CM_BRANCH_ENTITY[];

  ngOnInit() {
    this.getInputField()
    this.getAllTypes()
    switch (this.editPageState) {
      case EditPageState.add:
          this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
          this.appToolbar.setRole('Shareholder', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getInitInformation();
          break;
      case EditPageState.edit:
          this.appToolbar.setRole('Shareholder', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getInitInformation();
          this.getShareholder();
          this.inputModel.modifieR_ID = this.appSession.user.userName
          this.inputModel.modifieR_NAME = this.appSession.user.name
          this.inputModel.modifY_DT = moment()
          break;
      case EditPageState.viewDetail:
          this.appToolbar.setRole('Shareholder', false, false, false, false, false, false, true, false);
          this.appToolbar.setEnableForViewDetailPage();
          this.getInitInformation();
          this.getShareholder();
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

  getInitInformation() {
    this.inputModel.subsidiarY_COMPANY_ID = this.company_ID;
    this.subsidiaryCompanyService.cM_SUBSIDIARY_COMPANY_ById(this.company_ID).subscribe(response=>{
        this.company = response
        this.updateView();
    })
    this.inputModel.shareholdeR_TYPE = 'CN'
    this.updateView();
  }

  getShareholder() {
      this.shareholderService.rEA_SHAREHOLDER_ById(this.inputModel.id).subscribe(response => {
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

  getAllTypes() {
    this.allcodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.SHAREHOLDER_TYPE, "")
    .subscribe(response =>{
        this.shareholderType = response
        this.updateView()
    })
  }

  getInputField() {
    this._comboboxService.getComboboxData(EmployeeField.class, EmployeeField.attribute).subscribe(response=>{
        this.employeeList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(InvestorField.class, InvestorField.attribute).subscribe(response=>{
        this.companyList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(OutsideShareholderField.class, OutsideShareholderField.attribute).subscribe(response=>{
        this.outsideShareholderList = response
        this.updateView()
    })
  }

  onCheckActive() {
    if(!this.checkIsActive) {
        this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
    }
    else {
        this.inputModel.recorD_STATUS = RecordStatusConsts.InActive;
    }
    console.log(this.inputModel.recorD_STATUS)
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
        if (!this.shareholder_ID) {
            this.inputModel.makeR_ID = this.appSession.user.userName;
            this.shareholderService.rEA_SHAREHOLDER_Ins(this.inputModel).pipe(
                      catchError(e=>{
                        this.showErrorMessage("Lỗi");
                        return throwError("Lỗi")
                      }),
                      finalize(() => { this.saving = false; })
                    )
                .subscribe((response) => {
                    this.addNewSuccess();
                });
        }
        else {
            this.shareholderService.rEA_SHAREHOLDER_Upd(this.inputModel).pipe(
                      catchError(e=>{
                        this.showErrorMessage("Lỗi");
                        return throwError("Lỗi")
                      }),
                      finalize(() => { this.saving = false; })
                    )
                .subscribe((response) => {
                    this.updateSuccess();
                    this.inputModel.autH_STATUS = AuthStatusConsts.NotApprove;
                    this.updateView();
                });
        }
    }
  }

  goBack() {
      this.navigatePassParam('/app/admin/subsidiary-company-view', { company: this.company_ID }, undefined);
  }

  onAdd(): void {
  }

  onUpdate(item: REA_SHAREHOLDER_ENTITY): void {
  }

  onDelete(item: REA_SHAREHOLDER_ENTITY): void {
  }

  onApprove(item: REA_SHAREHOLDER_ENTITY): void {
    if (!this.inputModel.id) {
        return;
    }
    var currentUserName = this.appSession.user.userName;
    if (currentUserName == this.inputModel.makeR_ID) {
      this.showErrorMessage(this.l('ApproveFailed'));
      return;
  }
    this.message.confirm(
        this.l('ApproveWarningMessage', this.l(this.inputModel.id)),
        this.l('AreYouSure'),
        (isConfirmed) => {
            if (isConfirmed) {
                this.saving = true;
                this.shareholderService.rEA_SHAREHOLDER_App(this.inputModel.id, currentUserName)
                    .pipe(
                      catchError(e=>{
                        this.showErrorMessage("Lỗi");
                        return throwError("Lỗi")
                      }),
                      finalize(() => { this.saving = false; })
                    )
                    .subscribe((response) => {
                        this.approveSuccess();
                    });
            }
        }
    );
  }

  onSelect(value: string){
      // this.inputModel.brancH_ID = branch.brancH_ID;
      // this.inputModel.brancH_NAME = branch.brancH_NAME;
      // setTimeout(()=>{
      //     this.updateView();
      // })
  }

  onViewDetail(item: REA_SHAREHOLDER_ENTITY): void {
  }

  onSave(): void {
      this.saveInput();
  }

  onSearch(): void {
  }

  onResetSearch(): void {
  }

  onSelectType(value) {
    this.updateView()
  }

  onSelectName(value) {
    if(value) {
      this.inputModel.shareholdeR_NAME = value.name;
    }
    this.updateView()
  }

}
