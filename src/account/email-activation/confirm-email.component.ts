import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AccountServiceProxy, ActivateEmailInput, ResolveTenantIdInput } from '@shared/service-proxies/service-proxies';

@Component({
    template: `<p>{{waitMessage}}</p>`
})
export class ConfirmEmailComponent extends AppComponentBase implements OnInit {

    waitMessage: string;

    model: ActivateEmailInput = new ActivateEmailInput();

    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.waitMessage = this.l('PleaseWaitToConfirmYourEmailMessage');

        this.model.c = this._activatedRoute.snapshot.queryParams['c'];

        let input = new ResolveTenantIdInput();

        input.c = this.model.c;

        
        this._accountService.resolveTenantId(input).subscribe((tenantId) => {
            let reloadNeeded = this.appSession.changeTenantIfNeeded(
                tenantId
            );

            /*if (reloadNeeded) {
                return;
            }*/

            this._accountService.activateEmail(this.model)
                .subscribe(() => {
                    this.notify.success(this.l('YourEmailIsConfirmedMessage'), '',
                        {
                            onClose: () => {
                                this._router.navigate(['account/login']);
                            }
                        });
                });
        });
    }

    parseTenantId(tenantIdAsStr?: string): number {
        let tenantId = !tenantIdAsStr ? undefined : parseInt(tenantIdAsStr, 10);
        if (tenantId === NaN) {
            tenantId = undefined;
        }

        return tenantId;
    }
}
