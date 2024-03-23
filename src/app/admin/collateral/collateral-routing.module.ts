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
