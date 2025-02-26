import * as _ from 'lodash';
import { Component, Injector, OnInit, Output, EventEmitter, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ComponentBase } from '../../../../ultilities/component-base';
import { IUiAction } from '../../../../ultilities/ui-action';
import { ActionRole } from '../../../../ultilities/enum/action-role';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'appToolbar',
    templateUrl: './toolbar.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent extends AppComponentBase implements OnInit {
    enable: boolean;

    buttonAddEnable: boolean;
    buttonUpdateEnable: boolean;
    buttonSaveEnable: boolean;
    buttonViewDetailEnable: boolean;
    buttonDeleteEnable: boolean;
    buttonApproveEnable: boolean;
    buttonSearchEnable: boolean;
    buttonResetSearchEnable: boolean;

    buttonAddVisible: boolean;
    buttonUpdateVisible: boolean;
    buttonSaveVisible: boolean;
    buttonViewDetailVisible: boolean;
    buttonDeleteVisible: boolean;
    buttonApproveVisible: boolean;
    buttonSearchVisible: boolean;
    buttonResetSearchVisible: boolean;

    buttonAddHidden: boolean;
    buttonUpdateHidden: boolean;
    buttonSaveHidden: boolean;
    buttonViewDetailHidden: boolean;
    buttonDeleteHidden: boolean;
    buttonApproveHidden: boolean;
    buttonSearchHidden: boolean;
    buttonResetSearchHidden: boolean;

    selectedItem: any;

    uiAction: IUiAction<any>;

    isList: boolean = false;
    isEdit: boolean = false;

    isAssUpdateReport = false;

    funct: string;

    editLabel : string;

    constructor(
        injector: Injector
    ) {
        super(injector);
        this.setButtonAddVisible(false);
        this.setButtonUpdateVisible(false);
        this.setButtonSaveVisible(false);
        this.setButtonDeleteVisible(false);
        this.setButtonApproveVisible(false);
        this.setButtonViewDetailVisible(true);
        this.setButtonSearchVisible(true);
        this.setButtonResetSearchVisible(false);
        this.setButtonSaveVisible(true);
        this.enable = true;

        this.editLabel = this.l("Edit");
    }

    ngOnInit(): void {

    }

    public setUiAction(uiAction: IUiAction<any>): void {
        this.uiAction = uiAction;
    }

    public setEnable(enable: boolean) {
        this.enable = enable;
    }

    public setEnableForListPage(): void {
        this.setButtonAddEnable(true);
        this.setButtonUpdateEnable(false);
        this.setButtonSaveEnable(false);
        this.setButtonViewDetailEnable(false);
        this.setButtonDeleteEnable(false);
        this.setButtonApproveEnable(false);
        this.setButtonSearchEnable(true);
        this.setButtonResetSearchEnable(true);
        this.setButtonResetSearchVisible(true);
        this.selectedItem = null;
        this.isList = true;
    }

    public setEnableForEditPage(): void {
        this.setButtonAddEnable(false);
        this.setButtonUpdateEnable(false);
        this.setButtonSaveEnable(true);
        this.setButtonViewDetailEnable(false);
        this.setButtonDeleteEnable(false);
        this.setButtonApproveEnable(false);
        this.setButtonSearchEnable(false);
        this.setButtonResetSearchEnable(false);
        this.isEdit = true;
    }

    public setEnableForViewDetailPage(): void {
        this.setButtonAddEnable(false);
        this.setButtonUpdateEnable(false);
        this.setButtonSaveEnable(false);
        this.setButtonViewDetailEnable(false);
        this.setButtonDeleteEnable(false);
        this.setButtonApproveEnable(true);
        this.setButtonSearchEnable(false);
        this.setButtonResetSearchEnable(false);
        this.isEdit = true;
    }

    public onSelectRow(item: any): void {
        this.selectedItem = item;
        if (item == null) {
            this.setEnableForListPage();
        }
        else {
            this.setButtonUpdateEnable(true);
            this.setButtonApproveEnable(true);
            this.setButtonViewDetailEnable(true);
            this.setButtonDeleteEnable(true);
        }
    }

    setVisible(add: boolean = false, edit: boolean = false, update: boolean = false, del: boolean = false, view: boolean = false, search: boolean = false, approve: boolean = false, resetSearch: boolean = false) {
        this.isList = true;
        this.isEdit = true;
        this.buttonAddHidden = !add;
        this.buttonUpdateHidden = !edit;
        this.buttonSaveHidden = !update;
        this.buttonViewDetailHidden = !view;
        this.buttonDeleteHidden = !del;
        this.buttonApproveHidden = !approve;
        this.buttonSearchHidden = !search;
        this.buttonResetSearchHidden = !resetSearch;
    }

    setRole(funct: string, add: boolean, edit: boolean, update: boolean, del: boolean, view: boolean, search: boolean, approve: boolean, resetSearch: boolean) {
        this.funct = funct;
        this.setButtonAddVisible(add && this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.Create));
        this.setButtonUpdateVisible(edit && this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.Edit));
        this.setButtonSaveVisible(update && this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.Update));
        this.setButtonDeleteVisible(del && this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.Delete));
        this.setButtonViewDetailVisible(view && this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.View));
        this.setButtonSearchVisible(search && this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.Search));
        this.setButtonResetSearchVisible(true);
        // this.setButtonResetSearchVisible(resetSearch && this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.ResetSearch));
        this.setButtonApproveVisible(approve && this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.Approve));
    }

    setButtonAddEnable(enable: boolean): void {
        if (!this.buttonAddVisible) {
            enable = false;
        }
        this.buttonAddEnable = enable;
    }

    setButtonUpdateEnable(enable: boolean): void {
        if (!this.buttonUpdateVisible) {
            enable = false;
        }
        this.buttonUpdateEnable = enable;
    }

    setButtonSaveEnable(enable: boolean): void {
        if (!this.buttonSaveVisible) {
            enable = false;
        }
        this.buttonSaveEnable = enable;
    }

    setButtonViewDetailEnable(enable: boolean): void {
        if (!this.buttonViewDetailVisible) {
            enable = false;
        }
        this.buttonViewDetailEnable = enable;
    }

    setButtonDeleteEnable(enable: boolean): void {
        if (!this.buttonDeleteVisible) {
            enable = false;
        }
        this.buttonDeleteEnable = enable;
    }

    setButtonApproveEnable(enable: boolean): void {
        if (!this.buttonApproveVisible) {
            enable = false;
        }
        this.buttonApproveEnable = enable;
    }

    setButtonSearchEnable(enable: boolean): void {
        if (!this.buttonSearchVisible) {
            enable = false;
        }
        this.buttonSearchEnable = enable;
    }

    setButtonResetSearchEnable(enable: boolean): void {
        if (!this.buttonResetSearchVisible) {
            enable = false;
        }
        this.buttonResetSearchEnable = enable;
    }

    setButtonAddVisible(visible: boolean): void {
        this.buttonAddVisible = visible;
    }

    setButtonUpdateVisible(visible: boolean): void {
        this.buttonUpdateVisible = visible;
    }

    setButtonSaveVisible(visible: boolean): void {
        this.buttonSaveVisible = visible;
    }

    setButtonViewDetailVisible(visible: boolean): void {
        this.buttonViewDetailVisible = visible;
    }

    setButtonDeleteVisible(visible: boolean): void {
        this.buttonDeleteVisible = visible;
    }

    setButtonApproveVisible(visible: boolean): void {
        this.buttonApproveVisible = visible;
    }

    setButtonSearchVisible(visible: boolean): void {
        this.buttonSearchVisible = visible;
    }

    setButtonResetSearchVisible(visible: boolean): void {
        this.buttonResetSearchVisible = visible;
    }

    hasAction(action) {
        this.permission.isGranted('Pages.Administration.' + this.funct + '.' + action)
    }

    add(): void {
        if (this.uiAction) {
            this.uiAction.onAdd();
        }
    }

    update(): void {
        if (this.selectedItem && this.uiAction) {
            this.uiAction.onUpdate(this.selectedItem);
        }
    }

    save(): void {
        if (this.uiAction) {
            this.uiAction.onSave();
        }
    }

    viewDetail(): void {
        if (this.selectedItem && this.uiAction) {
            this.uiAction.onViewDetail(this.selectedItem);
        }
    }

    delete(): void {
        if (this.selectedItem && this.uiAction) {
            this.uiAction.onDelete(this.selectedItem);
        }
    }

    approve(): void {
        if (this.uiAction) {
            this.uiAction.onApprove(this.selectedItem);
        }
    }

    search(): void {
        if (this.uiAction) {
            $('#alert-message').remove();
            this.uiAction.onSearch();
        }
    }

    resetSearch(): void {
        if (this.uiAction) {
            this.uiAction.onResetSearch();
        }
    }
}
