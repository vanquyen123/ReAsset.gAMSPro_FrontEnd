import { NgModule } from "@angular/core";
import { commonDeclarationImports } from "../core/ultils/CommonDeclarationModule";
import { collateralRoutingModule } from "./collateral-routing.module";
import { collateralServiceProxyModule } from "./collateral-service-proxy.module";

import {
    BsDropdownDirective,
    BsDropdownModule,
    BsDatepickerConfig,
    BsDaterangepickerConfig,
    BsLocaleService,
    BsDropdownConfig,
} from "ngx-bootstrap";

import { CreateOrEditUserModalComponent } from "../zero-base/users/create-or-edit-user-modal.component";
import { EditUserPermissionsModalComponent } from "../zero-base/users/edit-user-permissions-modal.component";

@NgModule({
    imports: [
        ...commonDeclarationImports,
        collateralRoutingModule,
        BsDropdownModule.forRoot(),
        collateralServiceProxyModule,
    ],
    declarations: [


      
    ],
    exports: [],
    providers: [],
})
export class collateralModule { }
