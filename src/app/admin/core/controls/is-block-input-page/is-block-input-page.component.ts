import { Input, Component, ViewEncapsulation, Injector, AfterViewInit } from "@angular/core";
import { AuthStatusConsts } from "../../ultils/consts/AuthStatusConsts";
import { ChangeDetectionComponent } from "../../ultils/change-detection.component";
import { ComponentBase } from "@app/ultilities/component-base";

@Component({
    templateUrl: './is-block-input-page.component.html',
    selector: 'is-block-input-page',
    styleUrls: ["./is-block-input-page.css"],
    encapsulation: ViewEncapsulation.None
})
export class IsBlockInputPageComponent extends ChangeDetectionComponent implements AfterViewInit {
    ngAfterViewInit(): void {
        // COMMENT: this.stopAutoUpdateView();
    }

    _isBlock: string;

    @Input() get isBlock() : string{
        return this._isBlock;

    }

    set isBlock(isBlock : string){
        this._isBlock = isBlock;
        this.updateView();
    }
    constructor(injector: Injector) {
        super(injector);
    }
}