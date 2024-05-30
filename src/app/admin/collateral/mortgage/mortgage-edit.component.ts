import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { BranchServiceProxy, CM_ALLCODE_ENTITY, CM_BRANCH_ENTITY, UltilityServiceProxy, AllCodeServiceProxy, REA_MORTGAGE_ENTITY, MortgageServiceProxy, REA_MORTGAGE_ITEM_ENTITY, REA_MORTGAGE_SHARE_ENTITY, REA_MORTGAGE_RELEASE_HISTORY_ENTITY, REA_VALUATION_ENTITY } from '@shared/service-proxies/service-proxies';
import { IUiAction } from '@app/ultilities/ui-action';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { finalize } from 'rxjs/operators';
import { EditableTableComponent } from '@app/admin/core/controls/editable-table/editable-table.component';

@Component({
  templateUrl: './mortgage-edit.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class MortgageEditComponent extends DefaultComponentBase implements OnInit, IUiAction<REA_MORTGAGE_ENTITY>, AfterViewInit {

  constructor(
    injector: Injector,
    private ultilityService: UltilityServiceProxy,
    private mortgageService: MortgageServiceProxy,
    private allCodeService: AllCodeServiceProxy,
    ) { 
    super(injector);
    this.editPageState = this.getRouteData('editPageState');
    this.mortgage_ID = this.getRouteParam('mortgage');
    this.inputModel.id = this.mortgage_ID;
    this.initFilter();
    this.initCombobox();
    this.initIsApproveFunct();
  }
  
  @ViewChild('editForm') editForm: ElementRef;
  @ViewChild('projectEditTable') projectEditTable: EditableTableComponent<REA_MORTGAGE_ITEM_ENTITY>;
  @ViewChild('landEditTable') landEditTable: EditableTableComponent<REA_MORTGAGE_ITEM_ENTITY>;
  @ViewChild('sodoEditTable') sodoEditTable: EditableTableComponent<REA_MORTGAGE_ITEM_ENTITY>;
  @ViewChild('assetEditTable') assetEditTable: EditableTableComponent<REA_MORTGAGE_ITEM_ENTITY>;
  @ViewChild('shareEditTable') shareEditTable: EditableTableComponent<REA_MORTGAGE_SHARE_ENTITY>;
  @ViewChild('releaseHistoryEditTable') releaseHistoryEditTable: EditableTableComponent<REA_MORTGAGE_RELEASE_HISTORY_ENTITY>;
  @ViewChild('projectModal') projectModal;
  @ViewChild('landAreaModal') landAreaModal;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: REA_MORTGAGE_ENTITY = new REA_MORTGAGE_ENTITY();
    filterInput: REA_MORTGAGE_ENTITY;
    isApproveFunct: boolean;
    mortgage_ID: string;
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
          this.appToolbar.setRole('Mortgage', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          break;
      case EditPageState.edit:
          this.appToolbar.setRole('Mortgage', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getMortgage();
          break;
      case EditPageState.viewDetail:
          this.appToolbar.setRole('Mortgage', false, false, false, false, false, false, true, false);
          this.appToolbar.setEnableForViewDetailPage();
          this.getMortgage();
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

  addNewProject(){
    var item = new REA_MORTGAGE_ITEM_ENTITY();
    item.valuation = new REA_VALUATION_ENTITY();
    item.iS_NEW = true;
    item.iS_CHANGED = false;
    this.projectModal.show()
    this.projectEditTable.pushItem(item);
    this.updateView();
  }

  addNewLand(){
    var item = new REA_MORTGAGE_ITEM_ENTITY();
    item.valuation = new REA_VALUATION_ENTITY();
    item.iS_NEW = true;
    item.iS_CHANGED = false;
    this.landAreaModal.show()
    this.landEditTable.pushItem(item);
    this.updateView();
  }

  addNewSodo(){
    var item = new REA_MORTGAGE_ITEM_ENTITY();
    item.valuation = new REA_VALUATION_ENTITY();
    item.iS_NEW = true;
    item.iS_CHANGED = false;
    this.sodoEditTable.pushItem(item);
    this.updateView();
  }

  addNewAsset(){
    var item = new REA_MORTGAGE_ITEM_ENTITY();
    item.valuation = new REA_VALUATION_ENTITY();
    item.iS_NEW = true;
    item.iS_CHANGED = false;
    this.assetEditTable.pushItem(item);
    this.updateView();
  }

  addNewShare(){
    var item = new REA_MORTGAGE_SHARE_ENTITY();
    item.valuation = new REA_VALUATION_ENTITY();
    this.shareEditTable.pushItem(item);
    this.updateView();
  }

  addNewReleaseHistory(){
    var item = new REA_MORTGAGE_RELEASE_HISTORY_ENTITY();
    this.releaseHistoryEditTable.pushItem(item);
    this.updateView();
  }

  getMortgage() {
      this.mortgageService.rEA_MORTGAGE_ById(this.inputModel.id).subscribe(response => {
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
          if (!this.mortgage_ID) {
              this.mortgageService.rEA_MORTGAGE_Ins(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage("Lỗi");
                      }
                      else {
                          this.addNewSuccess();
                          if (!this.isApproveFunct) {
                              this.mortgageService.rEA_MORTGAGE_App(response.id, this.appSession.user.userName, "")
                                  .pipe(finalize(() => { this.saving = false; }))
                                  .subscribe((response) => {
                                      if (response.result != '0') {
                                          this.showErrorMessage("Lỗi");
                                      }
                                  });
                          }
                      }
                  });
          }
          else {
              this.mortgageService.rEA_MORTGAGE_Upd(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage("Lỗi");
                      }
                      else {
                          this.updateSuccess();
                          if (!this.isApproveFunct) {
                              this.mortgageService.rEA_MORTGAGE_App(this.inputModel.id, this.appSession.user.userName, "")
                                  .pipe(finalize(() => { this.saving = false; }))
                                  .subscribe((response) => {
                                      if (response.result != '0') {
                                          this.showErrorMessage("Lỗi");
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
      this.navigatePassParam('/app/admin/mortgage', null, undefined);
  }

  onAdd(): void {
  }

  onUpdate(item: REA_MORTGAGE_ENTITY): void {
  }

  onDelete(item: REA_MORTGAGE_ENTITY): void {
  }

  onApprove(item: REA_MORTGAGE_ENTITY): void {
      if (!this.inputModel.id) {
          return;
      }
      var currentUserName = this.appSession.user.userName;
      if (currentUserName == this.inputModel.makeR_ID) {
        this.showErrorMessage(this.l('ApproveFailed'));
        return;
    }
      this.message.confirm(
          this.l('ApproveWarningMessage', this.l(this.inputModel.mortgagE_NAME)),
          this.l('AreYouSure'),
          (isConfirmed) => {
              if (isConfirmed) {
                  this.saving = true;
                  this.mortgageService.rEA_MORTGAGE_App(this.inputModel.id, currentUserName, "")
                      .pipe(finalize(() => { this.saving = false; }))
                      .subscribe((response) => {
                          if (response.result != '0') {
                              this.showErrorMessage("Lỗi");
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

  onViewDetail(item: REA_MORTGAGE_ENTITY): void {
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
