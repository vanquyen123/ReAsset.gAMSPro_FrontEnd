import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { CM_ALLCODE_ENTITY, UltilityServiceProxy, AllCodeServiceProxy, REA_SODO_ENTITY, SodoServiceProxy, REA_SODO_CO_OWNER_ENTITY, REA_SODO_LAND_PLOT_ENTITY, REA_FILE_ENTITY, REA_SODO_STORE_LOCATION_ENTITY, REA_SODO_PAY_ENTITY, REA_SODO_COMPENSATION_ENTITY, REA_SODO_ADVANCE_PAYMENT_ENTITY, REA_SODO_BRIEF_1_ENTITY, REA_SODO_BRIEF_2_ENTITY, REA_SODO_BRIEF_3_ENTITY, REA_SODO_BRIEF_4_ENTITY, REA_SODO_BRIEF_5_ENTITY, SessionServiceProxy, REA_SODO_CONTRACT_ENTITY} from '@shared/service-proxies/service-proxies';
import { IUiAction } from '@app/ultilities/ui-action';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { finalize } from 'rxjs/operators';
import { EditableTableComponent } from '@app/admin/core/controls/editable-table/editable-table.component';

@Component({
  templateUrl: './sodo-edit.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class SodoEditComponent extends DefaultComponentBase implements OnInit, IUiAction<REA_SODO_ENTITY>, AfterViewInit {

  constructor(
    injector: Injector,
    private ultilityService: UltilityServiceProxy,
    private sodoService: SodoServiceProxy,
    private allCodeService: AllCodeServiceProxy,
    private sessionService: SessionServiceProxy,
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
  @ViewChild('landPlotInsideEditTable') landPlotInsideEditTable: EditableTableComponent<REA_SODO_LAND_PLOT_ENTITY>;
  @ViewChild('landPlotOutsideEditTable') landPlotOutsideEditTable: EditableTableComponent<REA_SODO_LAND_PLOT_ENTITY>;
  @ViewChild('fileEditTable') fileEditTable: EditableTableComponent<REA_FILE_ENTITY>;
  @ViewChild('payEditTable') payEditTable: EditableTableComponent<REA_SODO_PAY_ENTITY>;
  @ViewChild('storeLocationEditTable') storeLocationEditTable: EditableTableComponent<REA_SODO_STORE_LOCATION_ENTITY>;
  @ViewChild('compensationEditTable') compensationEditTable: EditableTableComponent<REA_SODO_COMPENSATION_ENTITY>;
  @ViewChild('advancePaymentEditTable') advancePaymentEditTable: EditableTableComponent<REA_SODO_ADVANCE_PAYMENT_ENTITY>;
//   @ViewChild('brief1EditTable') brief1EditTable: EditableTableComponent<REA_SODO_BRIEF_1_ENTITY>;
//   @ViewChild('brief2EditTable') brief2EditTable: EditableTableComponent<REA_SODO_BRIEF_2_ENTITY>;
//   @ViewChild('brief3EditTable') brief3EditTable: EditableTableComponent<REA_SODO_BRIEF_3_ENTITY>;
//   @ViewChild('brief4EditTable') brief4EditTable: EditableTableComponent<REA_SODO_BRIEF_4_ENTITY>;
//   @ViewChild('brief5EditTable') brief5EditTable: EditableTableComponent<REA_SODO_BRIEF_5_ENTITY>;
  @ViewChild('useRegistrationEditTable') useRegistrationEditTable: EditableTableComponent<REA_SODO_CO_OWNER_ENTITY>;//wait for entity

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: REA_SODO_ENTITY = new REA_SODO_ENTITY();
    filterInput: REA_SODO_ENTITY;
    isApproveFunct: boolean;
    sodo_ID: string;
    checkIsActive = false;
    tempList = [{value: "value"}]

  get disableInput(): boolean {
    return this.editPageState == EditPageState.viewDetail;
  }
  isShowError = false;

  ngOnInit() {
    switch (this.editPageState) {
      case EditPageState.add:
          this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
          this.appToolbar.setRole('Sodo', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getInitInformation();
          break;
      case EditPageState.edit:
          this.appToolbar.setRole('Sodo', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getSodo();
          break;
      case EditPageState.viewDetail:
          this.appToolbar.setRole('Sodo', false, false, false, false, false, false, true, false);
          this.appToolbar.setEnableForViewDetailPage();
          this.getSodo();
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

  addNewCoOwner(){
    var item = new REA_SODO_CO_OWNER_ENTITY();
    this.coOwnerEditTable.pushItem(item);
    this.updateView();
  }

  addLandPlotInside(){
    var item = new REA_SODO_LAND_PLOT_ENTITY();
    item.lanD_PLOT_IS_INSIDE = true;
    this.landPlotInsideEditTable.pushItem(item);
    this.updateView();
  }

  addLandPlotOutside(){
    var item = new REA_SODO_LAND_PLOT_ENTITY();
    item.lanD_PLOT_IS_INSIDE = false;
    this.landPlotOutsideEditTable.pushItem(item);
    this.updateView();
  }

  addNewFile(){
    var item = new REA_FILE_ENTITY();
    this.fileEditTable.pushItem(item);
    this.updateView();
  }

  addNewPay(){
    var item = new REA_SODO_PAY_ENTITY();
    this.payEditTable.pushItem(item);
    this.updateView();
  }

  addNewStoreLocation(){
    var item = new REA_SODO_STORE_LOCATION_ENTITY();
    this.storeLocationEditTable.pushItem(item);
    this.updateView();
  }

  addNewCompensation(){
    var item = new REA_SODO_COMPENSATION_ENTITY();
    this.compensationEditTable.pushItem(item);
    this.updateView();
  }

  addNewAdvancePayment(){
    var item = new REA_SODO_ADVANCE_PAYMENT_ENTITY();
    this.advancePaymentEditTable.pushItem(item);
    this.updateView();
  }

  addNewUseRegistration(){
    var item = new REA_SODO_CO_OWNER_ENTITY();
    this.useRegistrationEditTable.pushItem(item);
    this.updateView();
  }

  getInitInformation() {
    this.sessionService.getCurrentLoginInformations().subscribe(response=>{
        this.inputModel.makeR_ID = response.user.userName;
        this.updateView()
    })

    this.inputModel.contract = new REA_SODO_CONTRACT_ENTITY();
    this.inputModel.brieF_1 = new REA_SODO_BRIEF_1_ENTITY();
    this.inputModel.brieF_2 = new REA_SODO_BRIEF_2_ENTITY();
    this.inputModel.brieF_3 = new REA_SODO_BRIEF_3_ENTITY();
    this.inputModel.brieF_4 = new REA_SODO_BRIEF_4_ENTITY();
    this.inputModel.brieF_5 = new REA_SODO_BRIEF_5_ENTITY();
    
    this.updateView();
  }

  getSodo() {
      this.sodoService.rEA_SODO_ById(this.inputModel.id).subscribe(response => {
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
          if (!this.sodo_ID) {
              this.sodoService.rEA_SODO_Ins(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.addNewSuccess();
                          if (!this.isApproveFunct) {
                              this.sodoService.rEA_SODO_App(response.id, this.appSession.user.userName)
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
              this.sodoService.rEA_SODO_Upd(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.updateSuccess();
                          if (!this.isApproveFunct) {
                              this.sodoService.rEA_SODO_App(this.inputModel.id, this.appSession.user.userName)
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
      this.navigatePassParam('/app/admin/sodo', null, undefined);
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

}
