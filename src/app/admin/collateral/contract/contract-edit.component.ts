import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { ReaAllCode } from '@app/ultilities/enum/all-codes';
import { AllCodeServiceProxy, BranchServiceProxy, CM_BRANCH_ENTITY, CONTRACT_ANNEX_ENTITY, CONTRACT_ITEM_ENTITY, CONTRACT_ITEM_RENTAL_PRICE_ENTITY, ComboboxServiceProxy, ContractServiceProxy, InvestmentPropertyServiceProxy, REA_ALLCODE_ENTITY, REA_CONTRACT_ENTITY, REA_INVESTMENT_PROPERTY_ENTITY, REA_INVEST_PROPERTY_LOOKUP, SessionServiceProxy, UltilityServiceProxy } from '@shared/service-proxies/service-proxies';
import { IUiAction } from '@app/ultilities/ui-action';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { catchError, finalize } from 'rxjs/operators';
import { EditableTableComponent } from '@app/admin/core/controls/editable-table/editable-table.component';
import * as moment from 'moment';
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { PartnerField } from '@app/admin/core/ultils/consts/ComboboxConsts';
import { throwError } from 'rxjs';
import { base64ToBlob, saveFile } from '@app/ultilities/blob-exec';

@Component({
  // selector: 'app-outside-shareholder-edit',
  templateUrl: './contract-edit.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class ContractEditComponent extends DefaultComponentBase implements OnInit, IUiActionRejectExt<REA_CONTRACT_ENTITY>, AfterViewInit {

  constructor(
    injector: Injector,
    private ultilityService: UltilityServiceProxy,
    private contractService: ContractServiceProxy,
    private investPropService: InvestmentPropertyServiceProxy,
    private allcodeService: AllCodeServiceProxy,
    private _comboboxService: ComboboxServiceProxy,
  ) { 
    super(injector);
    this.editPageState = this.getRouteData('editPageState');
    this.contract_ID = this.getRouteParam('contract');
    this.inputModel.id = this.contract_ID;
    this.initFilter();
    this.initCombobox();
    this.initIsApproveFunct();
  }
  
  @ViewChild('editForm') editForm: ElementRef;
  @ViewChild('annexEditTable') annexEditTable: EditableTableComponent<CONTRACT_ANNEX_ENTITY>;
  @ViewChild('itemEditTable') itemEditTable: EditableTableComponent<CONTRACT_ITEM_ENTITY>;
  @ViewChild('priceEditTable') priceEditTable: EditableTableComponent<CONTRACT_ITEM_RENTAL_PRICE_ENTITY>;
  @ViewChild('investPropModal') investPropModal

  annexCheckList = []
  itemCheckList = []
  priceCheckList = []
  itemSelected;
  propSelectedList


    EditPageState = EditPageState;
    ReaAllCode = ReaAllCode;
    editPageState: EditPageState;

    inputModel: REA_CONTRACT_ENTITY = new REA_CONTRACT_ENTITY();
    filterInput: REA_CONTRACT_ENTITY;
    isApproveFunct: boolean;
    contract_ID: string;
    checkIsActive = false;
    partnerList;

    itemTypes;
    rentalPriceTypes;
    contractStatus;
    rentalPrices: CONTRACT_ITEM_RENTAL_PRICE_ENTITY[] = [];

    investPropList: REA_INVESTMENT_PROPERTY_ENTITY[] = []

    firstLoad = 3;

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
          this.appToolbar.setRole('Contract', false, false, true, false, false, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getInitInformation();
          break;
      case EditPageState.edit:
          this.appToolbar.setRole('Contract', false, false, true, false, false, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getInitInformation();
          this.getContract();
          this.inputModel.modifieR_ID = this.appSession.user.userName
          this.inputModel.modifieR_NAME = this.appSession.user.name
          this.inputModel.modifY_DT = moment()
          break;
      case EditPageState.viewDetail:
          this.appToolbar.setRole('Contract', false, false, false, false, false, false, true, false, true, true);
          this.appToolbar.setEnableForViewDetailPage();
          this.getInitInformation();
          this.getContract();
          break;
    }
    this.appToolbar.setUiAction(this);
  }

  ngAfterViewInit(): void {
    // COMMENT: this.stopAutoUpdateView();
    this.setupValidationMessage();
  }

  exportToExcel() {
    this.contractService.getContractItemExcelById(this.contract_ID).subscribe(response=>{
      let base64String = response.fileContent;
      let blob = base64ToBlob(base64String, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      let name = "BC_HDT_BDS_" + this.contract_ID + ".xlsx"
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

  addNewAnnex() {
    var item = new CONTRACT_ANNEX_ENTITY();
    item.iS_NEW = true;
    item.iS_CHANGED = false;
    this.annexEditTable.pushItem(item);
    this.updateView();
    }
  checkedAnnex(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.annexCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.annexCheckList = this.annexCheckList.filter(e=>e != item.id)
    }
  }

  removeAnnex() {
    this.annexCheckList.forEach(e=> {
      this.inputModel.deleteD_ANNEX_ID_LIST.push(e)
    })
    this.annexCheckList = []
    this.annexEditTable.removeAllCheckedItem()
  }

  checkAllAnnex(checked: boolean) {
    this.annexCheckList = []
    if(checked) {
      this.annexEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.annexCheckList.push(e.id)
        }
      })
    }
    this.annexEditTable.checkAll(checked)
  }

  addNewItem() {
    var item = new CONTRACT_ITEM_ENTITY();
    item.contracT_ITEM_RENTAL_AREA = 0;
    item.contracT_ITEM_TYPE = 'C';
    item.iS_NEW = true;
    item.iS_CHANGED = false
    this.itemEditTable.pushItem(item);
    this.updateView();
    }

  checkedItem(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.itemCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.itemCheckList = this.itemCheckList.filter(e=>e != item.id)
    }
  }

  removeItem() {
    this.itemCheckList.forEach(e=> {
      this.inputModel.deleteD_ITEM_ID_LIST.push(e)
    })
    this.itemCheckList = []
    this.itemEditTable.removeAllCheckedItem()
    this.investPropList.forEach(prop=>{
      let delFlag = true;
      this.itemEditTable.allData.forEach(item=>{
        if(item.contracT_ITEM_TYPE == 'C' && item.contracT_ITEM_INVESTMENT_PROP_ID) {
          if(item.contracT_ITEM_INVESTMENT_PROP_ID == prop.id) {
            delFlag = false
          }
        }
      })
      if(delFlag) {
        let index = this.investPropList.indexOf(prop);
        this.investPropList.splice(index, 1);
      }
    })
    this.updateView()
  }

  checkAllItem(checked: boolean) {
    this.itemCheckList = []
    if(checked) {
      this.itemEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.itemCheckList.push(e.id)
        }
      })
    }
    this.itemEditTable.checkAll(checked)
  }

  addNewPrice() {
    var price = new CONTRACT_ITEM_RENTAL_PRICE_ENTITY();
    price.rentaL_PRICE_UNIT_PRICE_VND = 0;
    price.rentaL_PRICE_UNIT_PRICE_USD = 0;
    price.rentaL_PRICE_MONTH_NUMBER = 0;
    price.rentaL_PRICE_REVENUE_PER_MOUNTH = 0;
    price.rentaL_PRICE_TOTAL_REVENUE = 0;
    price.iS_NEW = true;
    price.iS_CHANGED = false
    this.priceEditTable.pushItem(price);
    this.updateView();
  }

  checkedPrice(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.priceCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.priceCheckList = this.priceCheckList.filter(e=>e != item.id)
    }
  }

  removePrice() {
    this.priceCheckList.forEach(e=> {
      this.inputModel.deleteD_ITEM_PRICE_ID_LIST.push(e)
      this.itemEditTable.allData.forEach(item=>{
        if(item.contracT_ITEM_RENTAL_PRICE.id == e) {
          item.contracT_ITEM_RENTAL_PRICE = null
        }
      })
    })
    
    this.priceCheckList = []
    this.priceEditTable.removeAllCheckedItem()
  }

  checkAllPrice(checked: boolean) {
    this.priceCheckList = []
    if(checked) {
      this.priceEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.priceCheckList.push(e.id)
        }
      })
    }
    this.priceEditTable.checkAll(checked)
  }

  getInitInformation() {
    this.inputModel.makeR_ID = this.appSession.user.userName
    this.inputModel.makeR_NAME = this.appSession.user.name
    this.inputModel.creatE_DT = moment();
    this.inputModel.totaL_REVENUE = 0;
    this.inputModel.contracT_ITEMS = [];
    this.inputModel.contracT_ANNEXES = [];
    this.updateView();
  }
  
  getContract() {
      this.contractService.rEA_CONTRACT_ById(this.inputModel.id).subscribe(response => {
          this.inputModel = response;
          console.log(response)
          if(response.contracT_ANNEXES != null) {
              response.contracT_ANNEXES.forEach(e=>{
                e.iS_CHANGED = true;
                e.iS_NEW = false;
                this.annexEditTable.pushItem(e);
              })
          }
          if(response.contracT_ITEMS != null) {
              response.contracT_ITEMS.forEach(e=>{
                console.log(e)
                e.iS_CHANGED = true;
                e.iS_NEW = false;
                this.itemEditTable.pushItem(e);
                if(e.contracT_ITEM_RENTAL_PRICE != null) {
                    e.contracT_ITEM_RENTAL_PRICE.iS_CHANGED = true
                    e.contracT_ITEM_RENTAL_PRICE.iS_NEW = false
                    this.priceEditTable.pushItem(e.contracT_ITEM_RENTAL_PRICE)
                }
                this.investPropService.rEA_INVESTMENT_PROPERTY_ById(e.contracT_ITEM_INVESTMENT_PROP_ID).subscribe(response=>{
                  this.investPropList.push(response);
                  this.updateView()
                })
              })
          }

          this.inputModel.contracT_ITEMS = [];
          this.inputModel.contracT_ANNEXES = [];
          this.inputModel.deleteD_ITEM_ID_LIST = [];
          this.inputModel.deleteD_ANNEX_ID_LIST = [];
          this.inputModel.deleteD_ITEM_PRICE_ID_LIST = [];
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
    this.allcodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.CONTRACT_ITEM_TYPE, "")
    .subscribe(response =>{
        this.itemTypes = response
    })

    this.allcodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.RENTAL_PRICE_TYPE, "")
    .subscribe(response =>{
        this.rentalPriceTypes = response
    })

    this.allcodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.CONTRACT_STATUS, "")
    .subscribe(response =>{
        this.contractStatus = response
    })
  }

  getInputField() {
    this._comboboxService.getComboboxData(PartnerField.class, PartnerField.attribute).subscribe(response=>{
        this.partnerList = response
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
          // this.priceEditTable.allData.forEach(element=> {
          //   if(element.rentaL_PRICE_TYPE == 'C') {
          //       let contract = this.itemEditTable.allData.find(e=>e.id == element.contracT_ITEM_ID)
          //       contract.contracT_ITEM_RENTAL_PRICE = element
          //   }
          // })
          this.annexEditTable.allData.forEach(element=> {
            this.inputModel.contracT_ANNEXES.push(new CONTRACT_ANNEX_ENTITY(element))
          })
          this.itemEditTable.allData.forEach(e=>{
            this.inputModel.contracT_ITEMS.push(new CONTRACT_ITEM_ENTITY(e))
          })
          console.log(this.inputModel)

          if (!this.contract_ID) {
              this.inputModel.makeR_ID = this.appSession.user.userName;
              this.contractService.rEA_CONTRACT_Ins(this.inputModel).pipe(
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
              this.contractService.rEA_CONTRACT_Upd(this.inputModel).pipe(
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
      this.navigatePassParam('/app/admin/subsidiary-company', null, undefined);
  }

  onAdd(): void {
  }

  onUpdate(item: REA_CONTRACT_ENTITY): void {
  }

  onDelete(item: REA_CONTRACT_ENTITY): void {
  }

  onApprove(item: REA_CONTRACT_ENTITY): void {
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
                  this.contractService.rEA_CONTRACT_App(this.inputModel.id, currentUserName, "")
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
                this.contractService.rEA_CONTRACT_Rej(this.inputModel.id, currentUserName, rejectReason)
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
                this.contractService.rEA_CONTRACT_Can(this.inputModel.id, currentUserName, revokeReason)
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

  onSelect(value){
    this.updateView()
  }

  onViewDetail(item: REA_CONTRACT_ENTITY): void {
  }

  onSave(): void {
      this.saveInput();
  }

  onSearch(): void {
  }

  onResetSearch(): void {
  }

  onAccess(item: REA_CONTRACT_ENTITY): void {
  }
  onApproveKSS(item: REA_CONTRACT_ENTITY): void {
  }
  onAccessStorekeepers(item: REA_CONTRACT_ENTITY): void {
  }
  onApproveDeputy(item: REA_CONTRACT_ENTITY): void {
  }
  onApproveKhoi(item: REA_CONTRACT_ENTITY): void {
  }
  onFinishCheck(item: REA_CONTRACT_ENTITY): void {
  }

  onSelectItemType(item){
    if(!this.firstLoad){
      item.contracT_ITEM_INVESTMENT_PROP_ID = "";
      item.contracT_ITEM_INVESTMENT_PROP_NAME = "";
      if(item.contracT_ITEM_INVESTMENT_PROP_ID) {
        this.investPropList = this.investPropList.filter(e=> e.id != item.contracT_ITEM_INVESTMENT_PROP_ID)
      }
    }
    else {
      this.firstLoad--
    }
    this.updateView()
  }
  
  onSelectItemProp(item) {
    this.itemSelected = item
    this.investPropModal.show();
  }

  onSelectInvestProp(investProp) {
    this.itemSelected.contracT_ITEM_INVESTMENT_PROP_ID = investProp.id
    this.itemSelected.contracT_ITEM_INVESTMENT_PROP_NAME = investProp.name
    this.investPropService.rEA_INVESTMENT_PROPERTY_ById(investProp.id).subscribe(response=>{
      this.itemSelected.contracT_ITEM_INVESTMENT_PROP_ID = response.id
      this.itemSelected.contracT_ITEM_INVESTMENT_PROP_NAME = response.invesT_PROP_NAME
      this.itemSelected.contracT_ITEM_INVESTMENT_PROP_LOCATION = response.invesT_PROP_LOCATION
      this.investPropList.push(response)
      this.updateView();
    })
  }

  onSelectInvestProp2(item, investProp) {
    item.contracT_ITEM_INVESTMENT_PROP_ID = investProp.id
    item.contracT_ITEM_INVESTMENT_PROP_NAME = investProp.name
    this.updateView()
  }

  onSelectInvestProp3(item, investProp) {
    this.itemEditTable.allData.forEach(e=>{
      console.log(e.contracT_ITEM_INVESTMENT_PROP_ID)
      console.log(investProp)
      if(e.contracT_ITEM_INVESTMENT_PROP_ID == investProp.id) {
        console.log(e)
        e.contracT_ITEM_RENTAL_PRICE = item
      }
    })
  }

  onChangeAnnexDt(item){
    item.anneX_TERMINATE_DT = moment(item.anneX_SIGN_DT).add(item.anneX_TERM, 'M')
    this.updateView()
  }

  onChangeRentalArea(item) {
    let investProp = this.investPropList.find(e=>e.id==item.contracT_ITEM_INVESTMENT_PROP_ID);
    if(item.contracT_ITEM_RENTAL_AREA<0) {
      item.contracT_ITEM_RENTAL_AREA = 0;
    }
    if(item.contracT_ITEM_RENTAL_AREA > investProp.invesT_PROP_BUSINESS_AREA) {
      item.contracT_ITEM_RENTAL_AREA = investProp.invesT_PROP_BUSINESS_AREA;
    }
    if(item.contracT_ITEM_RENTAL_PRICE) {
      this.onChangeRevenue(item.contracT_ITEM_RENTAL_PRICE)
    }
    console.log(item)
    this.updateView()
  }

  onChangeItemDt(item) {
    item.contracT_ITEM_TERMINATE_DT = moment(item.contracT_ITEM_EFFECT_DT).add(item.contracT_ITEM_TERM, 'M')
    if(item.contracT_ITEM_RENTAL_PRICE) {
      this.onChangeRevenue(item.contracT_ITEM_RENTAL_PRICE)
    }
    this.updateView()
  }

  onChangePriceDt(item) {
    item.rentaL_PRICE_EXPIRE_DT = moment(item.rentAl_PRICE_EFFECT_DT).add(item.rentaL_PRICE_MONTH_NUMBER, 'M')
    this.onChangeRevenue(item)
    this.updateView()
  }

  onChangeRevenue(item) {
    let area = 0;
    this.itemEditTable.allData.forEach(e=>{
      if(e.contracT_ITEM_RENTAL_PRICE == item) {
        area = e.contracT_ITEM_RENTAL_AREA
        console.log(e)
      }
    })
    item.rentaL_PRICE_REVENUE_PER_MOUNTH = item.rentaL_PRICE_UNIT_PRICE_VND * area;
    item.rentaL_PRICE_TOTAL_REVENUE = item.rentaL_PRICE_REVENUE_PER_MOUNTH * item.rentaL_PRICE_MONTH_NUMBER;
    this.updateTotalRevenue();
  }

  updateTotalRevenue() {
    this.inputModel.totaL_REVENUE = 0
    this.priceEditTable.allData.forEach(e=>{
      this.inputModel.totaL_REVENUE += e.rentaL_PRICE_TOTAL_REVENUE;
    })
    this.updateView()
  }

}
