import { Component, Injector, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';

@Component({
    templateUrl: './terms-of-use.component.html',
    selector: 'terms-of-use',
    animations: [appModuleAnimation()],
    encapsulation: ViewEncapsulation.None,
})
export class TermsOfUseComponent extends AppComponentBase implements OnInit {

    labelTile: string;

    @Input() useWrapperDiv = false;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit(): void {
        // this.labelTile = AppConsts.releaseVersion;
    }
}
