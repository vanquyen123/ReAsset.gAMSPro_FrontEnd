import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { ReaAllCode } from '@app/ultilities/enum/all-codes';
import { AllCodeServiceProxy, BranchServiceProxy, CM_BRANCH_ENTITY, CONTRACT_ANNEX_ENTITY, CONTRACT_ITEM_ENTITY, CONTRACT_ITEM_RENTAL_PRICE_ENTITY, ContractServiceProxy, REA_ALLCODE_ENTITY, REA_CONTRACT_ENTITY, SessionServiceProxy, UltilityServiceProxy } from '@shared/service-proxies/service-proxies';
import { IUiAction } from '@app/ultilities/ui-action';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { finalize } from 'rxjs/operators';
import { EditableTableComponent } from '@app/admin/core/controls/editable-table/editable-table.component';
import * as moment from 'moment';

@Component({
  // selector: 'app-outside-shareholder-edit',
  templateUrl: './good-received-note-edit.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class GoodReceivedNoteEditComponent extends DefaultComponentBase implements OnInit, IUiAction<REA_CONTRACT_ENTITY>, AfterViewInit {

  constructor(
    injector: Injector,
    private ultilityService: UltilityServiceProxy,
    private contractService: ContractServiceProxy,
    private branchService: BranchServiceProxy,
    private sessionService: SessionServiceProxy,
    private allcodeService: AllCodeServiceProxy
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
  @ViewChild('proposedAssetEditTable') proposedAssetEditTable: EditableTableComponent<CONTRACT_ANNEX_ENTITY>;
  @ViewChild('otherCostEditTable') otherCostEditTable: EditableTableComponent<CONTRACT_ANNEX_ENTITY>;
  @ViewChild('guaranteeEditTable') guaranteeEditTable: EditableTableComponent<CONTRACT_ANNEX_ENTITY>;

    EditPageState = EditPageState;
    ReaAllCode = ReaAllCode;
    editPageState: EditPageState;

    inputModel: REA_CONTRACT_ENTITY = new REA_CONTRACT_ENTITY();
    filterInput: REA_CONTRACT_ENTITY;
    isApproveFunct: boolean;
    contract_ID: string;
    checkIsActive = false;
    partners = [
        {
            name: "Partner 1",
            value: "partner 1"
        },
        {
            name: "Partner 2",
            value: "partner 2"
        }
    ];
    tempList = [{value: "value"}]

  get disableInput(): boolean {
    return this.editPageState == EditPageState.viewDetail;
  }
  isShowError = false;

  ngOnInit() {
    this.getAllTypes();
    switch (this.editPageState) {
      case EditPageState.add:
          this.inputModel.recorD_STATUS = RecordStatusConsts.Active;
          this.appToolbar.setRole('Contract', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getInitInformation();
          break;
      case EditPageState.edit:
          this.appToolbar.setRole('Contract', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          this.getContract();
          break;
      case EditPageState.viewDetail:
          this.appToolbar.setRole('Contract', false, false, false, false, false, false, true, false);
          this.appToolbar.setEnableForViewDetailPage();
          this.getContract();
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

  addNewOtherCost() {
    var item = new CONTRACT_ANNEX_ENTITY();
    this.otherCostEditTable.pushItem(item)
    this.updateView();
  }

  addNewGuarantee() {
    var item = new CONTRACT_ANNEX_ENTITY();
    this.guaranteeEditTable.pushItem(item)
    this.updateView();
  }

  getInitInformation() {
    this.sessionService.getCurrentLoginInformations().subscribe(response=>{
        this.inputModel.makeR_ID = response.user.userName;
        this.updateView()
    })
    
    this.inputModel.creatE_DT = moment();
    this.inputModel.totaL_REVENUE = 0;
    this.updateView();
  }
  
  getContract() {
      this.contractService.rEA_CONTRACT_ById(this.inputModel.id).subscribe(response => {
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
    // this.allcodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.CONTRACT_ITEM_TYPE, "")
    // .subscribe(response =>{
    //     this.itemTypes = response
    // })

    // this.allcodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.RENTAL_PRICE_TYPE, "")
    // .subscribe(response =>{
    //     this.rentalPriceTypes = response
    // })

    // this.allcodeService.rEA_ALLCODE_GetByCDNAME(ReaAllCode.CONTRACT_STATUS, "")
    // .subscribe(response =>{
    //     this.contractStatus = response
    // })
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
      console.log((this.editForm as any).form)
      if ((this.editForm as any).form.invalid) {
          this.isShowError = true;
          this.showErrorMessage(this.l('FormInvalid'));
          this.updateView();
          return;
      }
      if (this.editPageState != EditPageState.viewDetail) {
          this.saving = true;
          this.inputModel.makeR_ID = this.appSession.user.userName;
          if (!this.contract_ID) {
              this.contractService.rEA_CONTRACT_Ins(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.addNewSuccess();
                          if (!this.isApproveFunct) {
                              this.contractService.rEA_CONTRACT_App(response.id, this.appSession.user.userName, "")
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
              this.contractService.rEA_CONTRACT_Upd(this.inputModel).pipe(finalize(() => { this.saving = false; }))
                  .subscribe((response) => {
                      if (response.result != '0') {
                          this.showErrorMessage(response.errorDesc);
                      }
                      else {
                          this.updateSuccess();
                          if (!this.isApproveFunct) {
                              this.contractService.rEA_CONTRACT_App(this.inputModel.id, this.appSession.user.userName, "")
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
      this.navigatePassParam('/app/admin/good-received-note', null, undefined);
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

  onSelect(value: string){
      // this.inputModel.brancH_ID = branch.brancH_ID;
      // this.inputModel.brancH_NAME = branch.brancH_NAME;
      // setTimeout(()=>{
      //     this.updateView();
      // })
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

  onSelectItemType(itemType: REA_ALLCODE_ENTITY){
    // this.inputModel.owneR_TYPE_NAME = ownerType.content;
  }

}
