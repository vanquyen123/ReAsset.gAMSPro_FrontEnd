import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouteReuseStrategy } from '@angular/router';
import { AppMenuListComponent } from './app-menus/app-menu-list.component';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';
import { AppMenuEditComponent } from './app-menus/app-menu-edit.component';
import { BranchListComponent } from './branchs/branch-list.component';
import { BranchEditComponent } from './branchs/branch-edit.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeptGroupEditComponent } from './dept-groups/dept-group-edit.component';
import { DeptGroupListComponent } from './dept-groups/dept-group-list.component';
import { DepartmentListComponent } from './departments/department-list.component';
import { DepartmentEditComponent } from './departments/department-edit.component';
import { SupplierTypeListComponent } from './supplier-type/supplier-type-list.component';
import { SupplierTypeEditComponent } from './supplier-type/supplier-type-edit.component';
import { SupplierEditComponent } from './supplier/supplier-edit.component';
import { SupplierListComponent } from './supplier/supplier-list.component';
import { UnitListComponent } from './units/unit-list.component';
import { UnitEditComponent } from './units/unit-edit.component';
import { GoodsListComponent } from './goods/goods-list.component';
import { GoodsEditComponent } from './goods/goods-edit.component';
import { DivisionListComponent } from './divisions/division-list.component';
import { DivisionEditComponent } from './divisions/division-edit.component';
import { EmployeeListComponent } from './employees/employee-list.component';
import { EmployeeEditComponent } from './employees/employee-edit.component';
import { InsuCompanyListComponent } from './insu-companies/insu-company-list.component';
import { InsuCompanyEditComponent } from './insu-companies/insu-company-edit.component';
import { ModelListComponent } from './models/model-list.component';
import { ModelEditComponent } from './models/model-edit.component';
import { AllCodeListComponent } from './all-codes/all-code-list.component';
import { AllCodeEditComponent } from './all-codes/all-code-edit.component';
import { SysParameterListComponent } from './sysparameters/sysparameter-list.component';
import { SysParameterEditComponent } from './sysparameters/sysparameter-edit.component';
import { RegionListComponent } from './regions/region-list.component';
import { RegionEditComponent } from './regions/region-edit.component';
import { WorkflowListComponent } from './workflows/workflow-list.component';
import { WorkflowEditComponent } from './workflows/workflow-edit.component';
import { AsposeSampleComponent } from './aspose-sample/aspose-sample.component';
import { ReportTemplateListComponent } from './report-template/report-template-list.component';
import { ReportTemplateEditComponent } from './report-template/report-template-edit.component';
import { PreviewTemplateComponent } from './preview-template/preview-template.component';
import { TestQrComponent } from './test-qr/test-qr.component';
import { ExecQueryComponent } from './exec-queries/exec-queries.component';
import { TlUserListComponent } from './tlusers/tluser-list.component';
import { TlUserEditComponent } from './tlusers/tluser-edit.component';
import { MenuIconComponent } from './menu-icon/menu-icon.component';
import { UploadSystemFile } from './upload-system-file/upload-system-file.component';
import { AccountKTListComponent } from './account-kt/account-kt-list.component';
import { AccountKTEditComponent } from './account-kt/account-kt-edit.component';
import { SecurInfoListComponent } from './secur-info/secur-info-list.component';
import { SecurInfoEditComponent } from './secur-info/secur-info-edit.component';
import { TermListComponent } from './term/term-list.component';
import { TermEditComponent } from './term/term-edit.component';
import { GoodsTypeRealListComponent } from './goodstypereal/goodstype-real-list.component';
import { GoodsTypeRealEditComponent } from './goodstypereal/goodstype-real-edit.component';
import {AreaEditComponent} from './areas/area-edit.component'
import {AreaListComponent} from './areas/area-list.component'

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'dashboard', component: DashboardComponent},

                    // Thông tin trang
                    { path: 'app-menu', component: AppMenuListComponent, data: { permission: 'Pages.Administration.Menu' } },
                    { path: 'app-menu-add', component: AppMenuEditComponent, data: { permission: 'Pages.Administration.Menu.Create', editPageState: EditPageState.add } },
                    { path: 'app-menu-edit', component: AppMenuEditComponent, data: { permission: 'Pages.Administration.Menu.Edit', editPageState: EditPageState.edit } },
                    { path: 'app-menu-view', component: AppMenuEditComponent, data: { permission: 'Pages.Administration.Menu.View', editPageState: EditPageState.viewDetail } },

                    // Upload system file
                    { path: 'upload-system', component : UploadSystemFile, data: { permission: 'Pages.Administration.UploadSystemFile' }},

                    // Danh mục đơn vị
                    { path: 'branch', component: BranchListComponent, data: { permission: 'Pages.Administration.Branch' } },
                    { path: 'branch-add', component: BranchEditComponent, data: { permission: 'Pages.Administration.Branch.Create', editPageState: EditPageState.add } },
                    { path: 'branch-edit', component: BranchEditComponent, data: { permission: 'Pages.Administration.Branch.Edit', editPageState: EditPageState.edit } },
                    { path: 'branch-view', component: BranchEditComponent, data: { permission: 'Pages.Administration.Branch.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục người dùng
                    { path: 'tluser', component: TlUserListComponent, data: { permission: 'Pages.Administration.TlUser' } },
                    { path: 'tluser-add', component: TlUserEditComponent, data: { permission: 'Pages.Administration.TlUser.Create', editPageState: EditPageState.add } },
                    { path: 'tluser-edit', component: TlUserEditComponent, data: { permission: 'Pages.Administration.TlUser.Edit', editPageState: EditPageState.edit } },
                    { path: 'tluser-view', component: TlUserEditComponent, data: { permission: 'Pages.Administration.TlUser.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục vùng miền
                    { path: 'region', component: RegionListComponent, data: { permission: 'Pages.Administration.Region' } },
                    { path: 'region-add', component: RegionEditComponent, data: { permission: 'Pages.Administration.Region.Create', editPageState: EditPageState.add } },
                    { path: 'region-edit', component: RegionEditComponent, data: { permission: 'Pages.Administration.Region.Edit', editPageState: EditPageState.edit } },
                    { path: 'region-view', component: RegionEditComponent, data: { permission: 'Pages.Administration.Region.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục loại phòng ban
                    { path: 'dept-group', component: DeptGroupListComponent, data: { permission: 'Pages.Administration.DeptGroup' } },
                    { path: 'dept-group-add', component: DeptGroupEditComponent, data: { permission: 'Pages.Administration.DeptGroup.Create', editPageState: EditPageState.add } },
                    { path: 'dept-group-edit', component: DeptGroupEditComponent, data: { permission: 'Pages.Administration.DeptGroup.Edit', editPageState: EditPageState.edit } },
                    { path: 'dept-group-view', component: DeptGroupEditComponent, data: { permission: 'Pages.Administration.DeptGroup.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục phòng
                    { path: 'department', component: DepartmentListComponent, data: { permission: 'Pages.Administration.Department' } },
                    { path: 'department-add', component: DepartmentEditComponent, data: { permission: 'Pages.Administration.Department.Create', editPageState: EditPageState.add } },
                    { path: 'department-edit', component: DepartmentEditComponent, data: { permission: 'Pages.Administration.Department.Edit', editPageState: EditPageState.edit } },
                    { path: 'department-view', component: DepartmentEditComponent, data: { permission: 'Pages.Administration.Department.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục loại nhà cung cấp
                    { path: 'supplier-type', component: SupplierTypeListComponent, data: { permission: 'Pages.Administration.SupplierType' } },
                    { path: 'supplier-type-add', component: SupplierTypeEditComponent, data: { permission: 'Pages.Administration.SupplierType.Create', editPageState: EditPageState.add } },
                    { path: 'supplier-type-edit', component: SupplierTypeEditComponent, data: { permission: 'Pages.Administration.SupplierType.Edit', editPageState: EditPageState.edit } },
                    { path: 'supplier-type-view', component: SupplierTypeEditComponent, data: { permission: 'Pages.Administration.SupplierType.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục nhà cung cấp
                    { path: 'supplier', component: SupplierListComponent, data: { permission: 'Pages.Administration.Supplier' } },
                    { path: 'supplier-add', component: SupplierEditComponent, data: { permission: 'Pages.Administration.Supplier.Create', editPageState: EditPageState.add } },
                    { path: 'supplier-edit', component: SupplierEditComponent, data: { permission: 'Pages.Administration.Supplier.Edit', editPageState: EditPageState.edit } },
                    { path: 'supplier-view', component: SupplierEditComponent, data: { permission: 'Pages.Administration.Supplier.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục loại hàng hóa thực tế
                    { path: 'goodstype-real', component: GoodsTypeRealListComponent, data: { permission: 'Pages.Administration.GoodsTypeReal' } },
                    { path: 'goodstype-real-add', component: GoodsTypeRealEditComponent, data: { permission: 'Pages.Administration.GoodsTypeReal.Create', editPageState: EditPageState.add } },
                    { path: 'goodstype-real-edit', component: GoodsTypeRealEditComponent, data: { permission: 'Pages.Administration.GoodsTypeReal.Edit', editPageState: EditPageState.edit } },
                    { path: 'goodstype-real-view', component: GoodsTypeRealEditComponent, data: { permission: 'Pages.Administration.GoodsTypeReal.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục tài khoản kế toán
                    { path: 'account-kt', component: AccountKTListComponent, data: { permission: 'Pages.Administration.AccountKT' } },
                    { path: 'account-kt-add', component: AccountKTEditComponent, data: { permission: 'Pages.Administration.AccountKT.Create', editPageState: EditPageState.add } },
                    { path: 'account-kt-edit', component: AccountKTEditComponent, data: { permission: 'Pages.Administration.AccountKT.Edit', editPageState: EditPageState.edit } },
                    { path: 'account-kt-view', component: AccountKTEditComponent, data: { permission: 'Pages.Administration.AccountKT.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục mức độ
                    { path: 'secur-info', component: SecurInfoListComponent, data: { permission: 'Pages.Administration.SecurInfo' } },
                    { path: 'secur-info-add', component: SecurInfoEditComponent, data: { permission: 'Pages.Administration.SecurInfo.Create', editPageState: EditPageState.add } },
                    { path: 'secur-info-edit', component: SecurInfoEditComponent, data: { permission: 'Pages.Administration.SecurInfo.Edit', editPageState: EditPageState.edit } },
                    { path: 'secur-info-view', component: SecurInfoEditComponent, data: { permission: 'Pages.Administration.SecurInfo.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục đợt kiểm kê
                    { path: 'term', component: TermListComponent, data: { permission: 'Pages.Administration.CommonTerm' } },
                    { path: 'term-add', component: TermEditComponent, data: { permission: 'Pages.Administration.CommonTerm.Create', editPageState: EditPageState.add } },
                    { path: 'term-edit', component: TermEditComponent, data: { permission: 'Pages.Administration.CommonTerm.Edit', editPageState: EditPageState.edit } },
                    { path: 'term-view', component: TermEditComponent, data: { permission: 'Pages.Administration.CommonTerm.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục đơn vị tính
                    { path: 'unit', component: UnitListComponent, data: { permission: 'Pages.Administration.Unit' } },
                    { path: 'unit-add', component: UnitEditComponent, data: { permission: 'Pages.Administration.Unit.Create', editPageState: EditPageState.add } },
                    { path: 'unit-edit', component: UnitEditComponent, data: { permission: 'Pages.Administration.Unit.Edit', editPageState: EditPageState.edit } },
                    { path: 'unit-view', component: UnitEditComponent, data: { permission: 'Pages.Administration.Unit.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục hàng hóa
                    { path: 'goods', component: GoodsListComponent, data: { permission: 'Pages.Administration.Goods' } },
                    { path: 'goods-add', component: GoodsEditComponent, data: { permission: 'Pages.Administration.Goods.Create', editPageState: EditPageState.add } },
                    { path: 'goods-edit', component: GoodsEditComponent, data: { permission: 'Pages.Administration.Goods.Edit', editPageState: EditPageState.edit } },
                    { path: 'goods-view', component: GoodsEditComponent, data: { permission: 'Pages.Administration.Goods.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục địa điểm
                    { path: 'division', component: DivisionListComponent, data: { permission: 'Pages.Administration.Division' } },
                    { path: 'division-add', component: DivisionEditComponent, data: { permission: 'Pages.Administration.Division.Create', editPageState: EditPageState.add } },
                    { path: 'division-edit', component: DivisionEditComponent, data: { permission: 'Pages.Administration.Division.Edit', editPageState: EditPageState.edit } },
                    { path: 'division-view', component: DivisionEditComponent, data: { permission: 'Pages.Administration.Division.View', editPageState: EditPageState.viewDetail } },

                    // Workflow
                    { path: 'workflow', component: WorkflowListComponent, data: { permission: 'Pages.Administration.Workflow' } },
                    { path: 'workflow-add', component: WorkflowEditComponent, data: { permission: 'Pages.Administration.Workflow.Create', editPageState: EditPageState.add } },
                    { path: 'workflow-edit', component: WorkflowEditComponent, data: { permission: 'Pages.Administration.Workflow.Edit', editPageState: EditPageState.edit } },
                    { path: 'workflow-view', component: WorkflowEditComponent, data: { permission: 'Pages.Administration.Workflow.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục nhân viên
                    { path: 'employee', component: EmployeeListComponent, data: { permission: 'Pages.Administration.Employee' } },
                    { path: 'employee-add', component: EmployeeEditComponent, data: { permission: 'Pages.Administration.Employee.Create', editPageState: EditPageState.add } },
                    { path: 'employee-edit', component: EmployeeEditComponent, data: { permission: 'Pages.Administration.Employee.Edit', editPageState: EditPageState.edit } },
                    { path: 'employee-view', component: EmployeeEditComponent, data: { permission: 'Pages.Administration.Employee.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục công ty bảo hiểm
                    { path: 'insu-company', component: InsuCompanyListComponent, data: { permission: 'Pages.Administration.InsuCompany' } },
                    { path: 'insu-company-add', component: InsuCompanyEditComponent, data: { permission: 'Pages.Administration.InsuCompany.Create', editPageState: EditPageState.add } },
                    { path: 'insu-company-edit', component: InsuCompanyEditComponent, data: { permission: 'Pages.Administration.InsuCompany.Edit', editPageState: EditPageState.edit } },
                    { path: 'insu-company-view', component: InsuCompanyEditComponent, data: { permission: 'Pages.Administration.InsuCompany.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục model
                    { path: 'model', component: ModelListComponent, data: { permission: 'Pages.Administration.Model' } },
                    { path: 'model-add', component: ModelEditComponent, data: { permission: 'Pages.Administration.Model.Create', editPageState: EditPageState.add } },
                    { path: 'model-edit', component: ModelEditComponent, data: { permission: 'Pages.Administration.Model.Edit', editPageState: EditPageState.edit } },
                    { path: 'model-view', component: ModelEditComponent, data: { permission: 'Pages.Administration.Model.View', editPageState: EditPageState.viewDetail } },

                    // Danh mục trường giao dịch
                    { path: 'all-code', component: AllCodeListComponent, data: { permission: 'Pages.Administration.AllCode' } },
                    { path: 'all-code-add', component: AllCodeEditComponent, data: { permission: 'Pages.Administration.AllCode.Create', editPageState: EditPageState.add } },
                    { path: 'all-code-edit', component: AllCodeEditComponent, data: { permission: 'Pages.Administration.AllCode.Edit', editPageState: EditPageState.edit } },
                    { path: 'all-code-view', component: AllCodeEditComponent, data: { permission: 'Pages.Administration.AllCode.View', editPageState: EditPageState.viewDetail } },

                    // Tham số hệ thống
                    { path: 'argument', component: SysParameterListComponent, data: { permission: 'Pages.Administration.SysParameter' } },
                    { path: 'argument-add', component: SysParameterEditComponent, data: { permission: 'Pages.Administration.SysParameter.Create', editPageState: EditPageState.add } },
                    { path: 'argument-edit', component: SysParameterEditComponent, data: { permission: 'Pages.Administration.SysParameter.Edit', editPageState: EditPageState.edit } },
                    { path: 'argument-view', component: SysParameterEditComponent, data: { permission: 'Pages.Administration.SysParameter.View', editPageState: EditPageState.viewDetail } },

                    { path: 'aspose-sample', component: AsposeSampleComponent },

                    // Mẫu báo cáo
                    { path: 'reporttemplate', component: ReportTemplateListComponent, data: { permission: 'Pages.Administration.ReportTemplate' } },
                    { path: 'reporttemplate-add', component: ReportTemplateEditComponent, data: { permission: 'Pages.Administration.ReportTemplate.Create', editPageState: EditPageState.add } },
                    { path: 'reporttemplate-edit', component: ReportTemplateEditComponent, data: { permission: 'Pages.Administration.ReportTemplate.Edit', editPageState: EditPageState.edit } },
                    { path: 'reporttemplate-view', component: ReportTemplateEditComponent, data: { permission: 'Pages.Administration.ReportTemplate.View', editPageState: EditPageState.viewDetail } },

                    // Menu icon
                    { path: 'menu-icon', component: MenuIconComponent },

                    { path: 'previewtemplate', component: PreviewTemplateComponent, data: { permission: 'Pages.Administration.PreviewTemplate' } },
                    { path: 'test-qr', component: TestQrComponent },
                    { path: 'exec-query', component: ExecQueryComponent },

                    // Danh mục khu vuc
                    { path: 'area', component: AreaListComponent, data: { permission: 'Pages.Administration.Area' } },
                    { path: 'area-add', component: AreaEditComponent, data: { permission: 'Pages.Administration.Area.Create', editPageState: EditPageState.add } },
                    { path: 'area-edit', component: AreaEditComponent, data: { permission: 'Pages.Administration.Area.Edit', editPageState: EditPageState.edit } },
                    { path: 'area-view', component: AreaEditComponent, data: { permission: 'Pages.Administration.Area.View', editPageState: EditPageState.viewDetail } },

                ]
            }
        ])
    ],
    providers: [
    ],
    exports: [
        RouterModule
    ]
})
export class CommonRoutingModule {

    constructor(
        private router: Router
    ) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scroll(0, 0);
            }
        });
    }
}
