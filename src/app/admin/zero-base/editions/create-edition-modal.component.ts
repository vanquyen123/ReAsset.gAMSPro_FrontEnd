import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppEditionExpireAction } from '@shared/AppEnums';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ComboboxItemDto, CommonLookupServiceProxy, CreateEditionDto, EditionServiceProxy } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { FeatureTreeComponent } from '../shared/feature-tree.component';


@Component({
    selector: 'createEditionModal',
    templateUrl: './create-edition-modal.component.html'
})
export class CreateEditionModalComponent extends AppComponentBase {

    @ViewChild('createModal') modal: ModalDirective;
    @ViewChild('featureTree') featureTree: FeatureTreeComponent;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    currencyMask = createNumberMask({
        prefix: '',
        allowDecimal: true
    });

    edition: CreateEditionDto = new CreateEditionDto();
    expiringEditions: ComboboxItemDto[] = [];

    expireAction: AppEditionExpireAction = AppEditionExpireAction.DeactiveTenant;
    AppEditionExpireAction = AppEditionExpireAction;
    isFree = true;
    isTrialActive = false;
    isWaitingDayActive = false;

    constructor(
        injector: Injector,
        private _editionService: EditionServiceProxy,
        private _commonLookupService: CommonLookupServiceProxy
    ) {
        super(injector);
    }

    show(editionId?: number): void {
        this.active = true;

        this._commonLookupService.getEditionsForCombobox(true).subscribe(editionsResult => {
            this.expiringEditions = editionsResult.items;
            let input = new ComboboxItemDto();
            input.value = null;
            input.displayText = this.l('NotAssigned');
            input.isSelected = true;
            this.expiringEditions.unshift(input);

            this._editionService.getEditionForEdit(editionId).subscribe(editionResult => {
                this.featureTree.editData = editionResult;
                this.modal.show();
            });
        });
    }

    onShown(): void {
        document.getElementById('EditionDisplayName').focus();
    }

    resetPrices(isFree) {
        this.edition.edition.annualPrice = undefined;
        this.edition.edition.monthlyPrice = undefined;
    }

    removeExpiringEdition(isDeactivateTenant) {
        this.edition.edition.expiringEditionId = null;
    }

    save(): void {
        const input = new CreateEditionDto();
        input.edition = this.edition.edition;
        input.featureValues = this.featureTree.getGrantedFeatures();

        this.saving = true;
        this._editionService.createEdition(input)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.showSuccessMessage(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
