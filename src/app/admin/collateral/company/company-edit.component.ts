import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { BranchServiceProxy, CM_BRANCH_ENTITY, UltilityServiceProxy, REA_SHAREHOLDER_ENTITY, SubsidiaryCompanyServiceProxy, CM_SUBSIDIARY_COMPANY_ENTITY, ShareholderServiceProxy, ComboboxServiceProxy } from '@shared/service-proxies/service-proxies';
import { IUiAction } from '@app/ultilities/ui-action';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { catchError, finalize } from 'rxjs/operators';
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { EditableTableComponent } from '@app/admin/core/controls/editable-table/editable-table.component';
import { throwError } from 'rxjs';
import { ProvinceField, RegionField } from '@app/admin/core/ultils/consts/ComboboxConsts';
import { base64ToBlob, saveFile } from '@app/ultilities/blob-exec';

@Component({
  // selector: 'app-outside-shareholder-edit',
  templateUrl: './company-edit.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class CompanyEditComponent extends DefaultComponentBase implements OnInit, IUiAction<CM_SUBSIDIARY_COMPANY_ENTITY>, AfterViewInit {

  constructor(
    injector: Injector,
    private ultilityService: UltilityServiceProxy,
    private subsidiaryCompanyService: SubsidiaryCompanyServiceProxy,
    private shareholderService: ShareholderServiceProxy,
    private _comboboxService: ComboboxServiceProxy,
    ) { 
    super(injector);
    this.editPageState = this.getRouteData('editPageState');
    this.company_ID = this.getRouteParam('company');
    this.inputModel.id = this.company_ID;
    this.initFilter();
    this.initCombobox();
    this.initIsApproveFunct();
  }
  
  @ViewChild('editForm') editForm: ElementRef;
  @ViewChild('shareEditTable') shareEditTable: EditableTableComponent<REA_SHAREHOLDER_ENTITY>;
  shareholderCheckList = [];

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: CM_SUBSIDIARY_COMPANY_ENTITY = new CM_SUBSIDIARY_COMPANY_ENTITY();
    filterInput: CM_SUBSIDIARY_COMPANY_ENTITY;
    isApproveFunct: boolean;
    company_ID: string;
    checkIsActive = false;

  get disableInput(): boolean {
    return this.editPageState == EditPageState.viewDetail;
  }
  isShowError = false;
  regionList;
  provinceList;

  ngOnInit() {
    this.getInputField();
    switch (this.editPageState) {
      case EditPageState.add:
          this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
          this.appToolbar.setRole('SubsidiaryCompany', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getInitInformation();
          break;
      case EditPageState.edit:
          this.appToolbar.setRole('SubsidiaryCompany', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getsubsidiaryCompany();
          break;
      case EditPageState.viewDetail:
          this.appToolbar.setRole('SubsidiaryCompany', false, false, false, false, false, false, true, false);
          this.appToolbar.setEnableForViewDetailPage();
          this.getsubsidiaryCompany();
          break;
    }
    this.appToolbar.setUiAction(this);
  }

  ngAfterViewInit(): void {
    // COMMENT: this.stopAutoUpdateView();
    this.setupValidationMessage();
  }

  exportToExcel() {
    this.shareholderService.getExcelShareholder(this.company_ID).subscribe(response=>{
      let base64String = response.fileContent;
      let blob = base64ToBlob(base64String, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      let name = "BC_CO_PHAN_CTY_" + this.company_ID + ".xlsx"
      saveFile(blob, name)
    });
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
  addNewShareholder(){
    this.navigatePassParam('/app/admin/shareholder-add', { company: this.company_ID }, undefined);
  }

  checkedShareholder(item, checked: boolean) {
    item.isChecked = checked;
    if(checked) {
      this.shareholderCheckList.push(item.id)
    }
    else {
      this.shareholderCheckList = this.shareholderCheckList.filter(e=>e != item.id)
    }
  }

  removeShareholder() {
    this.shareholderCheckList.forEach(e=> {
      this.shareholderService.rEA_SHAREHOLDER_Del(e).subscribe(response=>{
        this.showSuccessMessage(this.l('SuccessfullyDeleted'));
      });
    })

    this.shareholderCheckList = []
    this.shareEditTable.removeAllCheckedItem()
  }

  checkAllShareholder(checked: boolean) {
    this.shareholderCheckList = []
    if(checked) {
      this.shareEditTable.allData.forEach(e=>{
        this.shareholderCheckList.push(e.id)
      })
    }
    this.shareEditTable.checkAll(checked)
  }

  editShareholder(item) {
    this.navigatePassParam('/app/admin/shareholder-edit', { company: this.company_ID, shareholder: item.id }, undefined);
  }

  viewShareholder(item) {
    this.navigatePassParam('/app/admin/shareholder-view', { company: this.company_ID, shareholder: item.id }, undefined);
  }

  getInitInformation() {
    this.inputModel.subsidiarY_COMPANY_TYPE = 'CP';
  }

  getsubsidiaryCompany() {
      this.subsidiaryCompanyService.cM_SUBSIDIARY_COMPANY_ById(this.inputModel.id).subscribe(response => {
          this.inputModel = response;
          if(response.recorD_STATUS === "1") {
            this.checkIsActive = true;
          }
          if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve) {
              this.appToolbar.setButtonApproveEnable(false);
          }
          this.updateView();
      });
      this.shareholderService.rEA_SHAREHOLDER_Search(this.inputModel.id).subscribe(response=>{
        this.shareEditTable.setList(response.shareholdeR_LIST.items)
      })
  }

  getInputField() {
    this._comboboxService.getComboboxData(RegionField.class, RegionField.attribute).subscribe(response=>{
        this.regionList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(ProvinceField.class, ProvinceField.attribute).subscribe(response=>{
        this.provinceList = response
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
              this.subsidiaryCompanyService.cM_SUBSIDIARY_COMPANY_Ins(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.addNewSuccess();
                      }
                  });
          }
          else {
              this.subsidiaryCompanyService.cM_SUBSIDIARY_COMPANY_Upd(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.updateSuccess();
                          this.inputModel.autH_STATUS = AuthStatusConsts.NotApprove;
                          this.updateView();
                      }
                  });
          }
      }
  }

  goBack() {
      this.navigatePassParam('/app/admin/subsidiary-company', null, undefined);
  }

  onAdd(): void {
  }

  onUpdate(item: CM_SUBSIDIARY_COMPANY_ENTITY): void {
  }

  onDelete(item: CM_SUBSIDIARY_COMPANY_ENTITY): void {
  }

  onApprove(item: CM_SUBSIDIARY_COMPANY_ENTITY): void {
      if (!this.inputModel.id) {
          return;
      }
      var currentUserName = this.appSession.user.userName;
      if (currentUserName == this.inputModel.makeR_ID) {
        this.showErrorMessage(this.l('ApproveFailed'));
        return;
    }
      this.message.confirm(
          this.l('ApproveWarningMessage', this.l(this.inputModel.subsidiarY_NAME)),
          this.l('AreYouSure'),
          (isConfirmed) => {
              if (isConfirmed) {
                  this.saving = true;
                  this.subsidiaryCompanyService.cM_SUBSIDIARY_COMPANY_App(this.inputModel.id, currentUserName)
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

  onViewDetail(item: CM_SUBSIDIARY_COMPANY_ENTITY): void {
  }

  onSave(): void {
      this.saveInput();
  }

  onSearch(): void {
  }

  onResetSearch(): void {
  }

}
