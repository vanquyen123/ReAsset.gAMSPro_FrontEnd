import { AbpHttpInterceptor } from "@abp/abpHttpInterceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import * as ApiServiceProxies from "../../../shared/service-proxies/service-proxies";


@NgModule({
    providers: [
       
        ApiServiceProxies.RegionServiceProxy,
        ApiServiceProxies.BranchServiceProxy,
       
        ApiServiceProxies.SysParametersServiceProxy,
        ApiServiceProxies.OutsideShareholderServiceProxy,
        ApiServiceProxies.AuthorizedPersonServiceProxy,
        ApiServiceProxies.OwnerServiceProxy,
        ApiServiceProxies.ContractServiceProxy,
       
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AbpHttpInterceptor,
            multi: true,
        },
    ],
})
export class collateralServiceProxyModule { }
