import { ToolbarComponent } from "../toolbar/toolbar.component";
import { Component, ViewChild } from "@angular/core";
import { IUiActionRejectExt } from "@app/ultilities/ui-action-re";
import { ActionRole } from "@app/ultilities/enum/action-role";

@Component({
    selector: 'appToolbar_re',
    templateUrl: './toolbar-reject-ext.component.html',
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarRejectExtComponent extends ToolbarComponent {


    buttonRejectEnable: boolean;
    buttonRejectVisible: boolean;
    buttonRejectHidden: boolean;
    buttonAccessEnable: boolean;
    buttonAccessVisible: boolean;
    buttonAccessHidden:boolean;
    buttonApproveKSSHidden: boolean;
    buttonApproveKSSVisible: boolean;
    buttonApproveKSSEnable:boolean;
    buttonAccessStorekeepersEnable: boolean;
    buttonAccessStorekeepersVisible: boolean;
    buttonAccessStorekeepersHidden:boolean;
    buttonApproveDeputyHidden: boolean;
    buttonApproveDeputyVisible: boolean;
    buttonApproveDeputyEnable:boolean;
    buttonApproveKhoiVisible: boolean;
    buttonApproveKhoiEnable:boolean;
    buttonApproveKhoiHidden: boolean;

    buttonFinishCheckVisible: boolean;
    buttonFinishCheckEnable:boolean;
    buttonFinishCheckHidden: boolean;
    //collateral
    buttonRevokeEnable: boolean;
    buttonRevokeVisible: boolean;
    buttonRevokeHidden: boolean;
    @ViewChild("rejectModal") rejectModal;
    @ViewChild("revokeModal") revokeModal;

    setRole(funct: string, add: boolean, edit: boolean, update: boolean, del: boolean, view: boolean, search: boolean, approve: boolean, resetSearch: boolean, reject?: boolean, revoke?: boolean, forecast?: boolean, access?: boolean
        ,approveKSS?:boolean,AccessStorekeepers?:boolean,ApproveDeputy?:boolean,ApproveKhoi?:boolean,FinishCheck?:boolean) {
        super.setRole(funct, add, edit, update, del, view, search, approve, resetSearch, forecast);

        // if (reject) {
        //     this.setButtonRejectVisible(reject &&this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.Reject));
        //     this.setButtonRejecHidden(reject &&!this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.Reject));
        // }
        // else
        // {
        //     this.setButtonRejecHidden(!this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.Reject));
        // }
        if (reject) {
            this.setButtonRejectVisible(true);
            this.setButtonRejecHidden(false);
        }
        else
        {
            this.setButtonRejecHidden(false);
        }
        // if (access) {
        //     this.setButtonAccessVisible(access && this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.Access));
        //     this.setButtonaAccessHidden(access && !this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.Access));
        // }
        // else
        // {
        //     this.setButtonaAccessHidden(!this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.Access));
        // }
        this.setButtonaAccessHidden(true)
        if (approveKSS) {
            this.setButtonApproveKSSVisible(approveKSS && this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.ApproveKSS));
            this.setButtonApproveKSSHidden(approveKSS && !this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.ApproveKSS));
        }
        else
        {
            this.setButtonApproveKSSHidden( !this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.ApproveKSS));
        }
        if (AccessStorekeepers) {
            this.setButtonAccessStorekeepersVisible(AccessStorekeepers && this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.AccessStorekeepers));
            this.setButtonAccessStorekeepersHidden(AccessStorekeepers && !this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.AccessStorekeepers));
        }
        else
        {
            this.setButtonAccessStorekeepersHidden(!this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.AccessStorekeepers));
        }
        if (ApproveDeputy) {
            this.setButtonApproveDeputyVisible(ApproveDeputy && this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.ApproveDeputy));
            this.setButtonApproveDeputyHidden(ApproveDeputy && !this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.ApproveDeputy));
        }
        else
        {
            this.setButtonApproveDeputyHidden( !this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.ApproveDeputy));
        }
        if (ApproveKhoi) {
            this.setButtonApproveKhoiVisible(ApproveKhoi && this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.ApproveKhoi));
            this.setButtonApproveKhoiHidden(ApproveKhoi && !this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.ApproveKhoi));
        }
        else
        {
            this.setButtonApproveKhoiHidden( !this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.ApproveKhoi));
        }
        if (FinishCheck) {
            this.setButtonFinishCheckVisible(FinishCheck && this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.FinishCheck));
            this.setButtonFinishCheckHidden(FinishCheck && !this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.FinishCheck));
        }
        else
        {
            this.setButtonFinishCheckHidden( !this.permission.isGranted('Pages.Administration.' + funct + '.' + ActionRole.FinishCheck));
        }
        if (revoke) {
            this.setButtonRevokeVisible(true);
            this.setButtonRevokeHidden(false);
        }
        else
        {
            this.setButtonRevokeHidden(false);
        }
    }
    get uiActionRejectExt(): IUiActionRejectExt<any> {
        return this.uiAction as IUiActionRejectExt<any>;
    }
    

    public setEnableForListPage(): void {
        super.setEnableForEditPage();
        this.setButtonRejectEnable(false);
        this.setButtonAccessEnable(true);
    }

    public setEnableForEditPage(): void {
        super.setEnableForEditPage();
        this.setButtonRejectEnable(false);
        this.setButtonAccessEnable(false);
        this.setButtonApproveEnable(false);
        this.setButtonAccessStorekeepersEnable(false);
        this.setButtonApproveDeputyEnable(false);
        this.setButtonApproveKSSEnable(false);
        this.setButtonApproveKhoiEnable(false);
        this.setButtonFinishCheckEnable(false)
        this.setButtonRevokeEnable(false)
    }

    public setEnableForViewDetailPage(): void {
        super.setEnableForViewDetailPage();
        this.setButtonRejectEnable(true);
        this.setButtonAccessEnable(true);
        this.setButtonApproveEnable(true);
        this.setButtonAccessStorekeepersEnable(true);
        this.setButtonApproveDeputyEnable(true);
        this.setButtonApproveKSSEnable(true);
        this.setButtonApproveKhoiEnable(true);
        this.setButtonFinishCheckEnable(true);
        this.setButtonRevokeEnable(true)
    }
    // reject
    setButtonRejectEnable(enable: boolean): void {
        if (!this.buttonRejectVisible) {
           enable = false;
        }
        this.buttonRejectEnable = enable;
    }
    setButtonRejectVisible(visible: boolean): void {
        this.buttonRejectVisible = visible;
    }
    reject(): void {
        this.rejectModal.show();
    }
    rejectAction(rejectReason: string): void {
        if (this.uiActionRejectExt) {
            this.uiActionRejectExt.onReject(rejectReason);
        }
    }
    setButtonRejecHidden(hidden: boolean): void {
        
        this.buttonRejectHidden = hidden;
    }
    //access
    setButtonAccessEnable(enable: boolean): void {
        if (!this.buttonAccessVisible) {
            enable = false;
        }
        this.buttonAccessEnable = enable;
    }
    setButtonAccessVisible(visible: boolean): void {
        this.buttonAccessVisible = visible;
    }
    access(): void {
        if (this.uiActionRejectExt) {
            this.uiActionRejectExt.onAccess(this.selectedItem);
        }
    }
    setButtonaAccessHidden(hidden: boolean): void {
        this.buttonAccessHidden = hidden;
    }
    //apprkss
    setButtonApproveKSSEnable(enable: boolean): void {
        if (!this.buttonApproveKSSVisible) {
            enable = false;
        }
        this.buttonApproveKSSEnable = enable;
    }
    setButtonApproveKSSVisible(visible: boolean): void {
        this.buttonApproveKSSVisible = visible;
    }
    approveKSS(): void {
        if (this.uiActionRejectExt) {
            this.uiActionRejectExt.onApproveKSS(this.selectedItem);
        }
    }
    setButtonApproveKSSHidden(hidden: boolean): void {
        this.buttonApproveKSSHidden = hidden;
    }
    //AccessStorekeepers
    setButtonAccessStorekeepersEnable(enable: boolean): void {
        if (!this.buttonAccessStorekeepersVisible) {
            enable = false;
        }
        this.buttonAccessStorekeepersEnable = enable;
    }
    setButtonAccessStorekeepersVisible(visible: boolean): void {
        this.buttonAccessStorekeepersVisible = visible;
    }
    accessStorekeepers(): void {
        if (this.uiActionRejectExt) {
            this.uiActionRejectExt.onAccessStorekeepers(this.selectedItem);
        }
    }
    setButtonAccessStorekeepersHidden(hidden: boolean): void {
        this.buttonAccessStorekeepersHidden = hidden;
    }
    //ApproveDeputy
    setButtonApproveDeputyEnable(enable: boolean): void {
        if (!this.buttonApproveDeputyVisible) {
            enable = false;
        }
        this.buttonApproveDeputyEnable = enable;
    }
    setButtonApproveDeputyVisible(visible: boolean): void {
        this.buttonApproveDeputyVisible = visible;
    }
    approveDeputy(): void {
        if (this.uiActionRejectExt) {
            this.uiActionRejectExt.onApproveDeputy(this.selectedItem);
        }
    }
    setButtonApproveDeputyHidden(hidden: boolean): void {
        this.buttonApproveDeputyHidden = hidden;
    }
    //ApproveKhoi
    setButtonApproveKhoiEnable(enable: boolean): void {
        if (!this.buttonApproveKhoiVisible) {
            enable = false;
        }
        this.buttonApproveKhoiEnable = enable;
    }
    setButtonApproveKhoiVisible(visible: boolean): void {
        this.buttonApproveKhoiVisible = visible;
    }
    approveKhoi(): void {
        if (this.uiActionRejectExt) {
            this.uiActionRejectExt.onApproveKhoi(this.selectedItem);
        }
    }
    setButtonApproveKhoiHidden(hidden: boolean): void {
        this.buttonApproveKhoiHidden = hidden;
    }
    //FinishCheck
    setButtonFinishCheckEnable(enable: boolean): void {
        if (!this.buttonFinishCheckVisible) {
            enable = false;
        }
        this.buttonFinishCheckEnable = enable;
    }
    setButtonFinishCheckVisible(visible: boolean): void {
        this.buttonFinishCheckVisible = visible;
    }
    FinishCheck(): void {
        if (this.uiActionRejectExt) {
            this.uiActionRejectExt.onFinishCheck(this.selectedItem);
        }
    }
    setButtonFinishCheckHidden(hidden: boolean): void {
        this.buttonFinishCheckHidden = hidden;
    }

    // reject
    setButtonRevokeEnable(enable: boolean): void {
        if (!this.buttonRejectVisible) {
           enable = false;
        }
        this.buttonRevokeEnable = enable;
    }
    setButtonRevokeVisible(visible: boolean): void {
        this.buttonRevokeVisible = visible;
    }
    revoke(): void {
        this.revokeModal.show();
        // if (this.uiActionRejectExt) {
        //     this.uiActionRejectExt.onRevoke(revokeReason);
        // }
    }
    revokeAction(revokeReason): void {
        if (this.uiActionRejectExt) {
            this.uiActionRejectExt.onRevoke(revokeReason);
        }
    }
    setButtonRevokeHidden(hidden: boolean): void {
        
        this.buttonRevokeHidden = hidden;
    }
}
