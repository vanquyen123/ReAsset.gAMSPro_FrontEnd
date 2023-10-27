import { Component, ViewEncapsulation } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";

@Component({
    templateUrl: './test-qr.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class TestQrComponent {
    qrValue: string;
}