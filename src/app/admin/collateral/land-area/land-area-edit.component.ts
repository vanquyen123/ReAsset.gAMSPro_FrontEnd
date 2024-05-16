import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { CM_ALLCODE_ENTITY, UltilityServiceProxy, AllCodeServiceProxy, REA_LAND_AREA_ENTITY, LandAreaServiceProxy, REA_USE_REGISTRATION_ENTITY, REA_VALUATION_ENTITY, ComboboxServiceProxy, REA_FILE_ENTITY, REA_LAND_AREA_SODO, REA_MORTGAGE_OVERALL } from '@shared/service-proxies/service-proxies';
import { IUiAction } from '@app/ultilities/ui-action';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { finalize } from 'rxjs/operators';
import { EditableTableComponent } from '@app/admin/core/controls/editable-table/editable-table.component';
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import * as moment from 'moment';
import { DepartmentField, InvestorField, PartnerField, ProjectField, EmployeeField } from '@app/admin/core/ultils/consts/ComboboxConsts';
import { floor } from 'lodash';

@Component({
  templateUrl: './land-area-edit.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class LandAreaEditComponent extends DefaultComponentBase implements OnInit, IUiActionRejectExt<REA_LAND_AREA_ENTITY>, AfterViewInit {

  constructor(
    injector: Injector,
    private ultilityService: UltilityServiceProxy,
    private landAreaService: LandAreaServiceProxy,
    private _comboboxService: ComboboxServiceProxy,
    private allCodeService: AllCodeServiceProxy,
    ) { 
    super(injector);
    this.editPageState = this.getRouteData('editPageState');
    this.lanD_AREA_ID = this.getRouteParam('landArea');
    this.inputModel.id = this.lanD_AREA_ID;
    this.initFilter();
    this.initCombobox();
    this.initIsApproveFunct();
  }
    
  
  @ViewChild('editForm') editForm: ElementRef;
  @ViewChild('useRegistrationEditTable') useRegistrationEditTable: EditableTableComponent<REA_USE_REGISTRATION_ENTITY>;
  useRegistrationCheckList: number[] = []
  @ViewChild('sodoEditTable') sodoEditTable: EditableTableComponent<REA_LAND_AREA_SODO>;
  @ViewChild('mortgageEditTable') mortgageEditTable: EditableTableComponent<REA_MORTGAGE_OVERALL>;
  @ViewChild('attachFile') attachFile: ElementRef;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: REA_LAND_AREA_ENTITY = new REA_LAND_AREA_ENTITY();
    filterInput: REA_LAND_AREA_ENTITY;
    isApproveFunct: boolean;
    lanD_AREA_ID: string;
    checkIsActive = false;
    projectList
    investorList
    partnerList
    departmentList
    registorList
    uploadedFile = new REA_FILE_ENTITY()

  get disableInput(): boolean {
    return this.editPageState == EditPageState.viewDetail;
  }
  isShowError = false;

  ngOnInit() {
    this.getInputField()
    switch (this.editPageState) {
      case EditPageState.add:
          this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
          this.appToolbar.setRole('LandArea', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getInitInformation();
          break;
      case EditPageState.edit:
          this.appToolbar.setRole('LandArea', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getInitInformation();
          this.getLandArea();
          this.inputModel.modifieR_ID = this.appSession.user.userName
          this.inputModel.modifieR_NAME = this.appSession.user.name
          this.inputModel.modifY_DT = moment()
          break;
      case EditPageState.viewDetail:
          this.appToolbar.setRole('LandArea', false, false, false, false, false, false, true, false, true, true);
          this.appToolbar.setEnableForViewDetailPage();
          this.getInitInformation();
          this.getLandArea();
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

  addNewUseRegistration(){
    var item = {registerPeriod: 0, ...new REA_USE_REGISTRATION_ENTITY()}
    item.iS_NEW = true;
    item.iS_CHANGED=false
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
  
  checkAllRegistration(checked: boolean) {
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
    this.inputModel.usE_REGISTRATION_LIST = []
    this.inputModel.deleteD_USE_REGISTRATION_ID_LIST = []
    this.inputModel.attacheD_IMAGES = []
    this.inputModel.valuation = new REA_VALUATION_ENTITY();
    this.inputModel.valuation.iS_NEW = true
    this.inputModel.valuation.iS_CHANGED = false
    this.inputModel.creatE_DT = moment();
    this.inputModel.makeR_ID = this.appSession.user.userName
    this.inputModel.makeR_NAME = this.appSession.user.name;
    
  }

  getLandArea() {
    this.landAreaService.rEA_LAND_AREA_ById(this.inputModel.id).subscribe(response => {
        this.inputModel = response;
        this.inputModel.valuation = new REA_VALUATION_ENTITY(response.valuation)
        // this.inputModel.valuation.iS_NEW = false
        this.inputModel.valuation.iS_CHANGED = true
        this.inputModel.deleteD_USE_REGISTRATION_ID_LIST = []
        this.inputModel.deleteD_ATTACHED_IMAGES_ID_LIST = []
        if(response.attacheD_IMAGES[0]) {
          this.uploadedFile = new REA_FILE_ENTITY(response.attacheD_IMAGES[0])
          this.uploadedFile.iS_CHANGED = true
        }
        response.usE_REGISTRATION_LIST.forEach(e=>{
          e.iS_CHANGED = true;
          e.iS_NEW = false;
          let different = e.usE_REGISTRATION_EXPIRE_DT.diff(e.usE_REGISTRATION_DT)
          let days = floor(moment.duration(different).asDays())
          this.useRegistrationEditTable.pushItem({registerPeriod: days, ...e});
        })
        this.inputModel.usE_REGISTRATION_LIST = []
        if(response.lanD_AREA_SODO_LIST.length !==0) {
          this.sodoEditTable.setList(response.lanD_AREA_SODO_LIST)
        }
        if(response.mortgagE_OVERALL_LIST.length !==0) {
          this.mortgageEditTable.setList(response.mortgagE_OVERALL_LIST)
        }
        if(response.recorD_STATUS === "1") {
          this.checkIsActive = true;
        }
        if (this.inputModel.autH_STATUS == AuthStatusConsts.Approve || this.inputModel.autH_STATUS == AuthStatusConsts.Reject 
          || this.inputModel.autH_STATUS == AuthStatusConsts.Revoke) {
            this.appToolbar.setButtonApproveEnable(false);
            this.appToolbar.setButtonRejectEnable(false);
            this.appToolbar.setButtonRevokeEnable(false)
        }
        this.updateView();
    });
  }

  getInputField(){
    this._comboboxService.getComboboxData(ProjectField.class, ProjectField.attribute).subscribe(response=>{
        this.projectList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(InvestorField.class, InvestorField.attribute).subscribe(response=>{
        this.investorList = response
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
        this.registorList = response
        this.updateView()
    })
  }

  updateRegistrationExpiredDate(index: number, date: moment.Moment, period: number){
    this.useRegistrationEditTable.allData[index].usE_REGISTRATION_EXPIRE_DT = date.clone().add(period,'days')
    this.updateView();
  }

  onUploadImage(event) {
    var file = event.target.files[0]
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if(this.inputModel.attacheD_IMAGES[0]) {
            this.inputModel.attacheD_IMAGES.pop()
        }
        if(this.uploadedFile.iS_CHANGED) {
          this.inputModel.deleteD_ATTACHED_IMAGES_ID_LIST.push(this.uploadedFile.filE_ID)
          this.uploadedFile = new REA_FILE_ENTITY()
        }
        let content = reader.result.toString().split(',')
        this.uploadedFile.filE_NAME = event.target.files[0].name
        this.uploadedFile.filE_CONTENT = content[1]
        this.uploadedFile.iS_NEW = true;
        this.uploadedFile.iS_CHANGED = false
        this.uploadedFile.filE_ATTACH_DT = moment()
        this.inputModel.attacheD_IMAGES.push(this.uploadedFile)
        this.updateView()
    };
  }
  selectFile(){
    this.attachFile.nativeElement.click()
  }

  removeFile() {
    if(this.uploadedFile.iS_CHANGED) {
      this.inputModel.deleteD_ATTACHED_IMAGES_ID_LIST.push(this.uploadedFile.filE_ID)
      this.uploadedFile = new REA_FILE_ENTITY()
    }
    this.uploadedFile.filE_NAME = ""
    this.uploadedFile.filE_CONTENT = ""
    this.inputModel.attacheD_IMAGES.pop()
    this.attachFile.nativeElement.value = ""
    this.updateView()
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
          this.useRegistrationEditTable.allData.forEach(element=> {
            this.inputModel.usE_REGISTRATION_LIST.push(new REA_USE_REGISTRATION_ENTITY(element))
          })
          console.log(this.inputModel)

          if (!this.lanD_AREA_ID) {
              this.inputModel.makeR_ID = this.appSession.user.userName;
              this.landAreaService.rEA_LAND_AREA_Ins(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0' && response.result != null) {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.addNewSuccess();
                        //   if (!this.isApproveFunct) {
                        //       this.landAreaService.rEA_LAND_AREA_App(response.id, this.appSession.user.userName, "")
                        //           .pipe(finalize(() => { this.saving = false; }))
                        //           .subscribe((response) => {
                        //               if (response.result != '0') {
                        //                   this.showErrorMessage(response.errorDesc);
                        //               }
                        //           });
                        //   }
                      }
                  });
          }
          else {
              this.landAreaService.rEA_LAND_AREA_Upd(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0' && response.result != null) {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.updateSuccess();
                        //   if (!this.isApproveFunct) {
                        //       this.landAreaService.rEA_LAND_AREA_App(this.inputModel.id, this.appSession.user.userName, "")
                        //           .pipe(finalize(() => { this.saving = false; }))
                        //           .subscribe((response) => {
                        //               if (response.result != '0') {
                        //                   this.showErrorMessage(response.errorDesc);
                        //               }
                        //               else {
                        //                   this.inputModel.autH_STATUS = AuthStatusConsts.Approve;
                        //                   this.appToolbar.setButtonApproveEnable(false);
                        //                   this.updateView();
                        //               }
                        //           });
                        //   }
                        //   else {
                        // }
                        this.inputModel.autH_STATUS = AuthStatusConsts.NotApprove;
                        this.updateView();
                      }
                  });
          }
      }
  }

  goBack() {
      this.navigatePassParam('/app/admin/land-area', null, undefined);
  }

  onAdd(): void {
  }

  onUpdate(item: REA_LAND_AREA_ENTITY): void {
  }

  onDelete(item: REA_LAND_AREA_ENTITY): void {
  }

  onApprove(item: REA_LAND_AREA_ENTITY): void {
      if (!this.inputModel.id) {
          return;
      }
      var currentUserName = this.appSession.user.userName;
      if (currentUserName == this.inputModel.makeR_ID) {
        this.showErrorMessage(this.l('ApproveFailed'));
        return;
    }
      this.message.confirm(
          this.l('ApproveWarningMessage', this.l(this.inputModel.lanD_AREA_NAME)),
          this.l('AreYouSure'),
          (isConfirmed) => {
              if (isConfirmed) {
                  this.saving = true;
                  this.landAreaService.rEA_LAND_AREA_App(this.inputModel.id, currentUserName, "")
                      .pipe(finalize(() => { this.saving = false; }))
                      .subscribe((response) => {
                          if (response.result != '0' && response.errorDesc != null) {
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

  onViewDetail(item: REA_LAND_AREA_ENTITY): void {
  }

  onSave(): void {
      this.saveInput();
  }

  onSearch(): void {
  }

  onResetSearch(): void {
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
                this.landAreaService.rEA_LAND_AREA_Rej(this.inputModel.id, currentUserName, rejectReason)
                    .pipe(finalize(() => { this.saving = false; }))
                    .subscribe((response) => {
                        if (response.result != '0' && response.errorDesc != null) {
                            this.showErrorMessage(response.errorDesc);
                        }
                        else {
                            this.rejectSuccess();
                        }
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
                this.landAreaService.rEA_LAND_AREA_Can(this.inputModel.id, currentUserName, revokeReason)
                    .pipe(finalize(() => { this.saving = false; }))
                    .subscribe((response) => {
                        if (response.result != '0' && response.errorDesc != null) {
                            this.showErrorMessage(response.errorDesc);
                        }
                        else {
                            this.revokeSuccess();
                        }
                    });
            }
        }
    );
    }

    onAccess(item: REA_LAND_AREA_ENTITY): void {
    }
    onApproveKSS(item: REA_LAND_AREA_ENTITY): void {
    }
    onAccessStorekeepers(item: REA_LAND_AREA_ENTITY): void {
    }
    onApproveDeputy(item: REA_LAND_AREA_ENTITY): void {
    }
    onApproveKhoi(item: REA_LAND_AREA_ENTITY): void {
    }
    onFinishCheck(item: REA_LAND_AREA_ENTITY): void {
    }
    
    onSelect(value: string){
    }

}
