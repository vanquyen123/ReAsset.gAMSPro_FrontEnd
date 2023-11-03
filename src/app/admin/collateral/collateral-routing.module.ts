import { NgModule } from "@angular/core";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { EditPageState } from "@app/ultilities/enum/edit-page-state";
import { OutsideShareholderComponent } from "./outside-shareholder/outside-shareholder.component";
import { OutsideShareholderEditComponent } from "./outside-shareholder/outside-shareholder-edit.component";


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: "",
                children: [
                    //quản ly ke
                    {path: "outside-shareholder", component: OutsideShareholderComponent, data: { permission: 'Pages.Administration.OutsideShareholder' }},
                    {path: "outside-shareholder-add", component: OutsideShareholderEditComponent, data: { permission: 'Pages.Administration.OutsideShareholder.Create', editPageState: EditPageState.add }},
                    {path: "outside-shareholder-edit", component: OutsideShareholderEditComponent, data: { permission: 'Pages.Administration.OutsideShareholder.Edit', editPageState: EditPageState.edit }},
                    {path: "outside-shareholder-view", component: OutsideShareholderEditComponent, data: { permission: 'Pages.Administration.OutsideShareholder.View', editPageState: EditPageState.viewDetail }}
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
