import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes, ReaAllCode } from '@app/ultilities/enum/all-codes';
import { UltilityServiceProxy, AllCodeServiceProxy, REA_INVESTMENT_PROPERTY_ENTITY, InvestmentPropertyServiceProxy, REA_FLOOR_MANAGEMENT_ENTITY, REA_PROPERTY_INFORMATION_ENTITY, CONTRACT_ITEM_ENTITY, REA_MORTGAGE_OVERALL, PropertyInformationServiceProxy, ComboboxServiceProxy, CONTRACT_ITEM_RENTAL_PRICE_ENTITY} from '@shared/service-proxies/service-proxies';
import { IUiAction } from '@app/ultilities/ui-action';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { catchError, finalize } from 'rxjs/operators';
import { EditableTableComponent } from '@app/admin/core/controls/editable-table/editable-table.component';
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { PartnerField, ProjectField } from '@app/admin/core/ultils/consts/ComboboxConsts';
import * as moment from 'moment';
import { throwError } from 'rxjs';
import { base64ToBlob, saveFile } from '@app/ultilities/blob-exec';

@Component({
  templateUrl: './investment-property-edit.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class InvestmentPropertyEditComponent extends DefaultComponentBase implements OnInit, IUiActionRejectExt<REA_INVESTMENT_PROPERTY_ENTITY>, AfterViewInit {

  constructor(
    injector: Injector,
    private ultilityService: UltilityServiceProxy,
    private investmentPropertyService: InvestmentPropertyServiceProxy,
    private allCodeService: AllCodeServiceProxy,
    private propertyInfoService: PropertyInformationServiceProxy,
    private _comboboxService: ComboboxServiceProxy,
    ) { 
    super(injector);
    this.editPageState = this.getRouteData('editPageState');
    this.invesT_PROP_ID = this.getRouteParam('investProp');
    this.inputModel.id = this.invesT_PROP_ID;
    this.initFilter();
    this.initCombobox();
    this.initIsApproveFunct();
  }
    
  
  @ViewChild('editForm') editForm: ElementRef;
  @ViewChild('floorEditTable') floorEditTable: EditableTableComponent<REA_FLOOR_MANAGEMENT_ENTITY>;
  @ViewChild('contractEditTable') contractEditTable: EditableTableComponent<CONTRACT_ITEM_ENTITY>;
  floorCheckList = []

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: REA_INVESTMENT_PROPERTY_ENTITY = new REA_INVESTMENT_PROPERTY_ENTITY();
    filterInput: REA_INVESTMENT_PROPERTY_ENTITY;
    isApproveFunct: boolean;
    invesT_PROP_ID: string;
    checkIsActive = false;
    
    propertyStatus
    legalStatus
    GCNStatus
    
    projectList
    partnerList

  get disableInput(): boolean {
    return this.editPageState == EditPageState.viewDetail;
  }
  isShowError = false;

  ngOnInit() {
    this.getInputField()
    this.getAllTypes()
    switch (this.editPageState) {
      case EditPageState.add:
          this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
          this.appToolbar.setRole('InvestmentProperty', false, false, true, false, false, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getInitInformation();
          break;
      case EditPageState.edit:
          this.appToolbar.setRole('InvestmentProperty', false, false, true, false, false, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getInitInformation();
          this.getInvestProp();
          break;
      case EditPageState.viewDetail:
          this.appToolbar.setRole('InvestmentProperty', false, false, false, false, false, false, true, false, true, true);
          this.appToolbar.setEnableForViewDetailPage();
          this.getInitInformation();
          this.getInvestProp();
          break;
    }
    this.appToolbar.setUiAction(this);
  }

  ngAfterViewInit(): void {
    // COMMENT: this.stopAutoUpdateView();
    this.setupValidationMessage();
  }

  exportToExcel() {
    this.investmentPropertyService.getExcelInvestmentPropertyById(this.invesT_PROP_ID).subscribe(response=>{
      let base64String = response.fileContent;
      let blob = base64ToBlob(base64String, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      let name = response.fileName
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

  getInitInformation() {
    this.inputModel.propertY_INFORMATION = new REA_PROPERTY_INFORMATION_ENTITY()
    this.inputModel.makeR_ID = this.appSession.user.userName
    this.inputModel.makeR_NAME = this.appSession.user.name
    this.inputModel.creatE_DT = moment()
    this.updateView();
  }

  getInvestProp() {
      this.investmentPropertyService.rEA_INVESTMENT_PROPERTY_ById(this.inputModel.id).subscribe(response => {
          this.inputModel = response;
          this.inputModel.propertY_INFORMATION = new REA_PROPERTY_INFORMATION_ENTITY(response.propertY_INFORMATION)
          if(response.flooR_LIST != null) {
            response.flooR_LIST.forEach(e=>{
              e.iS_CHANGED = true;
              e.iS_NEW = false;
              this.floorEditTable.pushItem(e);
            })
          }
          if(response.contracT_ITEM_LIST != null) {
            response.contracT_ITEM_LIST.forEach(e=>{
              e.contracT_ITEM_RENTAL_PRICE = new CONTRACT_ITEM_RENTAL_PRICE_ENTITY(e.contracT_ITEM_RENTAL_PRICE)
              this.contractEditTable.pushItem(e);
            })
          }

          this.inputModel.flooR_LIST = []
          this.inputModel.deleteD_FLOOR_ID_LIST = []
          
          if(response.recorD_STATUS === "1") {
            this.checkIsActive = true;
          }
          if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve || this.inputModel.autH_STATUS == AuthStatusConsts.Reject 
            || this.inputModel.autH_STATUS == AuthStatusConsts.Revoke) {
              this.appToolbar.setButtonApproveEnable(false);
              this.appToolbar.setButtonRejectEnable(false);
              this.appToolbar.setButtonRevokeEnable(false);
          }
          this.updateView();
      });
  }

  getAllTypes() {
    this.allCodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.INVEST_PROP_STATUS, "")
    .subscribe(response =>{
        this.propertyStatus = response
        this.updateView();
    })
    this.allCodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.INVEST_PROP_LEGAL_STATUS, "")
    .subscribe(response =>{
        this.legalStatus = response
        this.updateView();
    })
    this.allCodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.INVEST_PROP_GCN_STATUS, "")
    .subscribe(response =>{
        this.GCNStatus = response
        this.updateView();
    })
  }

  getInputField() {
    this._comboboxService.getComboboxData(ProjectField.class, ProjectField.attribute).subscribe(response=>{
        this.projectList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(PartnerField.class, PartnerField.attribute).subscribe(response=>{
        this.partnerList = response
        this.updateView()
    })
  }

  addNewFloor(){
    var item = new REA_FLOOR_MANAGEMENT_ENTITY();
    this.floorEditTable.pushItem(item);
    this.updateView();
  }

  checkedFloor(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.floorCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.floorCheckList = this.floorCheckList.filter(e=>e != item.id)
    }
  }

  removeFloor() {
    this.floorCheckList.forEach(e=> {
      this.inputModel.deleteD_FLOOR_ID_LIST.push(e)
    })
    this.floorCheckList = []
    this.floorEditTable.removeAllCheckedItem()
  }
  
  checkAllFloor(checked: boolean) {
    this.floorCheckList = []
    if(checked) {
      this.floorEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.floorCheckList.push(e.id)
        }
      })
    }
    this.floorEditTable.checkAll(checked)
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
        if(this.floorEditTable) {
            this.floorEditTable.allData.forEach(element=> {
                this.inputModel.flooR_LIST.push(new REA_FLOOR_MANAGEMENT_ENTITY(element))
            })
        }
        console.log(this.inputModel)

        if (!this.invesT_PROP_ID) {
            this.inputModel.makeR_ID = this.appSession.user.userName;
            this.investmentPropertyService.rEA_INVESTMENT_PROPERTY_Ins(this.inputModel).pipe(
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
            this.investmentPropertyService.rEA_INVESTMENT_PROPERTY_Upd(this.inputModel).pipe(
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
      this.navigatePassParam('/app/admin/investment-property', null, undefined);
  }

  onAdd(): void {
  }

  onUpdate(item: REA_INVESTMENT_PROPERTY_ENTITY): void {
  }

  onDelete(item: REA_INVESTMENT_PROPERTY_ENTITY): void {
  }

  onApprove(item: REA_INVESTMENT_PROPERTY_ENTITY): void {
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
                  this.investmentPropertyService.rEA_INVESTMENT_PROPERTY_App(this.inputModel.id, currentUserName, "")
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

  onReject(rejectReason: string): void {
    if (!this.inputModel.id) {
        return;
    }
  var currentUserName = this.appSession.user.userName;
  if (currentUserName == this.inputModel.makeR_ID) {
    this.showErrorMessage('Bạn không được phép từ chối đối tượng này');
    return;
  }
  this.message.confirm(
      // this.l('ApproveWarningMessage', this.l(this.inputModel.lanD_AREA_NAME)),
      // this.l('AreYouSure'),
      "Xác nhận từ chối",
      this.l('AreYouSure'),
      (isConfirmed) => {
          if (isConfirmed) {
              this.saving = true;
              this.investmentPropertyService.rEA_INVESTMENT_PROPERTY_Rej(this.inputModel.id, currentUserName, rejectReason)
              .pipe(
                catchError(e=>{
                  this.showErrorMessage("Lỗi");
                  return throwError("Lỗi")
                }),
                finalize(() => { this.saving = false; })
              )
              .subscribe((response) => {
                  this.rejectSuccess();
              });
          }
      }
  );
  }

  onRevoke(revokeReason: string): void {
    if (!this.inputModel.id) {
        return;
    }
  var currentUserName = this.appSession.user.userName;
  if (currentUserName == this.inputModel.makeR_ID) {
    this.showErrorMessage('Bạn không được phép hủy bỏ đối tượng này');
    return;
  }
  this.message.confirm(
      // this.l('ApproveWarningMessage', this.l(this.inputModel.lanD_AREA_NAME)),
      // this.l('AreYouSure'),
      "Xác nhận hủy bỏ",
      this.l('AreYouSure'),
      (isConfirmed) => {
          if (isConfirmed) {
              this.saving = true;
              this.investmentPropertyService.rEA_INVESTMENT_PROPERTY_Can(this.inputModel.id, currentUserName, revokeReason)
              .pipe(
                catchError(e=>{
                  this.showErrorMessage("Lỗi");
                  return throwError("Lỗi")
                }),
                finalize(() => { this.saving = false; })
              )
              .subscribe((response) => {
                  this.revokeSuccess();
              });
          }
      }
  );
  }

  onAccess(item: REA_INVESTMENT_PROPERTY_ENTITY): void {
  }
  onApproveKSS(item: REA_INVESTMENT_PROPERTY_ENTITY): void {
  }
  onAccessStorekeepers(item: REA_INVESTMENT_PROPERTY_ENTITY): void {
  }
  onApproveDeputy(item: REA_INVESTMENT_PROPERTY_ENTITY): void {
  }
  onApproveKhoi(item: REA_INVESTMENT_PROPERTY_ENTITY): void {
  }
  onFinishCheck(item: REA_INVESTMENT_PROPERTY_ENTITY): void {
  }
    
  onViewDetail(item: REA_INVESTMENT_PROPERTY_ENTITY): void {
  }

  onSave(): void {
      this.saveInput();
  }

  onSearch(): void {
  }

  onResetSearch(): void {
  }

  onSelect(value: string){
  }
  onSelectRea(property) {
    this.inputModel.id = property.id
    this.inputModel.propertY_INFORMATION.id = property.id
    this.inputModel.propertY_INFORMATION.propertY_TYPE_NAME = property.propertY_TYPE_NAME
    this.inputModel.propertY_INFORMATION.propertY_FIRST_LEVEL_NAME = property.propertY_FIRST_LEVEL_NAME
    this.inputModel.propertY_INFORMATION.propertY_SECOND_LEVEL_NAME = property.propertY_SECOND_LEVEL_NAME
    this.inputModel.propertY_INFORMATION.propertY_DESCRIPTION = property.propertY_DESCRIPTION
    this.inputModel.propertY_INFORMATION.originaL_PRICE = property.originaL_PRICE
    this.inputModel.propertY_INFORMATION.managemenT_COMPANY_NAME = property.managemenT_COMPANY_NAME
    this.updateView()
  }

}
