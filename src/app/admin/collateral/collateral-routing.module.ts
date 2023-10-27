import { NgModule } from "@angular/core";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { EditPageState } from "@app/ultilities/enum/edit-page-state";



@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: "",
                children: [
                    //quản ly ke
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
