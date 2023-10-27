import { AbpSessionService } from '@abp/session/abp-session.service';
import { Component, Injector, OnInit, Optional, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SessionServiceProxy, UpdateUserSignInTokenOutput, AuthenticateModel, AuthenticateResultModel, ImpersonateOutput, API_BASE_URL } from '@shared/service-proxies/service-proxies';
import { UrlHelper } from 'shared/helpers/UrlHelper';
import { ExternalLoginProvider, LoginService } from './login.service';
import { WebConsts } from '@app/ultilities/enum/consts';
import { LoginMethod } from '@app/ultilities/enum/login-method';
import { AppConsts } from '@shared/AppConsts';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./style.css'],
    animations: [accountModuleAnimation()]
})
export class LoginComponent extends AppComponentBase implements OnInit {
    submitting = false;
    isMultiTenancyEnabled: boolean = this.multiTenancy.isEnabled;

    canFogotPassword = this.setting.getBoolean('gAMSProCore.FogotPasswordEnable') && (this.setting.get(WebConsts.LoginMethodConsts) == LoginMethod.normal);
    canEmailActive = this.setting.getBoolean('gAMSProCore.EmailActivationEnable') && (this.setting.get(WebConsts.LoginMethodConsts) == LoginMethod.normal);
    private baseUrl: string;

    adfsRemoteUrl: string;
    hasAdfsError: boolean;
    releaseDate: string;

    constructor(
        injector: Injector,
        public loginService: LoginService,
        private _router: Router,
        private _sessionService: AbpSessionService,
        private _sessionAppService: SessionServiceProxy,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(injector);
        this.baseUrl = baseUrl ? baseUrl : "";
        this.adfsRemoteUrl = this.baseUrl + '/api/TokenAuth/LoginAdfs';
        this.hasAdfsError = false;
        this.releaseDate = AppConsts.releaseVersion;
       
    }

    LoginMethod = LoginMethod;

    get multiTenancySideIsTeanant(): boolean {
        return this._sessionService.tenantId > 0;
    }

    get isTenantSelfRegistrationAllowed(): boolean {
        return this.setting.getBoolean('App.TenantManagement.AllowSelfRegistration');
    }

    get isSelfRegistrationAllowed(): boolean {
        if (!this._sessionService.tenantId) {
            return false;
        }

        return this.setting.getBoolean('App.UserManagement.AllowSelfRegistration');
    }

    ngOnInit(): void {
        if (this._sessionService.userId > 0 && UrlHelper.getReturnUrl() && UrlHelper.getSingleSignIn()) {
            this._sessionAppService.updateUserSignInToken()
                .subscribe((result: UpdateUserSignInTokenOutput) => {
                    const initialReturnUrl = UrlHelper.getReturnUrl();
                    const returnUrl = initialReturnUrl + (initialReturnUrl.indexOf('?') >= 0 ? '&' : '?') +
                        'accessToken=' + result.signInToken +
                        '&userId=' + result.encodedUserId +
                        '&tenantId=' + result.encodedTenantId;

                    location.href = returnUrl;
                });
        }

        let state = UrlHelper.getQueryParametersUsingHash().state;
        if (state && state.indexOf('openIdConnect') >= 0) {
            this.loginService.openIdConnectLoginCallback({});
        }
    }

    login(): void {


        abp.ui.setBusy(undefined, '', 1);
        this.submitting = true;
        this.loginService.authenticate(
            () => {
                this.submitting = false;
                abp.ui.clearBusy();
            }
        );
    }

    externalLogin(provider: ExternalLoginProvider) {
        this.loginService.externalAuthenticate(provider);
    }
    termsOfUse(): void {
        this.navigatePassParam('/app/terms-of-use', null, null);
    }
}
