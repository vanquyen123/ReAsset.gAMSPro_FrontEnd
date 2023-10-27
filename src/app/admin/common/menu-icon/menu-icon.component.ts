import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { Component, Injector } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";

@Component({
    templateUrl: './menu-icon.component.html',
    animations: [appModuleAnimation()]
})
export class MenuIconComponent extends DefaultComponentBase {
    constructor(injector: Injector
    ) {
        super(injector);
    }
}