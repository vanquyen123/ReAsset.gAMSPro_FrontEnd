import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppUrlService } from '@shared/common/nav/app-url.service';
import { AccountServiceProxy, PasswordComplexitySetting, ProfileServiceProxy, ResetPasswordInput, ResetPasswordOutput, ResolveTenantIdInput } from '@shared/service-proxies/service-proxies';
import { LoginService } from '../login/login.service';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './reset-password.component.html',
    animations: [accountModuleAnimation()]
})
export class ResetPasswordComponent extends AppComponentBase implements OnInit {

    @ViewChild("resetPassForm") resetPassForm: ElementRef;

    model: ResetPasswordInput = new ResetPasswordInput();
    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    saving = false;
    isShowError = false;
    isShowErrorRepeat = false;
    passwordRepeatText: string;

    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _loginService: LoginService,
        private _appUrlService: AppUrlService,
        private _profileService: ProfileServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this._profileService.getPasswordComplexitySetting().subscribe(result => {
            this.passwordComplexitySetting = result.setting;
        });

        if (this._activatedRoute.snapshot.queryParams['c']) {
            this.model.c = this._activatedRoute.snapshot.queryParams['c'];

            let input = new ResolveTenantIdInput();

            input.c = this.model.c;

            this._accountService.resolveTenantId(input).subscribe((tenantId) => {
                this.appSession.changeTenantIfNeeded(
                    tenantId
                );
            });
        } else {
            this.model.userId = this._activatedRoute.snapshot.queryParams['userId'];
            this.model.resetCode = this._activatedRoute.snapshot.queryParams['resetCode'];

            this.appSession.changeTenantIfNeeded(
                this.parseTenantId(
                    this._activatedRoute.snapshot.queryParams['tenantId']
                )
            );
        }
    }

    save(): void {

        if ((this.resetPassForm as any).form.invalid) {
            this.isShowError = true;
            if (this.model.password != this.passwordRepeatText) {
                this.isShowErrorRepeat = true;
            }
            this.updateView();
            return;
        }

        this.saving = true;
        this._accountService.resetPassword(this.model)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result: ResetPasswordOutput) => {
                if (!result.canLogin) {
                    this._router.navigate(['account/login']);
                    return;
                }

                // Autheticate
                this.saving = true;
                this._loginService.authenticateModel.userNameOrEmailAddress = result.userName;
                this._loginService.authenticateModel.password = this.model.password;
                this._loginService.authenticate(() => {
                    this.saving = false;
                });
            });
    }

    parseTenantId(tenantIdAsStr?: string): number {
        let tenantId = !tenantIdAsStr ? undefined : parseInt(tenantIdAsStr);
        if (tenantId === NaN) {
            tenantId = undefined;
        }

        return tenantId;
    }
}
