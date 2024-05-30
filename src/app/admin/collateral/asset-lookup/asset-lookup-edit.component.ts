import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AllCodes } from '@app/ultilities/enum/all-codes';
import { BranchServiceProxy, CM_ALLCODE_ENTITY, CM_BRANCH_ENTITY, OwnerServiceProxy, REA_OWNER_ENTITY, UltilityServiceProxy, AllCodeServiceProxy } from '@shared/service-proxies/service-proxies';
import { IUiAction } from '@app/ultilities/ui-action';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { finalize } from 'rxjs/operators';
import { ModalDirective } from 'ngx-bootstrap';
import { EditableTableComponent } from '@app/admin/core/controls/editable-table/editable-table.component';

@Component({
  templateUrl: './asset-lookup-edit.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class AssetLookupEditComponent extends DefaultComponentBase implements OnInit, IUiAction<REA_OWNER_ENTITY>, AfterViewInit {

  constructor(
    injector: Injector,
    private ultilityService: UltilityServiceProxy,
    private ownerService: OwnerServiceProxy,
    private branchService: BranchServiceProxy,
    private allCodeService: AllCodeServiceProxy,
    ) { 
    super(injector);
    this.editPageState = this.getRouteData('editPageState');
    this.asset_Id = this.getRouteParam('owner');
    this.inputModel.owneR_ID = this.asset_Id;
    this.initFilter();
    this.initCombobox();
    this.initIsApproveFunct();
  }
  
  @ViewChild('editForm') editForm: ElementRef;
  @ViewChild('childAssetEditTable') childAssetEditTable: EditableTableComponent<REA_OWNER_ENTITY>;
  @ViewChild('ticketEditTable') ticketEditTable: EditableTableComponent<REA_OWNER_ENTITY>;
  @ViewChild('depreciationEditTable') depreciationEditTable: EditableTableComponent<REA_OWNER_ENTITY>;
  @ViewChild('useProcessEditTable') useProcessEditTable: EditableTableComponent<REA_OWNER_ENTITY>;
  @ViewChild('guaranteeEditTable') guaranteeEditTable: EditableTableComponent<REA_OWNER_ENTITY>;
  @ViewChild('repairRequestEditTable') repairRequestEditTable: EditableTableComponent<REA_OWNER_ENTITY>;
  @ViewChild('actualRepairEditTable') actualRepairEditTable: EditableTableComponent<REA_OWNER_ENTITY>;
  @ViewChild('liquidationEditTable') liquidationEditTable: EditableTableComponent<REA_OWNER_ENTITY>;

    EditPageState = EditPageState;
    AllCodes = AllCodes;
    editPageState: EditPageState;

    inputModel: REA_OWNER_ENTITY = new REA_OWNER_ENTITY();
    filterInput: REA_OWNER_ENTITY;
    isApproveFunct: boolean;
    asset_Id: string;
    checkIsActive = false;
    ownerTypes: CM_ALLCODE_ENTITY[];

  get disableInput(): boolean {
    return this.editPageState == EditPageState.viewDetail;
  }
  isShowError = false;
  branchs: CM_BRANCH_ENTITY[];
  tempList = [{value: "value"}]

  ngOnInit() {
    switch (this.editPageState) {
      case EditPageState.add:
          this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
          this.appToolbar.setRole('Owner', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getNextId();
          break;
      case EditPageState.edit:
          this.appToolbar.setRole('Owner', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getOwner();
          break;
      case EditPageState.viewDetail:
          this.appToolbar.setRole('Owner', false, false, false, false, false, false, true, false);
          this.appToolbar.setEnableForViewDetailPage();
          this.getOwner();
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

  getNextId() {
    this.ownerService.rEA_OWNER_Get_Id().subscribe(response=> {
        this.inputModel.owneR_ID = response.OWNER_NEXT_ID;
        this.updateView();
    });
  }

  getOwner() {
      this.ownerService.rEA_OWNER_ById(this.inputModel.owneR_ID).subscribe(response => {
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
          if (!this.asset_Id) {
              this.ownerService.rEA_OWNER_Ins(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage("Lỗi");
                      }
                      else {
                          this.addNewSuccess();
                          if (!this.isApproveFunct) {
                              this.ownerService.rEA_OWNER_App(response.id, this.appSession.user.userName)
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
              this.ownerService.rEA_OWNER_Upd(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage("Lỗi");
                      }
                      else {
                          this.updateSuccess();
                          if (!this.isApproveFunct) {
                              this.ownerService.rEA_OWNER_App(this.inputModel.owneR_ID, this.appSession.user.userName)
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
      this.navigatePassParam('/app/admin/asset-lookup', null, undefined);
  }

  onAdd(): void {
  }

  onUpdate(item: REA_OWNER_ENTITY): void {
  }

  onDelete(item: REA_OWNER_ENTITY): void {
  }

  onApprove(item: REA_OWNER_ENTITY): void {
      if (!this.inputModel.owneR_ID) {
          return;
      }
      var currentUserName = this.appSession.user.userName;
      if (currentUserName == this.inputModel.makeR_ID) {
        this.showErrorMessage(this.l('ApproveFailed'));
        return;
    }
      this.message.confirm(
          this.l('ApproveWarningMessage', this.l(this.inputModel.owneR_NAME)),
          this.l('AreYouSure'),
          (isConfirmed) => {
              if (isConfirmed) {
                  this.saving = true;
                  this.ownerService.rEA_OWNER_App(this.inputModel.owneR_ID, currentUserName)
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

  onViewDetail(item: REA_OWNER_ENTITY): void {
  }

  onSave(): void {
      this.saveInput();
  }

  onSearch(): void {
  }

  onResetSearch(): void {
  }

  @ViewChild('popupFrameModal') modal: ModalDirective;
  imgSrc: string = ""

  show(event) {
    const imgElem = event.target;
    var target = event.target || event.srcElement || event.currentTarget;
    var srcAttr = target.attributes.src;
    this.imgSrc = srcAttr.nodeValue;
    this.updateView();
    this.modal.show();
  }

  close() {
    this.modal.hide();
  }
}
