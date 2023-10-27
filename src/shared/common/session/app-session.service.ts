import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { Injectable } from '@angular/core';
import { ApplicationInfoDto, GetCurrentLoginInformationsOutput, SessionServiceProxy, TenantLoginInfoDto, UserLoginInfoDto, UiCustomizationSettingsDto, SysParametersServiceProxy, SYS_PARAMETERS_ENTITY } from '@shared/service-proxies/service-proxies';

@Injectable()
export class AppSessionService {

    private _user: UserLoginInfoDto;
    private _tenant: TenantLoginInfoDto;
    private _application: ApplicationInfoDto;
    private _theme: UiCustomizationSettingsDto;
    private _roleNames: any;

    
    constructor(
        private _sessionService: SessionServiceProxy,
       
        private _abpMultiTenancyService: AbpMultiTenancyService) {
    }

    get application(): ApplicationInfoDto {
        return this._application;
    }

    set application(val: ApplicationInfoDto) {
        this._application = val;
    }

    get user(): UserLoginInfoDto {
        return this._user;
    }

    get userId(): number {
        return this.user ? this.user.id : null;
    }

    get tenant(): TenantLoginInfoDto {
        return this._tenant;
    }

    get tenancyName(): string {
        return this._tenant ? this.tenant.tenancyName : '';
    }

    get tenantId(): number {
        return this.tenant ? this.tenant.id : null;
    }
    get roleNames():any{
        return this._roleNames;
    }
    getShownLoginName(): string {
        if(!this._user){
            return '';
        }
        const userName = this._user.userName;
        if (!this._abpMultiTenancyService.isEnabled) {
            return userName;
        }

        return (this._tenant ? this._tenant.tenancyName : '.') + '\\' + userName;
    }

    get theme(): UiCustomizationSettingsDto {
        return this._theme;
    }

    set theme(val: UiCustomizationSettingsDto) {
        this._theme = val;
    }

    init(): Promise<UiCustomizationSettingsDto> {

        // let result = {"result":{"user":null,"tenant":null,"application":{"version":"6.8.0.0","releaseDate":"2020-06-23T11:11:17.5607872+07:00","currency":"USD","currencySign":"$","allowTenantsToChangeEmailSettings":false,"features":{}},"theme":{"baseSettings":{"theme":"default","layout":{"layoutType":"fluid","contentSkin":"light2","themeColor":"default","fixedBody":false,"mobileFixedBody":false},"header":{"desktopFixedHeader":true,"mobileFixedHeader":false,"headerSkin":"light"},"menu":{"position":"left","asideSkin":"light","fixedAside":true,"allowAsideMinimizing":true,"defaultMinimizedAside":false,"allowAsideHiding":false,"defaultHiddenAside":false,"submenuToggle":"Accordion"},"footer":{"fixedFooter":false}},"isLeftMenuUsed":true,"isTopMenuUsed":false,"isTabMenuUsed":false,"allowMenuScroll":true}},"targetUrl":null,"success":true,"error":null,"unAuthorizedRequest":false,"__abp":true}.result;

        // this._application = result.application as any;
        // this._user = result.user;
        // this._tenant = result.tenant;
        // this._theme = result.theme as any;

        // return new Promise<UiCustomizationSettingsDto>((resolve, reject) => {
        //     resolve(result.theme as any);
        // });

        return new Promise<UiCustomizationSettingsDto>((resolve, reject) => {
            this._sessionService.getCurrentLoginInformations().toPromise().then((result: GetCurrentLoginInformationsOutput) => {
                this._application = result.application;
                this._user = result.user;
                this._tenant = result.tenant;
                this._theme = result.theme;
                this._roleNames=result.roleKeys
                resolve(result.theme);
            }, (err) => {
                reject(err);
            });
        });
    }

    changeTenantIfNeeded(tenantId?: number): boolean {
        if (this.isCurrentTenant(tenantId)) { //this.isCurrentTenant(tenantId)
            return false;
        }

        abp.multiTenancy.setTenantIdCookie(tenantId);
        //location.reload();
        return true;
    }

    private isCurrentTenant(tenantId?: number) {
        let isTenant = tenantId > 0;

        if (!isTenant && !this.tenant) { // this is host
            return true;
        }

        if (!tenantId && this.tenant) {
            return false;
        } else if (tenantId && (!this.tenant || this.tenant.id !== tenantId)) {
            return false;
        }

        return true;
    }
   
}
