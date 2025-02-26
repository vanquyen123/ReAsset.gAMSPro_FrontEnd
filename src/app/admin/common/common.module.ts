import { NgModule } from '@angular/core';
import { AppMenuListComponent } from './app-menus/app-menu-list.component';
import { commonDeclarationImports } from '../core/ultils/CommonDeclarationModule';
import { CommonRoutingModule } from './common-routing.module';
import { CommonServiceProxyModule } from './common-service-proxy.module';
import { AppMenuEditComponent } from './app-menus/app-menu-edit.component';
import { BranchEditComponent } from './branchs/branch-edit.component';
import { BranchListComponent } from './branchs/branch-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegionEditComponent } from './regions/region-edit.component';
import { RegionListComponent } from './regions/region-list.component';
import { DeptGroupListComponent } from './dept-groups/dept-group-list.component';
import { DeptGroupEditComponent } from './dept-groups/dept-group-edit.component';
import { DepartmentEditComponent } from './departments/department-edit.component';
import { DepartmentListComponent } from './departments/department-list.component';
import { SupplierTypeEditComponent } from './supplier-type/supplier-type-edit.component';
import { SupplierTypeListComponent } from './supplier-type/supplier-type-list.component';
import { SupplierListComponent } from './supplier/supplier-list.component';
import { SupplierEditComponent } from './supplier/supplier-edit.component';
import { UnitListComponent } from './units/unit-list.component';
import { UnitEditComponent } from './units/unit-edit.component';
import { GoodsListComponent } from './goods/goods-list.component';
import { GoodsEditComponent } from './goods/goods-edit.component';
import { DivisionListComponent } from './divisions/division-list.component';
import { DivisionEditComponent } from './divisions/division-edit.component';
import { EmployeeListComponent } from './employees/employee-list.component';
import { EmployeeEditComponent } from './employees/employee-edit.component';
import { InsuCompanyEditComponent } from './insu-companies/insu-company-edit.component';
import { InsuCompanyListComponent } from './insu-companies/insu-company-list.component';
import { ModelListComponent } from './models/model-list.component';
import { ModelEditComponent } from './models/model-edit.component';
import { AllCodeListComponent } from './all-codes/all-code-list.component';
import { AllCodeEditComponent } from './all-codes/all-code-edit.component';
import { SysParameterListComponent } from './sysparameters/sysparameter-list.component';
import { SysParameterEditComponent } from './sysparameters/sysparameter-edit.component';
import { WorkflowListComponent } from './workflows/workflow-list.component';
import { WorkflowEditComponent } from './workflows/workflow-edit.component';
import { AsposeSampleComponent } from './aspose-sample/aspose-sample.component';
import { ReportTemplateListComponent } from './report-template/report-template-list.component';
import { ReportTemplateEditComponent } from './report-template/report-template-edit.component';
import { PreviewTemplateModalComponent } from './report-template/preview-template-modal.component';
import { PreviewTemplateComponent } from './preview-template/preview-template.component';
import { TestQrComponent } from './test-qr/test-qr.component';
import { ExecQueryComponent } from './exec-queries/exec-queries.component';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { CacheRouteReuseStrategy } from '../core/ultils/cache-route-reuse.strategy';
import { TlUserListComponent } from './tlusers/tluser-list.component';
import { TlUserEditComponent } from './tlusers/tluser-edit.component';
import { MenuIconComponent } from './menu-icon/menu-icon.component';
import { ChartsModule } from 'ng2-charts';
import { BrowserModule } from '@angular/platform-browser';
import { AccountKTListComponent } from './account-kt/account-kt-list.component';
import { AccountKTEditComponent } from './account-kt/account-kt-edit.component';
import { SecurInfoListComponent } from './secur-info/secur-info-list.component';
import { SecurInfoEditComponent } from './secur-info/secur-info-edit.component';
import { TermEditComponent } from './term/term-edit.component';
import { TermListComponent } from './term/term-list.component';
import { GoodsTypeRealListComponent } from './goodstypereal/goodstype-real-list.component';
import { GoodsTypeRealEditComponent } from './goodstypereal/goodstype-real-edit.component';
import {AreaEditComponent} from './areas/area-edit.component'
import {AreaListComponent} from './areas/area-list.component'

@NgModule({
    imports: [
        ...commonDeclarationImports,
        ChartsModule,
        RouterModule,
        CommonRoutingModule,
        CommonServiceProxyModule
    ],
    declarations: [
        DashboardComponent,
        AppMenuListComponent,
        AppMenuEditComponent,
        BranchEditComponent,
        BranchListComponent,
        RegionEditComponent,
        RegionListComponent,
        DeptGroupListComponent,
        DeptGroupEditComponent,
        DepartmentListComponent,
        DepartmentEditComponent,
        SupplierTypeListComponent,
        SupplierTypeEditComponent,
        SupplierListComponent,
        SupplierEditComponent,
        UnitListComponent,
        UnitEditComponent,
        GoodsListComponent,
        GoodsEditComponent,
        DivisionListComponent,
        DivisionEditComponent,
        EmployeeListComponent,
        EmployeeEditComponent,
        InsuCompanyListComponent,
        InsuCompanyEditComponent,
        ModelListComponent,
        ModelEditComponent,
        WorkflowListComponent,
        WorkflowEditComponent,
        AllCodeListComponent,
        AllCodeEditComponent,
        SysParameterListComponent,
        AsposeSampleComponent,
        SysParameterEditComponent,
        ReportTemplateListComponent,
        ReportTemplateEditComponent,
        PreviewTemplateComponent,
        TestQrComponent,
        ExecQueryComponent,
        PreviewTemplateModalComponent,
        MenuIconComponent,
        AccountKTListComponent, AccountKTEditComponent,
        SecurInfoListComponent, SecurInfoEditComponent,
        TermListComponent, TermEditComponent,
        GoodsTypeRealListComponent, GoodsTypeRealEditComponent,
        // Người dùng
        TlUserListComponent, TlUserEditComponent,
        //khu vuc
        AreaEditComponent,AreaListComponent,
    ],
    exports: [

    ],
    providers: [
    ]
})
export class CCommonModule { }
