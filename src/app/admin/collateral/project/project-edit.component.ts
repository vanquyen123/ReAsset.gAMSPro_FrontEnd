import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes, ReaAllCode } from '@app/ultilities/enum/all-codes';
import { CM_ALLCODE_ENTITY, UltilityServiceProxy, AllCodeServiceProxy, REA_PROJECT_ENTITY, ProjectServiceProxy, REA_PROJECT_PROPERTY_ENTITY, REA_PROJECT_EXPLOITATION_ENTITY, REA_USE_REGISTRATION_ENTITY, REA_PROJECT_PROGRESS_ENTITY, REA_PROJECT_LEGAL_STATUS_ENTITY, REA_VALUATION_ENTITY, REA_PROJECT_OWN_STRUCTURE_ENTITY, REA_PROJECT_COOPERATE_STRUCTURE_ENTITY, ComboboxServiceProxy, REA_FILE_ENTITY, REA_LAND_AREA_OVERALL, REA_PROJECT_SODO_OVERALL, REA_MORTGAGE_OVERALL} from '@shared/service-proxies/service-proxies';
import { IUiAction } from '@app/ultilities/ui-action';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { finalize } from 'rxjs/operators';
import { EditableTableComponent } from '@app/admin/core/controls/editable-table/editable-table.component';
import { IUiActionRejectExt } from '@app/ultilities/ui-action-re';
import * as moment from 'moment';
import { DepartmentField, EmployeeField, InvestorField, LandAreaField, PartnerField, ProvinceField, ShareholderField } from '@app/admin/core/ultils/consts/ComboboxConsts';

