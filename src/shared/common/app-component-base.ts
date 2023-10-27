import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { Injector, ChangeDetectorRef } from '@angular/core';
import { PrimengTableHelper } from 'shared/helpers/PrimengTableHelper';
import { UiCustomizationSettingsDto } from '@shared/service-proxies/service-proxies';
import { ComponentBase } from '@app/ultilities/component-base';

export abstract class AppComponentBase extends ComponentBase {

    multiTenancy: AbpMultiTenancyService;
    primengTableHelper: PrimengTableHelper;
    inj: Injector;
    constructor(injector: Injector) {
        super(injector);
        this.multiTenancy = injector.get(AbpMultiTenancyService);
        this.primengTableHelper = new PrimengTableHelper();
        this.inj = injector;
    }

    updateView(){
        this.cdr = this.inj.get(ChangeDetectorRef);
        this.cdr.detectChanges();
    }

    l(key: string, ...args: any[]): string {
        args.unshift(key);
        args.unshift(this.localizationSourceName);
        return this.ls.apply(this, args);
    }

    ls(sourcename: string, key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, sourcename);

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args.unshift(localizedText);
        return abp.utils.formatString.apply(this, args);
    }

    isGranted(permissionName: string): boolean {
        return this.permission.isGranted(permissionName);
    }

    isGrantedAny(...permissions: string[]): boolean {
        if (!permissions) {
            return false;
        }

        for (const permission of permissions) {
            if (this.isGranted(permission)) {
                return true;
            }
        }

        return false;
    }

    s(key: string): string {
        return abp.setting.get(key);
    }

    rootPage() {
        return '/app/admin/dashboard';
    }

    appRootUrl(): string {
        return this.appUrlService.appRootUrl;
    }

    get currentTheme(): UiCustomizationSettingsDto {
        return this.appSession.theme;
    }
}
