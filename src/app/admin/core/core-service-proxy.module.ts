import { AbpHttpInterceptor } from '@abp/abpHttpInterceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import * as ApiServiceProxies from '../../../shared/service-proxies/service-proxies'
import { AccentsCharService } from './ultils/accents-char.service';

@NgModule({
    providers: [
        ApiServiceProxies.BranchServiceProxy,
        ApiServiceProxies.AllCodeServiceProxy,
        ApiServiceProxies.RegionServiceProxy,
        ApiServiceProxies.DepartmentServiceProxy,
        ApiServiceProxies.LocationServiceProxy,
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true }
    ]
})
export class CoreServiceProxyModule { }
