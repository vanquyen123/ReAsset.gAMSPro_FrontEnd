import { IUiAction } from "./ui-action";

export interface IUiActionRejectExt<TList> extends IUiAction<TList>
{
    onReject(item : TList) : void;
    onAccess(item : TList) : void;
    onApproveKSS(item : TList) : void;
    onAccessStorekeepers(item : TList) : void;
    onApproveDeputy(item : TList) : void;
    onApproveKhoi(item : TList) : void;
    onFinishCheck(item : TList) : void;
}