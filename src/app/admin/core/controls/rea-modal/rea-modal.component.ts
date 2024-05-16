import { ViewEncapsulation, Injector, Component, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { ComponentBase } from "@app/ultilities/component-base";
import { PopupFrameComponent } from "../popup-frames/popup-frame.component";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import { PropertyInformationServiceProxy, REA_PROPERTY_INFORMATION_ENTITY, PropertyInfoSearchDto, PropertyInfoSearchResultDto, AllCodeServiceProxy, ComboboxServiceProxy } from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { AuthStatusConsts } from "../../ultils/consts/AuthStatusConsts";
import { RecordStatusConsts } from "../../ultils/consts/RecordStatusConsts";
import { PopupBaseComponent } from "../../ultils/popup-base.component";
import { PopupBaseComponent2 } from "../../ultils/popup-base2.component";
import { InvestorField, PropertyTypeField, PropertyTypeNameField } from "../../ultils/consts/ComboboxConsts";

@Component({
    selector: "rea-modal",
    templateUrl: "./rea-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ReaModalComponent extends PopupBaseComponent2<PropertyInfoSearchResultDto, PropertyInfoSearchDto> {
    constructor(injector: Injector,
        private propertyService: PropertyInformationServiceProxy,
        private allCodeService: AllCodeServiceProxy,
        private _comboboxService: ComboboxServiceProxy,

    ) {
        super(injector);
        this.filterInput = new PropertyInfoSearchDto();
    }

    // Gắn cờ để có được search tất cả hay không : SearchAllFlag = true
    @Input() searchAllFlag: boolean = false;

    initComboFromApi(){
        this.propertyService.searchPropertyInfo(this.getFillterForCombobox()).subscribe(result => {
            this.listProperty = result.items;
            this.updateView();
        });
    }


    @Input() showColPotential: boolean = true
    @Input() showColAuthStatus: boolean = true

    listProperty: PropertyInfoSearchResultDto[];
    tempList = []
    propertyType
    propertyLevel
    propertyTypeName
    companyManagement
    

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

        var result = await this.propertyService.searchPropertyInfo(this.filterInputSearch)
            .pipe(finalize(() => this.hideTableLoading())).toPromise();

        if (checkAll) {
            var item = "";
            this.selectedItems = result.items;
        }
        else {
            this.dataTable.records = result.items;
            this.dataTable.totalRecordsCount = result.totalCount;
            // this.filterInputSearch.totalCount = result.totalCount;
        }

        return result;
    }

    getInputField(){
        this._comboboxService.getComboboxData(PropertyTypeField.class, PropertyTypeField.attribute).subscribe(response=>{
            this.propertyType = response
            this.updateView()
        })
        this._comboboxService.getComboboxData(PropertyTypeNameField.class, PropertyTypeNameField.attribute).subscribe(response=>{
            this.propertyTypeName = response
            this.updateView()
        })
        this._comboboxService.getComboboxData(InvestorField.class, InvestorField.attribute).subscribe(response=>{
            this.companyManagement = response
            this.updateView()
        })
    }
}
