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
    BsDatepickerModule,
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
import { MortgageComponent } from './mortgage/mortgage.component';
import { MortgageEditComponent } from "./mortgage/mortgage-edit.component";
import { ShareholderComponent } from './shareholder/shareholder.component';
import { ShareholderEditComponent } from "./shareholder/shareholder-edit.component";
import { AssetLookupComponent } from './asset-lookup/asset-lookup.component';
import { AssetLookupEditComponent } from "./asset-lookup/asset-lookup-edit.component";
import { GoodReceivedNoteComponent } from './good-received-note/good-received-note.component';
import { GoodReceivedNoteEditComponent } from "./good-received-note/good-received-note-edit.component";
import { SodoComponent } from './sodo/sodo.component';
import { SodoEditComponent } from "./sodo/sodo-edit.component";
import { LandAreaComponent } from './land-area/land-area.component';
import { LandAreaEditComponent } from "./land-area/land-area-edit.component";
import { InvestmentPropertyComponent } from './investment-property/investment-property.component';
import { InvestmentPropertyEditComponent } from "./investment-property/investment-property-edit.component";
import { ProjectComponent } from './project/project.component';
import { ProjectEditComponent } from "./project/project-edit.component";
import { CompanyComponent } from "./company/company.component";
import { CompanyEditComponent } from "./company/company-edit.component";
import { ForecastComponent } from "./forecast/forecast.component";

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
    MortgageComponent,
    MortgageEditComponent,
    ShareholderComponent,
    ShareholderEditComponent,
    AssetLookupComponent,
    AssetLookupEditComponent,
    GoodReceivedNoteComponent,
    GoodReceivedNoteEditComponent,
    SodoComponent,
    SodoEditComponent,
    LandAreaComponent,
    LandAreaEditComponent,
    InvestmentPropertyComponent,
    InvestmentPropertyEditComponent,
    ProjectComponent,
    ProjectEditComponent,
    CompanyComponent,
    CompanyEditComponent,
    ForecastComponent,
    ],
    exports: [],
    providers: [],
})
export class collateralModule { }
