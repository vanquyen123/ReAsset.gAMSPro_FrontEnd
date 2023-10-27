import { Component, Injector, inject, Optional, Inject } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { AppAuthService } from "@app/shared/common/auth/app-auth.service";
import { API_BASE_URL } from "@shared/service-proxies/service-proxies";
import { XmlHttpRequestHelper } from "@shared/helpers/XmlHttpRequestHelper";
import { AppConsts } from "@shared/AppConsts";

@Component({
    templateUrl: './login-adfs-fail.component.html',
})
export class LoginAdfsSuccessComponent extends AppComponentBase {
    userName: string;
    baseUrl: string;
    logoutUrl: string;
    /**
     *
     */
    constructor(injector: Injector,
        private _authService: AppAuthService,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        super(injector);
        this.userName = this.getRouteParam('user-name');
        this.baseUrl = baseUrl;
        this.logoutUrl = baseUrl + '/api/TokenAuth/SignOutAdfs';
    }

    signoutAdfs() {
       this._authService.logoutAdfs();
    }
}