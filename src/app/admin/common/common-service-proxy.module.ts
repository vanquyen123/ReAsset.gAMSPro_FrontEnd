import { AbpHttpInterceptor } from '@abp/abpHttpInterceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import * as ApiServiceProxies from '../../../shared/service-proxies/service-proxies'
import { PreviewTemplateService } from './preview-template/preview-template.service';
import { AccentsCharService } from '../core/ultils/accents-char.service';

@NgModule({
    providers: [
        ApiServiceProxies.AppMenuServiceProxy,
        ApiServiceProxies.TlUserServiceProxy,
        ApiServiceProxies.AppPermissionServiceProxy,
        ApiServiceProxies.DeptGroupServiceProxy,
        ApiServiceProxies.SupplierTypeServiceProxy,
        ApiServiceProxies.SupplierServiceProxy,
        ApiServiceProxies.GoodsTypeServiceProxy,
        ApiServiceProxies.UnitServiceProxy,
        ApiServiceProxies.GoodsServiceProxy,
        ApiServiceProxies.DivisionServiceProxy,
        ApiServiceProxies.EmployeeServiceProxy,
        ApiServiceProxies.InsuCompanyServiceProxy,
        ApiServiceProxies.ModelServiceProxy,
        ApiServiceProxies.CarTypeServiceProxy,
        ApiServiceProxies.AllCodeServiceProxy,
        ApiServiceProxies.WorkflowServiceProxy,
        ApiServiceProxies.SysParametersServiceProxy,
        ApiServiceProxies.UltilityServiceProxy,
        ApiServiceProxies.GoodsTypeRealServiceProxy,
        ApiServiceProxies.WfDefinitionServiceProxy,
        ApiServiceProxies.ReportTemplateServiceProxy,
        ApiServiceProxies.CmUserServiceProxy,
        ApiServiceProxies.BranchHDServiceProxy,
        ApiServiceProxies.TermServiceProxy,
        ApiServiceProxies.AttachFileServiceProxy,
        ApiServiceProxies.AccountKTServiceProxy,
        ApiServiceProxies.SecurInfoServiceProxy,
        //TienLee
        ApiServiceProxies.DashboardServiceProxy,
        //luatndv
        ApiServiceProxies.AreaServiceProxy,
        PreviewTemplateService,
        AccentsCharService,
       { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class CommonServiceProxyModule { }
