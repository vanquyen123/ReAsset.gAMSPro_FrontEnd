import { Component, Injector, OnInit, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppConsts } from '@shared/AppConsts';

@Component({
    templateUrl: './footer.component.html',
    selector: 'footer-bar'
})
export class FooterComponent extends AppComponentBase implements OnInit {

    releaseDate: string;

    @Input() useWrapperDiv = false;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.releaseDate = AppConsts.releaseVersion;
    }

    termsOfUse(): void {
        this.navigatePassParam('/app/terms-of-use', null, null);
    }
}
