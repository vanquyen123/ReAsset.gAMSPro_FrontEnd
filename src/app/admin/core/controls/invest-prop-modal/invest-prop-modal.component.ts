import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { ComponentBase } from "@app/ultilities/component-base";
import { PopupFrameComponent } from "../popup-frames/popup-frame.component";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import { PropertyInformationServiceProxy, AllCodeServiceProxy, ComboboxServiceProxy, REA_INVESTMENT_PROPERTY_SEARCH_DTO, REA_INVEST_PROPERTY_LOOKUP, ContractServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { AuthStatusConsts } from "../../ultils/consts/AuthStatusConsts";
import { RecordStatusConsts } from "../../ultils/consts/RecordStatusConsts";
import { PopupBaseComponent } from "../../ultils/popup-base.component";
import { PopupBaseComponent2 } from "../../ultils/popup-base2.component";
import { InvestorField, PartnerField, ProjectField, PropertyTypeField, PropertyTypeNameField } from "../../ultils/consts/ComboboxConsts";
import { ReaAllCode } from "@app/ultilities/enum/all-codes";

@Component({
    selector: "invest-prop-modal",
    templateUrl: "./invest-prop-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class InvestPropModalComponent extends PopupBaseComponent2<REA_INVEST_PROPERTY_LOOKUP, REA_INVESTMENT_PROPERTY_SEARCH_DTO> {
    constructor(injector: Injector,
        private allCodeService: AllCodeServiceProxy,
        private _comboboxService: ComboboxServiceProxy,
        private contractService: ContractServiceProxy,
    ) {
        super(injector);
        this.filterInput = new REA_INVESTMENT_PROPERTY_SEARCH_DTO();
    }

    // Gắn cờ để có được search tất cả hay không : SearchAllFlag = true
    @Input() searchAllFlag: boolean = false;

    initComboFromApi(){
        this.contractService.rEA_CONTRACT_SearchInvestmentProject(this.getFillterForCombobox()).subscribe(result => {
            this.listProperty = result;
            this.updateView();
        });
    }


    @Input() showColPotential: boolean = true
    @Input() showColAuthStatus: boolean = true

    listProperty: REA_INVEST_PROPERTY_LOOKUP[];
    projectList
    partnerList

    propertyStatus
    legalStatus
    GCNStatus
    

    async getResult(checkAll: boolean = false): Promise<any> {
        this.setSortingForFilterModel(this.filterInputSearch);

        // this.filterInputSearch.autH_STATUS = AuthStatusConsts.Approve;
        // this.filterInputSearch.recorD_STATUS = RecordStatusConsts.Active;

        // if (!this.filterInputSearch.brancH_LOGIN && this.searchAllFlag == false) {
        //     this.filterInputSearch.brancH_LOGIN = this.appSession.user.subbrId;
        // }

        // if (checkAll) {
        //     this.filterInputSearch.maxResultCount = -1;
        // }

        var result = await this.contractService.rEA_CONTRACT_SearchInvestmentProject(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading())).toPromise();

        if (checkAll) {
            var item = "";
            this.selectedItems = result;
        }
        else {
            this.dataTable.records = result;
            // this.dataTable.totalRecordsCount = result.totalCount;
            // this.filterInputSearch.totalCount = result.totalCount;
        }

        return result;
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
}
