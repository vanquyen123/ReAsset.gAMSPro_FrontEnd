import { NgModule } from "@angular/core";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { EditPageState } from "@app/ultilities/enum/edit-page-state";
import { OutsideShareholderComponent } from "./outside-shareholder/outside-shareholder.component";
import { OutsideShareholderEditComponent } from "./outside-shareholder/outside-shareholder-edit.component";
import { AuthorizedPersonComponent } from "./authorized-person/authorized-person.component";
import { AuthorizedPersonEditComponent } from "./authorized-person/authorized-person-edit.component";
import { OwnerComponent } from "./owner/owner.component";
import { OwnerEditComponent } from "./owner/owner-edit.component";
import { ContractComponent } from "./contract/contract.component";
import { ContractEditComponent } from "./contract/contract-edit.component";
import { MortgageComponent } from "./mortgage/mortgage.component";
import { MortgageEditComponent } from "./mortgage/mortgage-edit.component";
import { ShareholderComponent } from "./shareholder/shareholder.component";
import { ShareholderEditComponent } from "./shareholder/shareholder-edit.component";
import { AssetLookupComponent } from "./asset-lookup/asset-lookup.component";
import { AssetLookupEditComponent } from "./asset-lookup/asset-lookup-edit.component";
import { GoodReceivedNoteComponent } from "./good-received-note/good-received-note.component";
import { GoodReceivedNoteEditComponent } from "./good-received-note/good-received-note-edit.component";
import { SodoComponent } from "./sodo/sodo.component";
import { SodoEditComponent } from "./sodo/sodo-edit.component";
import { LandAreaComponent } from "./land-area/land-area.component";
import { LandAreaEditComponent } from "./land-area/land-area-edit.component";
import { InvestmentPropertyComponent } from "./investment-property/investment-property.component";
import { InvestmentPropertyEditComponent } from "./investment-property/investment-property-edit.component";
import { ProjectComponent } from "./project/project.component";
import { ProjectEditComponent } from "./project/project-edit.component";
import { CompanyComponent } from "./company/company.component";
import { CompanyEditComponent } from "./company/company-edit.component";
import { ForecastComponent } from "./forecast/forecast.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: "",
                children: [
                    //co dong ngoai
                    {path: "outside-shareholder", component: OutsideShareholderComponent, data: { permission: 'Pages.Administration.OutsideShareholder' }},
                    {path: "outside-shareholder-add", component: OutsideShareholderEditComponent, data: { permission: 'Pages.Administration.OutsideShareholder.Create', editPageState: EditPageState.add }},
                    {path: "outside-shareholder-edit", component: OutsideShareholderEditComponent, data: { permission: 'Pages.Administration.OutsideShareholder.Edit', editPageState: EditPageState.edit }},
                    {path: "outside-shareholder-view", component: OutsideShareholderEditComponent, data: { permission: 'Pages.Administration.OutsideShareholder.View', editPageState: EditPageState.viewDetail }},
                    //nguoi duoc uy quyen
                    {path: "authorized-people", component: AuthorizedPersonComponent, data: { permission: 'Pages.Administration.AuthorizedPeople' }},
                    {path: "authorized-people-add", component: AuthorizedPersonEditComponent, data: { permission: 'Pages.Administration.AuthorizedPeople.Create', editPageState: EditPageState.add }},
                    {path: "authorized-people-edit", component: AuthorizedPersonEditComponent, data: { permission: 'Pages.Administration.AuthorizedPeople.Edit', editPageState: EditPageState.edit }},
                    {path: "authorized-people-view", component: AuthorizedPersonEditComponent, data: { permission: 'Pages.Administration.AuthorizedPeople.View', editPageState: EditPageState.viewDetail }},
                    //chu so huu
                    {path: "owner", component: OwnerComponent, data: { permission: 'Pages.Administration.Owner' }},
                    {path: "owner-add", component: OwnerEditComponent, data: { permission: 'Pages.Administration.Owner.Create', editPageState: EditPageState.add }},
                    {path: "owner-edit", component: OwnerEditComponent, data: { permission: 'Pages.Administration.Owner.Edit', editPageState: EditPageState.edit }},
                    {path: "owner-view", component: OwnerEditComponent, data: { permission: 'Pages.Administration.Owner.View', editPageState: EditPageState.viewDetail }},
                    //contract
                    {path: "contract", component: ContractComponent},
                    {path: "contract-add", component: ContractEditComponent, data: { editPageState: EditPageState.add }},
                    {path: "contract-edit", component: ContractEditComponent, data: { editPageState: EditPageState.edit }},
                    {path: "contract-view", component: ContractEditComponent, data: { editPageState: EditPageState.viewDetail }},
                    //the chap
                    {path: "mortgage", component: MortgageComponent},
                    {path: "mortgage-add", component: MortgageEditComponent, data: { editPageState: EditPageState.add }},
                    {path: "mortgage-edit", component: MortgageEditComponent, data: { editPageState: EditPageState.edit }},
                    {path: "mortgage-view", component: MortgageEditComponent, data: { editPageState: EditPageState.viewDetail }},
                    //co phan
                    {path: "shareholder", component: ShareholderComponent},
                    {path: "shareholder-add", component: ShareholderEditComponent, data: { editPageState: EditPageState.add }},
                    {path: "shareholder-edit", component: ShareholderEditComponent, data: { editPageState: EditPageState.edit }},
                    {path: "shareholder-view", component: ShareholderEditComponent, data: { editPageState: EditPageState.viewDetail }},
                    //tra cuu tai san
                    {path: "asset-lookup", component: AssetLookupComponent},
                    {path: "asset-lookup-add", component: AssetLookupEditComponent, data: { editPageState: EditPageState.add }},
                    {path: "asset-lookup-edit", component: AssetLookupEditComponent, data: { editPageState: EditPageState.edit }},
                    {path: "asset-lookup-view", component: AssetLookupEditComponent, data: { editPageState: EditPageState.viewDetail }},
                    //phieu nhap kho
                    {path: "good-received-note", component: GoodReceivedNoteComponent},
                    {path: "good-received-note-add", component: GoodReceivedNoteEditComponent, data: { editPageState: EditPageState.add }},
                    {path: "good-received-note-edit", component: GoodReceivedNoteEditComponent, data: { editPageState: EditPageState.edit }},
                    {path: "good-received-note-view", component: GoodReceivedNoteEditComponent, data: { editPageState: EditPageState.viewDetail }},
                    //so do
                    {path: "sodo", component: SodoComponent},
                    {path: "sodo-add", component: SodoEditComponent, data: { editPageState: EditPageState.add }},
                    {path: "sodo-edit", component: SodoEditComponent, data: { editPageState: EditPageState.edit }},
                    {path: "sodo-view", component: SodoEditComponent, data: { editPageState: EditPageState.viewDetail }},
                    //khu dat
                    {path: "land-area", component: LandAreaComponent},
                    {path: "land-area-add", component: LandAreaEditComponent, data: { editPageState: EditPageState.add }},
                    {path: "land-area-edit", component: LandAreaEditComponent, data: { editPageState: EditPageState.edit }},
                    {path: "land-area-view", component: LandAreaEditComponent, data: { editPageState: EditPageState.viewDetail }},
                    //BDS dau tu
                    {path: "investment-property", component: InvestmentPropertyComponent},
                    {path: "investment-property-add", component: InvestmentPropertyEditComponent, data: { editPageState: EditPageState.add }},
                    {path: "investment-property-edit", component: InvestmentPropertyEditComponent, data: { editPageState: EditPageState.edit }},
                    {path: "investment-property-view", component: InvestmentPropertyEditComponent, data: { editPageState: EditPageState.viewDetail }},
                    //du an
                    {path: "project", component: ProjectComponent},
                    {path: "project-add", component: ProjectEditComponent, data: { editPageState: EditPageState.add }},
                    {path: "project-edit", component: ProjectEditComponent, data: { editPageState: EditPageState.edit }},
                    {path: "project-view", component: ProjectEditComponent, data: { editPageState: EditPageState.viewDetail }},
                    //cong ty
                    {path: "company", component: CompanyComponent},
                    {path: "company-add", component: CompanyEditComponent, data: { editPageState: EditPageState.add }},
                    {path: "company-edit", component: CompanyEditComponent, data: { editPageState: EditPageState.edit }},
                    {path: "company-view", component: CompanyEditComponent, data: { editPageState: EditPageState.viewDetail }},
                    //du doan
                    {path: "forecast", component: ForecastComponent},
                ],
            },
        ]),
    ],
    exports: [RouterModule],
})
export class collateralRoutingModule {
    constructor(private router: Router) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scroll(0, 0);
            }
        });
    }
}
