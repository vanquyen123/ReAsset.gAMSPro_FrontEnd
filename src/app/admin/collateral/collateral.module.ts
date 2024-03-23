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
import { OutsideShareholderComponent } from "./outside-shareholder/outside-shareholder.component";
import { OutsideShareholderEditComponent } from "./outside-shareholder/outside-shareholder-edit.component";
import { AuthorizedPersonComponent } from './authorized-person/authorized-person.component';
import { AuthorizedPersonEditComponent } from "./authorized-person/authorized-person-edit.component";
import { OwnerComponent } from './owner/owner.component';
import { OwnerEditComponent } from "./owner/owner-edit.component";
import { ContractComponent } from './contract/contract.component';
import { ContractEditComponent } from "./contract/contract-edit.component";

@NgModule({
    imports: [
        ...commonDeclarationImports,
        collateralRoutingModule,
        BsDropdownModule.forRoot(),
        collateralServiceProxyModule,
    ],
    declarations: [
    OutsideShareholderComponent,
    OutsideShareholderEditComponent,
    AuthorizedPersonComponent,
    AuthorizedPersonEditComponent,
    OwnerComponent,
    OwnerEditComponent,
    ContractComponent,
    ContractEditComponent,
    ],
    exports: [],
    providers: [],
})
export class collateralModule { }