@Component({
  templateUrl: './project-edit.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectEditComponent extends DefaultComponentBase implements OnInit, IUiActionRejectExt<REA_PROJECT_ENTITY>, AfterViewInit {

  constructor(
    injector: Injector,
    private ultilityService: UltilityServiceProxy,
    private projectService: ProjectServiceProxy,
    private allCodeService: AllCodeServiceProxy,
    private _comboboxService: ComboboxServiceProxy,
    ) { 
    super(injector);
    this.editPageState = this.getRouteData('editPageState');
    this.projecT_ID = this.getRouteParam('project');
    this.inputModel.id = this.projecT_ID;
    this.initFilter();
    this.initCombobox();
    this.initIsApproveFunct();
  }
    
  
  @ViewChild('editForm') editForm: ElementRef;
  @ViewChild('propertyEditTable') propertyEditTable: EditableTableComponent<REA_PROJECT_PROPERTY_ENTITY>;
  @ViewChild('exploitationEditTable') exploitationEditTable: EditableTableComponent<REA_PROJECT_EXPLOITATION_ENTITY>;
  @ViewChild('registrationEditTable') registrationEditTable: EditableTableComponent<REA_USE_REGISTRATION_ENTITY>;
  @ViewChild('progressEditTable') progressEditTable: EditableTableComponent<REA_PROJECT_PROGRESS_ENTITY>;
  @ViewChild('ownStructureEditTable') ownStructureEditTable: EditableTableComponent<REA_PROJECT_OWN_STRUCTURE_ENTITY>;
  @ViewChild('cooperateStructureEditTable') cooperateStructureEditTable: EditableTableComponent<REA_PROJECT_COOPERATE_STRUCTURE_ENTITY>;
  @ViewChild('landAreaEditTable') landAreaEditTable: EditableTableComponent<REA_LAND_AREA_OVERALL>;
  @ViewChild('sodoEditTable') sodoEditTable: EditableTableComponent<REA_PROJECT_SODO_OVERALL>;
  @ViewChild('mortgageEditTable') mortgageEditTable: EditableTableComponent<REA_MORTGAGE_OVERALL>;
  @ViewChild('attachFile') attachFile: ElementRef;

  propertyCheckList = []
  exploitationCheckList = []
  registrationCheckList = []
  progressCheckList = []
  ownStructureCheckList = []
  cooperateStructureCheckList = []

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: REA_PROJECT_ENTITY = new REA_PROJECT_ENTITY();
    filterInput: REA_PROJECT_ENTITY;
    isApproveFunct: boolean;
    projecT_ID: string;
    checkIsActive = false;
    tempList=[{value: "value"}]
    projectTypeList
    entityTypeList
    projectCompleteStatus
    projectStatus
    ownerTypeList

    provinceList
    investorList
    shareholderList
    employeeList
    partnerList
    landAreaList
    departmentList
    uploadedFile = new REA_FILE_ENTITY()

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
          this.appToolbar.setRole('Project', false, false, true, false, false, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getInitInformation();
          break;
      case EditPageState.edit:
          this.appToolbar.setRole('Project', false, false, true, false, false, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getInitInformation();
          this.getProject();
          this.inputModel.modifieR_ID = this.appSession.user.userName
          this.inputModel.modifieR_NAME = this.appSession.user.name
          this.inputModel.modifY_DT = moment()
          break;
      case EditPageState.viewDetail:
          this.appToolbar.setRole('Project', false, false, false, false, false, false, true, false, true, true);
          this.appToolbar.setEnableForViewDetailPage();
          this.getInitInformation();
          this.getProject();
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

  addNewProperty(){
    var item = new REA_PROJECT_PROPERTY_ENTITY();
    this.propertyEditTable.pushItem(item);
    this.updateView();
  }

  checkedProperty(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.propertyCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.propertyCheckList = this.propertyCheckList.filter(e=>e != item.id)
    }
  }

  removeProperty() {
    this.propertyCheckList.forEach(e=> {
      this.inputModel.deleteD_PROPERTY_ID_LIST.push(e)
    })
    this.propertyCheckList = []
    this.propertyEditTable.removeAllCheckedItem()
  }

  checkAllProperty(checked: boolean) {
    this.propertyCheckList = []
    if(checked) {
      this.propertyEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.propertyCheckList.push(e.id)
        }
      })
    }
    this.propertyEditTable.checkAll(checked)
  }

  addNewExploitation(){
    var item = new REA_PROJECT_EXPLOITATION_ENTITY();
    item.attacheD_IMAGE = new REA_FILE_ENTITY()
    item.attacheD_IMAGE.iS_NEW = true;
    this.exploitationEditTable.pushItem(item);
    this.updateView();
  }

  checkedExploitation(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.exploitationCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.exploitationCheckList = this.exploitationCheckList.filter(e=>e != item.id)
    }
  }

  removeExploitation() {
    this.exploitationCheckList.forEach(e=> {
      this.inputModel.deleteD_EXPLOITATION_ID_LIST.push(e)
    })
    this.exploitationEditTable.allData.forEach(e=>{
        if(this.exploitationCheckList.includes(e.id) && e.attacheD_IMAGE.filE_ID) {
            this.inputModel.deletE_FILE_ID_LIST.push(e.attacheD_IMAGE.filE_ID)
        }
    })
    this.exploitationCheckList = []
    this.exploitationEditTable.removeAllCheckedItem()
  }
  
  checkAllExploitation(checked: boolean) {
    this.exploitationCheckList = []
    if(checked) {
      this.exploitationEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.exploitationCheckList.push(e.id)
        }
      })
    }
    this.exploitationEditTable.checkAll(checked)
  }

  addNewRegistration(){
    var item = new REA_USE_REGISTRATION_ENTITY();
    this.registrationEditTable.pushItem(item);
    this.updateView();
  }

  checkedRegistration(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.registrationCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.registrationCheckList = this.registrationCheckList.filter(e=>e != item.id)
    }
  }

  removeRegistration() {
    this.registrationCheckList.forEach(e=> {
      this.inputModel.deleteD_USE_REGISTRATION_ID_LIST.push(e)
    })
    this.registrationCheckList = []
    this.registrationEditTable.removeAllCheckedItem()
  }
  
  checkAllRegistration(checked: boolean) {
    this.registrationCheckList = []
    if(checked) {
      this.registrationEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.registrationCheckList.push(e.id)
        }
      })
    }
    this.registrationEditTable.checkAll(checked)
  }

  addNewProgress(){
    var item = new REA_PROJECT_PROGRESS_ENTITY();
    item.attacheD_FILE = new REA_FILE_ENTITY();
    item.iS_NEW = true;
    this.progressEditTable.pushItem(item);
    this.updateView();
  }

  checkedProgress(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.progressCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.progressCheckList = this.progressCheckList.filter(e=>e != item.id)
    }
  }

  removeProgress() {
    this.progressCheckList.forEach(e=> {
      this.inputModel.deleteD_USE_REGISTRATION_ID_LIST.push(e)
    })
    this.progressEditTable.allData.forEach(e=>{
        if(this.progressCheckList.includes(e.id) && e.attacheD_FILE.filE_ID) {
            this.inputModel.deletE_FILE_ID_LIST.push(e.attacheD_FILE.filE_ID)
        }
    })
    this.progressCheckList = []
    this.progressEditTable.removeAllCheckedItem()
  }
  
  checkAllProgress(checked: boolean) {
    this.progressCheckList = []
    if(checked) {
      this.progressEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.progressCheckList.push(e.id)
        }
      })
    }
    this.progressEditTable.checkAll(checked)
  }

  addNewOwnStructure(){
    var item = new REA_PROJECT_OWN_STRUCTURE_ENTITY();
    this.ownStructureEditTable.pushItem(item);
    this.updateView();
  }

  checkedOwnStructure(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.ownStructureCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.ownStructureCheckList = this.ownStructureCheckList.filter(e=>e != item.id)
    }
  }

  removeOwnStructure() {
    this.ownStructureCheckList.forEach(e=> {
      this.inputModel.deleteD_USE_REGISTRATION_ID_LIST.push(e)
    })
    this.ownStructureCheckList = []
    this.ownStructureEditTable.removeAllCheckedItem()
  }
  
  checkAllOwnStructure(checked: boolean) {
    this.ownStructureCheckList = []
    if(checked) {
      this.ownStructureEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.ownStructureCheckList.push(e.id)
        }
      })
    }
    this.ownStructureEditTable.checkAll(checked)
  }

  addNewCooperateStructure(){
    var item = new REA_PROJECT_COOPERATE_STRUCTURE_ENTITY();
    item.entitY_TYPE = 'CT'
    this.cooperateStructureEditTable.pushItem(item);
    this.updateView();
  }

  checkedCooperateStructure(item, checked: boolean) {
    item.isChecked = checked;
    if(checked && item.iS_CHANGED) {
      this.cooperateStructureCheckList.push(item.id)
    }
    else if(!checked && item.iS_CHANGED) {
      this.cooperateStructureCheckList = this.cooperateStructureCheckList.filter(e=>e != item.id)
    }
  }

  removeCooperateStructure() {
    this.cooperateStructureCheckList.forEach(e=> {
      this.inputModel.deleteD_USE_REGISTRATION_ID_LIST.push(e)
    })
    this.cooperateStructureCheckList = []
    this.cooperateStructureEditTable.removeAllCheckedItem()
  }
  
  checkAllCooperateStructure(checked: boolean) {
    this.cooperateStructureCheckList = []
    if(checked) {
      this.cooperateStructureEditTable.allData.forEach(e=>{
        if(e.iS_CHANGED) {
          this.cooperateStructureCheckList.push(e.id)
        }
      })
    }
    this.cooperateStructureEditTable.checkAll(checked)
  }

  getInitInformation() {
    this.inputModel.projecT_TYPE = 'TM';
    this.inputModel.makeR_ID = this.appSession.user.userName
    this.inputModel.makeR_NAME = this.appSession.user.name
    this.inputModel.creatE_DT = moment()
    this.inputModel.legaL_STATUS = new REA_PROJECT_LEGAL_STATUS_ENTITY();
    this.inputModel.valuation = new REA_VALUATION_ENTITY();
    this.inputModel.attacheD_IMAGES = []
    this.inputModel.owN_LIST = []
    this.inputModel.cooperatE_LIST = []
    this.inputModel.propertY_LIST = []
    this.inputModel.exploitatioN_LIST = []
    this.inputModel.registratioN_LIST = []
    this.inputModel.progresS_LIST = []

    this.updateView();
  }

  getProject() {
      this.projectService.rEA_PROJECT_ById(this.inputModel.id).subscribe(response => {
          this.inputModel = response;
          this.inputModel.legaL_STATUS = new REA_PROJECT_LEGAL_STATUS_ENTITY(response.legaL_STATUS);
          this.inputModel.valuation = new REA_VALUATION_ENTITY(response.valuation);
          if(response.attacheD_IMAGES[0]) {
            this.uploadedFile = new REA_FILE_ENTITY(response.attacheD_IMAGES[0])
            this.uploadedFile.iS_CHANGED = true
          }
          if(response.owN_LIST != null) {
              response.owN_LIST.forEach(e=>{
                e.iS_CHANGED = true;
                e.iS_NEW = false;
                this.ownStructureEditTable.pushItem(e);
              })
          }
          if(response.cooperatE_LIST != null) {
              response.cooperatE_LIST.forEach(e=>{
                e.iS_CHANGED = true;
                this.updateView();
                this.cooperateStructureEditTable.pushItem(e);
              })
          }
          if(response.propertY_LIST != null) {
              response.propertY_LIST.forEach(e=>{
                e.iS_CHANGED = true;
                e.iS_NEW = false;
                this.propertyEditTable.pushItem(e);
              })
          }
          if(response.exploitatioN_LIST != null) {
              response.exploitatioN_LIST.forEach(e=>{
              e.iS_CHANGED = true;
              e.iS_NEW = false;
              this.exploitationEditTable.pushItem(e);
            })
          }
          if(response.registratioN_LIST != null) {
              response.registratioN_LIST.forEach(e=>{
                e.iS_CHANGED = true;
                e.iS_NEW = false;
                this.registrationEditTable.pushItem(e);
              })
          }
          if(response.progresS_LIST != null) {
              response.progresS_LIST.forEach(e=>{
              e.iS_CHANGED = true;
              e.iS_NEW = false;
              this.progressEditTable.pushItem(e);
            })
          }
          if(response.lanD_AREA_LIST != null) {
            if(response.lanD_AREA_LIST.length >0) {
              this.landAreaEditTable.setList(response.lanD_AREA_LIST)
            }
          }
          if(response.sodO_LIST != null) {
            if(response.sodO_LIST.length > 0) {
              this.sodoEditTable.setList(response.sodO_LIST)
            }
          }
          if(response.mortgagE_LIST != null) {
            if(response.mortgagE_LIST.length >0) {
              this.mortgageEditTable.setList(response.mortgagE_LIST)
            }
          }
          this.inputModel.owN_LIST = []
          this.inputModel.cooperatE_LIST = []
          this.inputModel.propertY_LIST = []
          this.inputModel.exploitatioN_LIST = []
          this.inputModel.registratioN_LIST = []
          this.inputModel.progresS_LIST = []

          this.inputModel.deleteD_OWN_ID_LIST = []
          this.inputModel.deleteD_COOPERATE_ID_LIST = []
          this.inputModel.deleteD_PROPERTY_ID_LIST = []
          this.inputModel.deleteD_EXPLOITATION_ID_LIST = []
          this.inputModel.deleteD_USE_REGISTRATION_ID_LIST = []
          this.inputModel.deleteD_PROGRESS_ID_LIST = []
          this.inputModel.deletE_FILE_ID_LIST = []
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
    this.allCodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.PROJECT_TYPE, "")
    .subscribe(response =>{
        this.projectTypeList = response
        this.updateView();
    })
    this.allCodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.PROJECT_COMPLETE_STATUS, "")
    .subscribe(response =>{
        this.projectCompleteStatus = response
        this.updateView();
    })
    this.allCodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.ENTITY_TYPE, "")
    .subscribe(response =>{
        this.entityTypeList = response
        this.updateView();
    })
    this.allCodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.LEGAL_STATUS_PROJECT_STATUS, "")
    .subscribe(response =>{
        this.projectStatus = response
        this.updateView();
    })
    this.allCodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.OWNER_TYPE, "")
    .subscribe(response =>{
        this.ownerTypeList = response
        this.updateView();
    })
  }

  getInputField() {
    this._comboboxService.getComboboxData(ProvinceField.class, ProvinceField.attribute).subscribe(response=>{
        this.provinceList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(InvestorField.class, InvestorField.attribute).subscribe(response=>{
        this.investorList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(ShareholderField.class, ShareholderField.attribute).subscribe(response=>{
        this.shareholderList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(EmployeeField.class, EmployeeField.attribute).subscribe(response=>{
        this.employeeList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(PartnerField.class, PartnerField.attribute).subscribe(response=>{
        this.partnerList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(LandAreaField.class, LandAreaField.attribute).subscribe(response=>{
        this.landAreaList = response
        this.updateView()
    })
    this._comboboxService.getComboboxData(DepartmentField.class, DepartmentField.attribute).subscribe(response=>{
        this.departmentList = response
        this.updateView()
    })
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
          this.inputModel.deletE_FILE_ID_LIST.push(this.uploadedFile.filE_ID)
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

  uploadFile(files: any, item) {
    var oldFile = files.oldFile
    if(oldFile.iS_CHANGED) {
        this.inputModel.deletE_FILE_ID_LIST.push(oldFile.filE_ID)
    }
    this.updateView()
  }

  removeFile(files: any, item) {
    var oldFile = files.oldFile
    if(oldFile.iS_CHANGED) {
        this.inputModel.deletE_FILE_ID_LIST.push(oldFile.filE_ID)
    }
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
          this.progressEditTable.allData.forEach(element=> {
            this.inputModel.progresS_LIST.push(new REA_PROJECT_PROGRESS_ENTITY(element))
          })
          this.propertyEditTable.allData.forEach(element=> {
            this.inputModel.propertY_LIST.push(new REA_PROJECT_PROPERTY_ENTITY(element))
          })
          this.ownStructureEditTable.allData.forEach(element=> {
            this.inputModel.owN_LIST.push(new REA_PROJECT_OWN_STRUCTURE_ENTITY(element))
          })
          this.registrationEditTable.allData.forEach(element=> {
            this.inputModel.registratioN_LIST.push(new REA_USE_REGISTRATION_ENTITY(element))
          })
          this.exploitationEditTable.allData.forEach(element=> {
            this.inputModel.exploitatioN_LIST.push(new REA_PROJECT_EXPLOITATION_ENTITY(element))
          })
          this.cooperateStructureEditTable.allData.forEach(element=> {
            this.inputModel.cooperatE_LIST.push(new REA_PROJECT_COOPERATE_STRUCTURE_ENTITY(element))
          })
          console.log(this.inputModel)

          if (!this.projecT_ID) {
              this.inputModel.makeR_ID = this.appSession.user.userName;
              this.projectService.rEA_PROJECT_Ins(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0' && response.result != null) {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.addNewSuccess();
                      }
                  });
          }
          else {
              this.projectService.rEA_PROJECT_Upd(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0' && response.result != null) {
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
      this.navigatePassParam('/app/admin/project', null, undefined);
  }

  onAdd(): void {
  }

  onUpdate(item: REA_PROJECT_ENTITY): void {
  }

  onDelete(item: REA_PROJECT_ENTITY): void {
  }

  onApprove(item: REA_PROJECT_ENTITY): void {
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
                  this.projectService.rEA_PROJECT_App(this.inputModel.id, currentUserName, "")
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
                this.projectService.rEA_PROJECT_Rej(this.inputModel.id, currentUserName, rejectReason)
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
                this.projectService.rEA_PROJECT_Can(this.inputModel.id, currentUserName, revokeReason)
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

  onViewDetail(item: REA_PROJECT_ENTITY): void {
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

  onAccess(item: REA_PROJECT_ENTITY): void {
  }
  onApproveKSS(item: REA_PROJECT_ENTITY): void {
  }
  onAccessStorekeepers(item: REA_PROJECT_ENTITY): void {
  }
  onApproveDeputy(item: REA_PROJECT_ENTITY): void {
  }
  onApproveKhoi(item: REA_PROJECT_ENTITY): void {
  }
  onFinishCheck(item: REA_PROJECT_ENTITY): void {
  }

  onSelectProjectType(value){
    if(value.cdval != 'RL') {
        this.inputModel.id = ""
    }
    this.updateView()
  }
  onSelectEntityType(value: string) {
    this.updateView()
  }
  
  onSelectRea(value) {
    this.inputModel.id = value.id
  }

}
