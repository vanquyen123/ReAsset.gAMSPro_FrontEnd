import { NgModule } from '@angular/core';
import { commonDeclarationImports } from '../core/ultils/CommonDeclarationModule';

import { ConstMasterRoutingModule } from './const-masters-routing.module';
import { ConstMasterServiceProxyModule } from './const-masters-service-proxy.module';


@NgModule({
    imports: [
        ...commonDeclarationImports,
        ConstMasterRoutingModule,
        ConstMasterServiceProxyModule
    ],
    declarations: [
        // Quản lý hồ sơ công trình
     

    ],
    exports: [

    ],
    providers: [

    ]
})
export class ConstMasterModule { }
