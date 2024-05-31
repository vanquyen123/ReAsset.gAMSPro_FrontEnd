import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes, ReaAllCode } from '@app/ultilities/enum/all-codes';
import { CM_ALLCODE_ENTITY, UltilityServiceProxy, AllCodeServiceProxy, REA_SODO_ENTITY, SodoServiceProxy, REA_SODO_CO_OWNER_ENTITY, REA_SODO_LAND_PLOT_ENTITY, REA_FILE_ENTITY, REA_SODO_STORE_LOCATION_ENTITY, REA_SODO_PAY_ENTITY, REA_SODO_COMPENSATION_ENTITY, REA_SODO_ADVANCE_PAYMENT_ENTITY, REA_SODO_BRIEF_1_ENTITY, REA_SODO_BRIEF_2_ENTITY, REA_SODO_BRIEF_3_ENTITY, REA_SODO_BRIEF_4_ENTITY, REA_SODO_BRIEF_5_ENTITY, SessionServiceProxy, REA_SODO_CONTRACT_ENTITY, ComboboxServiceProxy, REA_USE_REGISTRATION_ENTITY, REA_MORTGAGE_OVERALL, FileServiceProxy} from '@shared/service-proxies/service-proxies';
import { IUiAction } from '@app/ultilities/ui-action';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { catchError, finalize } from 'rxjs/operators';
import { EditableTableComponent } from '@app/admin/core/controls/editable-table/editable-table.component';
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import { AuthPersonField, DepartmentField, EmployeeField, LandAreaField, OwnerField, PartnerField, ProjectField } from '@app/admin/core/ultils/consts/ComboboxConsts';
import * as moment from 'moment';
import { base64ToBlob, saveFile } from '@app/ultilities/blob-exec';
import { throwError } from 'rxjs';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
  templateUrl: './sodo-edit.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class SodoEditComponent extends DefaultComponentBase implements OnInit, IUiActionRejectExt<REA_SODO_ENTITY>, AfterViewInit {

  constructor(
    injector: Injector,
    private ultilityService: UltilityServiceProxy,
    private sodoService: SodoServiceProxy,
    private allCodeService: AllCodeServiceProxy,
    private sessionService: SessionServiceProxy,
    private fileService: FileServiceProxy,
    private _comboboxService: ComboboxServiceProxy,
  ) { 
    super(injector);
    this.editPageState = this.getRouteData('editPageState');
    this.sodo_ID = this.getRouteParam('sodo');
    this.inputModel.id = this.sodo_ID;
    this.initFilter();
    this.initCombobox();
    this.initIsApproveFunct();
  }
  
  @ViewChild('editForm') editForm: ElementRef;
  @ViewChild('coOwnerEditTable') coOwnerEditTable: EditableTableComponent<REA_SODO_CO_OWNER_ENTITY>;
  // @ViewChild('landPlotEditTable') landPlotEditTable: EditableTableComponent<REA_SODO_LAND_PLOT_ENTITY>;
  // @ViewChild('landPlotOutsideEditTable') landPlotOutsideEditTable: EditableTableComponent<REA_SODO_LAND_PLOT_ENTITY>;
  @ViewChild('landPlotEditTable') landPlotEditTable: EditableTableComponent<REA_SODO_LAND_PLOT_ENTITY>;
  @ViewChild('fileEditTable') fileEditTable: EditableTableComponent<REA_FILE_ENTITY>;
  @ViewChild('payEditTable') payEditTable: EditableTableComponent<REA_SODO_PAY_ENTITY>;
  @ViewChild('storeLocationEditTable') storeLocationEditTable: EditableTableComponent<REA_SODO_STORE_LOCATION_ENTITY>;
  @ViewChild('compensationEditTable') compensationEditTable: EditableTableComponent<REA_SODO_COMPENSATION_ENTITY>;
  @ViewChild('advancePaymentEditTable') advancePaymentEditTable: EditableTableComponent<REA_SODO_ADVANCE_PAYMENT_ENTITY>;
  @ViewChild('useRegistrationEditTable') useRegistrationEditTable: EditableTableComponent<REA_USE_REGISTRATION_ENTITY>;

  coOwnerCheckList = []
  landPlotCheckList = []
  // landPlotOutsideCheckList = []
  fileCheckList = []
  payCheckList = []
  storeLocationCheckList = []
  compensationCheckList = []
  advancePaymentCheckList = []
  useRegistrationCheckList = []

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: REA_SODO_ENTITY = new REA_SODO_ENTITY();
    filterInput: REA_SODO_ENTITY;
    isApproveFunct: boolean;
    sodo_ID: string;
    checkIsActive = false;
    transferStatus;
    sodoTypes;
    useTypes;
    physicStatus;
    useStatus;
    storageLocations;
    
    ownerList;
    projectList;
    authList;
    landAreaList;
    partnerList;
    employeeList;
    departmentList;
    landPlotList = [];

    typeLandPlot = [
      {
        value: "Trong sổ",
      },
      {
        value: "Ngoài sổ",
      }
    ]

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
          this.appToolbar.setRole('SoDo', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getInitInformation();
          break;
      case EditPageState.edit:
          this.appToolbar.setRole('SoDo', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getInitInformation();
          this.getSodo();
          this.inputModel.modifieR_ID = this.appSession.user.userName
          this.inputModel.modifieR_NAME = this.appSession.user.name
          this.inputModel.modifY_DT = moment()
          break;
      case EditPageState.viewDetail:
          this.appToolbar.setRole('SoDo', false, false, false, false, false, false, true, false);
          this.appToolbar.setEnableForViewDetailPage();
          this.getInitInformation();
          this.getSodo();
          break;
    }
    this.appToolbar.setUiAction(this);
  }

  ngAfterViewInit(): void {
    // COMMENT: this.stopAutoUpdateView();
    this.setupValidationMessage();
  }

  exportToExcel() {
    this.sodoService.getExcelSoDoById(this.sodo_ID).subscribe(response=>{
      let base64String = response.fileContent;
      let blob = base64ToBlob(base64String, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      let name = "BC_SO_DO_" + this.sodo_ID + ".xlsx"
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

  addNewCoOwner(){
    var item = new REA_SODO_CO_OWNER_ENTITY();
    item.iS_NEW = true;
    this.coOwnerEditTable.pushItem(item);
    this.updateView();
  }

  checkedCoOwner(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.coOwnerCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.coOwnerCheckList = this.coOwnerCheckList.filter(e=>e != item.id)
    }
  }

  removeCoOwner() {
    this.coOwnerCheckList.forEach(e=> {
      this.inputModel.deleteD_CO_OWNER_ID_LIST.push(e)
    })
    this.coOwnerCheckList = []
    this.coOwnerEditTable.removeAllCheckedItem()
  }
  
  checkAllCoOwner(checked: boolean) {
    this.coOwnerCheckList = []
    if(checked) {
      this.coOwnerEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.coOwnerCheckList.push(e.id)
        }
      })
    }
    this.coOwnerEditTable.checkAll(checked)
  }

  addLandPlot(){
    var item = new REA_SODO_LAND_PLOT_ENTITY();
    item.lanD_PLOT_AREA = 0;
    this.landPlotEditTable.pushItem(item);
    this.landPlotList = this.landPlotEditTable.allData;
    console.log(this.landPlotList)
    this.updateView();
  }

  checkedLandPlot(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.landPlotCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.landPlotCheckList = this.landPlotCheckList.filter(e=>e != item.id)
    }
  }

  removeLandPlot() {
    this.landPlotCheckList.forEach(e=> {
      this.inputModel.deleteD_LAND_PLOT_ID_LIST.push(e)
    })
    this.landPlotCheckList = []
    this.landPlotEditTable.removeAllCheckedItem()
    this.landPlotList = this.landPlotEditTable.allData;
  }
  
  checkAllLandPlot(checked: boolean) {
    this.landPlotCheckList = []
    if(checked) {
      this.landPlotEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.landPlotCheckList.push(e.id)
        }
      })
    }
    this.landPlotEditTable.checkAll(checked)
  }

  // addLandPlotOutside(){
  //   var item = new REA_SODO_LAND_PLOT_ENTITY();
  //   item.lanD_PLOT_IS_INSIDE = false;
  //   item.lanD_PLOT_AREA = 0;
  //   this.landPlotOutsideEditTable.pushItem(item);
  //   console.log(this.landPlotEditTable.allData)
  //   this.updateView();
  // }

  // checkedLandPlotOutside(item, checked: boolean) {
  //   item.isChecked = checked;
  //   if(checked && item.iS_CHANGED) {
  //     this.landPlotOutsideCheckList.push(item.id)
  //   }
  //   else if(!checked && item.iS_CHANGED) {
  //     this.landPlotOutsideCheckList = this.landPlotOutsideCheckList.filter(e=>e != item.id)
  //   }
  // }

  // removeLandPlotOutside() {
  //   this.landPlotOutsideCheckList.forEach(e=> {
  //     this.inputModel.deleteD_LAND_PLOT_ID_LIST.push(e)
  //   })
  //   this.landPlotOutsideCheckList = []
  //   this.landPlotOutsideEditTable.removeAllCheckedItem()
  // }
  
  // checkAllLandPlotOutside(checked: boolean) {
  //   this.landPlotOutsideCheckList = []
  //   if(checked) {
  //     this.landPlotOutsideEditTable.allData.forEach(e=>{
  //       if(e.iS_CHANGED) {
  //         this.landPlotOutsideCheckList.push(e.id)
  //       }
  //     })
  //   }
  //   this.landPlotOutsideEditTable.checkAll(checked)
  // }

  addNewFile(){
    var item = new REA_FILE_ENTITY();
    item.iS_NEW = true;
    item.iS_CHANGED = false;
    item.filE_ATTACH_DT = moment();
    this.fileEditTable.pushItem(item);
    this.updateView();
  }

  checkedFile(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && !item.iS_NEW) {
      this.fileCheckList.push(item.filE_ID)
    }
    else if(!checked && !item.iS_NEW) {
      this.fileCheckList = this.fileCheckList.filter(e=>e != item.filE_ID)
    }
  }

  removeFile() {
    this.fileCheckList.forEach(e=> {
      this.inputModel.deleteD_FILE_ID_LIST.push(e)
    })
    this.fileCheckList = []
    this.fileEditTable.removeAllCheckedItem()
  }
  
  checkAllFile(checked: boolean) {
    this.fileCheckList = []
    if(checked) {
      this.fileEditTable.allData.forEach(e=>{
        if(!e.iS_NEW) {
          this.fileCheckList.push(e.filE_ID)
        }
      })
    }
    this.fileEditTable.checkAll(checked)
  }

  addNewPay(){
    var item = new REA_SODO_PAY_ENTITY();
    this.payEditTable.pushItem(item);
    this.updateView();
  }

  checkedPay(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.payCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.payCheckList = this.payCheckList.filter(e=>e != item.id)
    }
  }

  removePay() {
    this.payCheckList.forEach(e=> {
      this.inputModel.deleteD_PAY_ID_LIST.push(e)
    })
    this.payCheckList = []
    this.payEditTable.removeAllCheckedItem()
  }
  
  checkAllPay(checked: boolean) {
    this.payCheckList = []
    if(checked) {
      this.payEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.payCheckList.push(e.id)
        }
      })
    }
    this.payEditTable.checkAll(checked)
  }

  addNewStoreLocation(){
    var item = new REA_SODO_STORE_LOCATION_ENTITY();
    this.storeLocationEditTable.pushItem(item);
    this.updateView();
  }

  checkedStoreLocation(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.storeLocationCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.storeLocationCheckList = this.storeLocationCheckList.filter(e=>e != item.id)
    }
  }

  removeStoreLocation() {
    this.storeLocationCheckList.forEach(e=> {
      this.inputModel.deleteD_STORE_LOCATION_ID_LIST.push(e)
    })
    this.storeLocationCheckList = []
    this.storeLocationEditTable.removeAllCheckedItem()
    this.updateView();
  }
  
  checkAllStoreLocation(checked: boolean) {
    this.storeLocationCheckList = []
    if(checked) {
      this.storeLocationEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.storeLocationCheckList.push(e.id)
        }
      })
    }
    this.storeLocationEditTable.checkAll(checked)
  }

  addNewCompensation(){
    var item = new REA_SODO_COMPENSATION_ENTITY();
    this.compensationEditTable.pushItem(item);
    this.updateView();
  }

  checkedCompensation(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.compensationCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.compensationCheckList = this.compensationCheckList.filter(e=>e != item.id)
    }
  }

  removeCompensation() {
    this.compensationCheckList.forEach(e=> {
      this.inputModel.deleteD_COMPENSATION_ID_LIST.push(e)
    })
    this.compensationCheckList = []
    this.compensationEditTable.removeAllCheckedItem()
  }
  
  checkAllCompensation(checked: boolean) {
    this.compensationCheckList = []
    if(checked) {
      this.compensationEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.compensationCheckList.push(e.id)
        }
      })
    }
    this.compensationEditTable.checkAll(checked)
  }

  addNewAdvancePayment(){
    var item = new REA_SODO_ADVANCE_PAYMENT_ENTITY();
    this.advancePaymentEditTable.pushItem(item);
    this.updateView();
  }

  checkedAdvancePayment(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.advancePaymentCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.advancePaymentCheckList = this.advancePaymentCheckList.filter(e=>e != item.id)
    }
  }

  removeAdvancePayment() {
    this.advancePaymentCheckList.forEach(e=> {
      this.inputModel.deleteD_ADVANCE_PAYMENT_ID_LIST.push(e)
    })
    this.advancePaymentCheckList = []
    this.advancePaymentEditTable.removeAllCheckedItem()
  }
  
  checkAllAdvancePayment(checked: boolean) {
    this.advancePaymentCheckList = []
    if(checked) {
      this.advancePaymentEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.advancePaymentCheckList.push(e.id)
        }
      })
    }
    this.advancePaymentEditTable.checkAll(checked)
  }

  addNewUseRegistration(){
    var item = new REA_USE_REGISTRATION_ENTITY();
    this.useRegistrationEditTable.pushItem(item);
    this.updateView();
  }

  checkedUseRegistration(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.useRegistrationCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.useRegistrationCheckList = this.useRegistrationCheckList.filter(e=>e != item.id)
    }
  }

  removeUseRegistration() {
    this.useRegistrationCheckList.forEach(e=> {
      this.inputModel.deleteD_USE_REGISTRATION_ID_LIST.push(e)
    })
    this.useRegistrationCheckList = []
    this.useRegistrationEditTable.removeAllCheckedItem()
  }
  
  checkAllUseRegistration(checked: boolean) {
    this.useRegistrationCheckList = []
    if(checked) {
      this.useRegistrationEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.useRegistrationCheckList.push(e.id)
        }
      })
    }
    this.useRegistrationEditTable.checkAll(checked)
  }

  getInitInformation() {
    this.sessionService.getCurrentLoginInformations().subscribe(response=>{
        this.inputModel.makeR_ID = response.user.userName;
        this.updateView()
    })

    this.inputModel.creatE_DT = moment()
    this.inputModel.contract = new REA_SODO_CONTRACT_ENTITY();
    this.inputModel.brieF_1 = new REA_SODO_BRIEF_1_ENTITY();
    this.inputModel.brieF_2 = new REA_SODO_BRIEF_2_ENTITY();
    this.inputModel.brieF_3 = new REA_SODO_BRIEF_3_ENTITY();
    this.inputModel.brieF_4 = new REA_SODO_BRIEF_4_ENTITY();
    this.inputModel.brieF_5 = new REA_SODO_BRIEF_5_ENTITY();
    this.inputModel.cO_OWNER_LIST = []
    this.inputModel.paY_LIST = []
    this.inputModel.lanD_PLOT_LIST = []
    this.inputModel.compensatioN_LIST = []
    this.inputModel.storE_LOCATION_LIST = []
    this.inputModel.advancE_PAYMENT_LIST = []
    this.inputModel.usE_REGISTRATION_LIST = []
    this.inputModel.fileS_LIST = []
    
    this.updateView();
  }

  getSodo() {
      this.sodoService.rEA_SODO_ById(this.inputModel.id).subscribe(response => {
          this.inputModel = response;
          this.inputModel.contract = new REA_SODO_CONTRACT_ENTITY(response.contract)
          this.inputModel.brieF_1 = new REA_SODO_BRIEF_1_ENTITY(response.brieF_1);
          this.inputModel.brieF_2 = new REA_SODO_BRIEF_2_ENTITY(response.brieF_2);
          this.inputModel.brieF_3 = new REA_SODO_BRIEF_3_ENTITY(response.brieF_3);
          this.inputModel.brieF_4 = new REA_SODO_BRIEF_4_ENTITY(response.brieF_4);
          this.inputModel.brieF_5 = new REA_SODO_BRIEF_5_ENTITY(response.brieF_5);
          if(response.cO_OWNER_LIST != null) {
              response.cO_OWNER_LIST.forEach(e=>{
                e.iS_CHANGED = true;
                e.iS_NEW = false;
                this.coOwnerEditTable.pushItem(e);
              })
          }
          if(response.paY_LIST != null) {
              response.paY_LIST.forEach(e=>{
                e.iS_CHANGED = true;
                e.iS_NEW = false;
                this.payEditTable.pushItem(e);
              })
          }
          if(response.lanD_PLOT_LIST != null) {
              response.lanD_PLOT_LIST.forEach(e=>{
                e.iS_CHANGED = true;
                e.iS_NEW = false;
                if(e.lanD_PLOT_IS_INSIDE) {
                  this.landPlotEditTable.pushItem(e);
                }
                else {
                  this.landPlotEditTable.pushItem(e)
                }
              })
              this.landPlotList = this.landPlotEditTable.allData
          }
          if(response.compensatioN_LIST != null) {
              response.compensatioN_LIST.forEach(e=>{
                e.iS_CHANGED = true;
                e.iS_NEW = false;
                this.compensationEditTable.pushItem(e);
              })
          }
          if(response.storE_LOCATION_LIST != null) {
              response.storE_LOCATION_LIST.forEach(e=>{
                e.iS_CHANGED = true;
                e.iS_NEW = false;
                this.storeLocationEditTable.pushItem(e);
              })
          }
          if(response.advancE_PAYMENT_LIST != null) {
              response.advancE_PAYMENT_LIST.forEach(e=>{
                e.iS_CHANGED = true;
                e.iS_NEW = false;
                this.advancePaymentEditTable.pushItem(e);
              })
          }
          if(response.usE_REGISTRATION_LIST != null) {
              response.usE_REGISTRATION_LIST.forEach(e=>{
                e.iS_CHANGED = true;
                e.iS_NEW = false;
                this.useRegistrationEditTable.pushItem(e);
              })
          }
          if(response.fileS_LIST != null) {
              response.fileS_LIST.forEach(e=>{
                e.iS_CHANGED = false;
                e.iS_NEW = false;
                this.fileEditTable.pushItem(e);
              })
          }

          this.inputModel.cO_OWNER_LIST = [];
          this.inputModel.paY_LIST = [];
          this.inputModel.lanD_PLOT_LIST = [];
          this.inputModel.compensatioN_LIST = [];
          this.inputModel.storE_LOCATION_LIST = [];
          this.inputModel.advancE_PAYMENT_LIST = [];
          this.inputModel.usE_REGISTRATION_LIST = [];
          this.inputModel.fileS_LIST = [];

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
    this.allCodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.SODO_TRANSFER_STATUS, "")
    .subscribe(response =>{
        this.transferStatus = response
        this.updateView();
    })
    this.allCodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.SODO_TYPE, "")
    .subscribe(response =>{
        this.sodoTypes = response
        this.updateView();
    })
    this.allCodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.SODO_USE_TYPE, "")
    .subscribe(response =>{
        this.useTypes = response
        this.updateView();
    })
    this.allCodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.SODO_PHYSIC_STATUS, "")
    .subscribe(response =>{
        this.physicStatus = response
        this.updateView();
    })
    this.allCodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.SODO_USE_STATUS, "")
    .subscribe(response =>{
        this.useStatus = response
        this.updateView();
    })
    // storageLocations haven't yet;
    this.allCodeService.rEA_ALLCODE_GetByCDNAME("SODO_STORE_LOCATION_TYPE", "")
    .subscribe(response =>{
        this.storageLocations = response
        this.updateView();
    })
  }

  getInputField() {
    this._comboboxService.getComboboxData(OwnerField.class, OwnerField.attribute).subscribe(response=>{
        this.ownerList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(ProjectField.class, ProjectField.attribute).subscribe(response=>{
        this.projectList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(AuthPersonField.class, AuthPersonField.attribute).subscribe(response=>{
        this.authList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(LandAreaField.class, LandAreaField.attribute).subscribe(response=>{
        this.landAreaList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(PartnerField.class, PartnerField.attribute).subscribe(response=>{
        this.partnerList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(DepartmentField.class, DepartmentField.attribute).subscribe(response=>{
        this.departmentList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(EmployeeField.class, EmployeeField.attribute).subscribe(response=>{
      this.employeeList = response
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
          this.coOwnerEditTable.allData.forEach(element=> {
            this.inputModel.cO_OWNER_LIST.push(new REA_SODO_CO_OWNER_ENTITY(element))
          })
          this.payEditTable.allData.forEach(element=> {
            this.inputModel.paY_LIST.push(new REA_SODO_PAY_ENTITY(element))
          })
          this.landPlotEditTable.allData.forEach(element=> {
            this.inputModel.lanD_PLOT_LIST.push(new REA_SODO_LAND_PLOT_ENTITY(element))
          })
          this.compensationEditTable.allData.forEach(element=> {
            this.inputModel.compensatioN_LIST.push(new REA_SODO_COMPENSATION_ENTITY(element))
          })
          this.storeLocationEditTable.allData.forEach(element=> {
            this.inputModel.storE_LOCATION_LIST.push(new REA_SODO_STORE_LOCATION_ENTITY(element))
          })
          this.advancePaymentEditTable.allData.forEach(element=> {
            this.inputModel.advancE_PAYMENT_LIST.push(new REA_SODO_ADVANCE_PAYMENT_ENTITY(element))
          })
          this.useRegistrationEditTable.allData.forEach(element=> {
            this.inputModel.usE_REGISTRATION_LIST.push(new REA_USE_REGISTRATION_ENTITY(element))
          })
          this.fileEditTable.allData.forEach(element=> {
            this.inputModel.fileS_LIST.push(new REA_FILE_ENTITY(element))
          })
          if (!this.sodo_ID) {
              this.inputModel.makeR_ID = this.appSession.user.userName;
              this.sodoService.rEA_SODO_Ins(this.inputModel).pipe(
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
              this.sodoService.rEA_SODO_Upd(this.inputModel).pipe(
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
      this.navigatePassParam('/app/admin/so-do', null, undefined);
  }

  onAdd(): void {
  }

  onUpdate(item: REA_SODO_ENTITY): void {
  }

  onDelete(item: REA_SODO_ENTITY): void {
  }

  onApprove(item: REA_SODO_ENTITY): void {
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
                this.sodoService.rEA_SODO_App(this.inputModel.id, currentUserName)
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
              this.sodoService.rEA_SODO_Rej(this.inputModel.id, currentUserName, rejectReason)
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
              this.sodoService.rEA_SODO_Can(this.inputModel.id, currentUserName, revokeReason)
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

  onAccess(item: REA_SODO_ENTITY): void {
  }
  onApproveKSS(item: REA_SODO_ENTITY): void {
  }
  onAccessStorekeepers(item: REA_SODO_ENTITY): void {
  }
  onApproveDeputy(item: REA_SODO_ENTITY): void {
  }
  onApproveKhoi(item: REA_SODO_ENTITY): void {
  }
  onFinishCheck(item: REA_SODO_ENTITY): void {
  }

  onSelectOwnerType(ownerType : CM_ALLCODE_ENTITY){
    // this.inputModel.owneR_TYPE_NAME = ownerType.content;
  }

  onViewDetail(item: REA_SODO_ENTITY): void {
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

  onChangeArea(){
    let newArea = 0;
    this.landPlotEditTable.allData.forEach(e=>{
      newArea += Number(e.lanD_PLOT_AREA)
    })
    this.inputModel.sodO_TOTAL_AREA = newArea;
    this.updateView()
  }

  downloadFile() {
    console.log(this.fileCheckList)
    this.fileService.getZipFileBlob(this.fileCheckList).subscribe(response=>{
      const zip = new JSZip();

      response.forEach(file => {
        const base64String = file.fileContent;
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });
        zip.file(file.fileName, blob);
      });
      zip.generateAsync({ type: 'blob' }).then(content => {
        saveAs(content, 'files.zip');
      });
    })
  }

  onSelectLandPlotType(item, type) {
    if(type.value == "Trong sổ") {
      item.lanD_PLOT_IS_INSIDE = true;
    }
    else {
      item.lanD_PLOT_IS_INSIDE = false;
    }
    this.updateView();
  }

}
