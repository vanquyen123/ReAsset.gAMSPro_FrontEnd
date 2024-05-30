import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '@app/admin/core/controls/toolbar/toolbar.component';
import { TableModule } from 'primeng/table';
import { TreeModule } from 'primeng/tree';
import { AuthStatusComponent } from '@app/admin/core/controls/auth-status/auth-status.component';
import { UtilsModule } from '@shared/utils/utils.module';
import { Select2CustomComponent } from '@app/admin/core/controls/custom-select2/select2-custom.component';
import { ControlComponent } from '@app/admin/core/controls/control.component';
import { AllCodeSelectComponent } from '../controls/allCodes/all-code-select.component';
import { ModalModule, TabsModule, TooltipModule, PopoverModule, BsDropdownModule, BsDatepickerModule } from 'ngx-bootstrap';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { AutoCompleteModule, EditorModule, FileUploadModule as PrimeNgFileUploadModule, InputMaskModule, PaginatorModule, FileUploadModule, DragDropModule, ContextMenuModule, ProgressBarModule } from 'primeng/primeng';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TextMaskModule } from 'angular2-text-mask';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CoreTableComponent } from '../controls/core-table/core-table.component';
import { TreeRadioSelectComponent } from '../controls/tree-select-radio/tree-radio-select.component';
import { AppPermissionTreeComponent } from '../controls/app-permission-tree/app-permission-tree.component';
import { PopupTableBaseComponent } from '../controls/popup-table-base/popup-table-base.component';
import { CheckboxControlComponent } from '../controls/checkbox-control/checkbox-control.component';
import { PermissionSelectorComponent } from '../controls/permission-selector/permission-selector.component';
import { TreeCheckboxSelectComponent } from '../controls/tree-checkbox-select/tree-checkbox-select.component';
import { AuthStatusInputPageComponent } from '../controls/auth-status-input-page/auth-status-input-page.component';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import { MoneyInputComponent } from '../controls/money-input/money-input.component';
import { DateFormatPipe } from '../pipes/date-format.pipe';
import { MoneyFormatPipe } from '../pipes/money-format.pipe';
import { EditableTableComponent } from '../controls/editable-table/editable-table.component';
import { PopupFrameComponent } from '../controls/popup-frames/popup-frame.component';
import { CustomFlatpickrComponent } from '../controls/custom-flatpickr/custom-flatpickr.component';
import { FilePickerComponent } from '../controls/file-picker/file-picker.component';
import { ToolbarRejectExtComponent } from '../controls/toolbar-reject-ext/toolbar-reject-ext.component';
import { RejectModalComponent } from '../controls/reject-modals/reject-modal.component';
import { AutoCompleteComponent } from '../controls/auto-complete/auto-complete.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { CkeditorControlComponent } from '../controls/ckeditor-control/ckeditor-control.component';
import { SupplierModalComponent } from '../controls/supplider-modal/supplier-modal.component';
import { RadioControlComponent } from '../controls/radio-control/radio-control.component';
import { BranchModalComponent } from '../controls/branch-modal/branch-modal.component';
import { UserModalComponent } from '../controls/users-modal/user-modal.component';
import { RoleComboComponent } from '@app/admin/zero-base/shared/role-combo.component';
import { DisplayComponent } from '../controls/display/display.component';
import { GoodsRealModalComponent } from '../controls/goodstype-real-modal/goodstype-real-modal.component';
import { ReportNoteModalComponent } from '../controls/report-note-modal/report-note-modal.component';
import { ReportTemplateModalComponent } from '../controls/report-template-modal/report-template-modal.component';
import { CodeScannerComponent } from '../controls/code-scanner/code-scanner/code-scanner.component';
import { AppInfoDialogComponent } from '../controls/code-scanner/app-info-dialog/app-info-dialog.component';
import { AppInfoComponent } from '../controls/code-scanner/app-info/app-info.component';
import { FormatsDialogComponent } from '../controls/code-scanner/formats-dialog/formats-dialog.component';
import { WebcamModule } from 'ngx-webcam';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import {ZXingScannerModule} from '@zxing/ngx-scanner'
import { DisabledInputComponent } from '../controls/disabledInput/disabled-input.component';
import { DepartmentModalComponent } from '../controls/dep-modal/department-modal.component';
import { DivisionModalComponent } from '../controls/division-modal/division-modal.component';
import { EmployeeModalComponent } from '../controls/employee-modal/employee-modal.component';
import { FileMultiComponent } from '../controls/file-picker/file-multi.component';
import { DateTimeFormatPipe } from '../pipes/date-time-format.pipe';
import { TermFormatPipe } from '../pipes/term-format.pipe';
import { ImportExcelComponent } from '../controls/import-excel/import-excel.component';
import { ImportExcelMultiComponent } from '../controls/import-excel-multi/import-excel-multi.component';
import { LocationControlComponent } from '../controls/localtion-control/location-control.component';
import { BranchLevComponent } from '../controls/branch-lev/branch-lev.component';
import { Paginator2Component } from '../controls/p-paginator2/p-paginator2.component';
import { FileUploaderComponent } from '../controls/file-uploader/file-uploader.component';
import { FileUploaderMultiModalComponent } from '../controls/file-uploader/file-uploader-multi-modal.component';
import { HttpModule } from '@angular/http';
import { SideBarMenuComponent } from '@app/shared/layout/nav/side-bar-menu.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import * as ngCommon from '@angular/common';

import { AppRoutingModule } from '@app/app-routing.module';
import { TopBarComponent } from '@app/shared/layout/topbar.component';
import { CoreModule } from '@metronic/app/core/core.module';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { AbpModule } from 'abp-ng2-module/dist/src/abp.module';
import { LSelect2Module } from 'ngx-select2';
import { DefaultBrandComponent } from '@app/shared/layout/themes/default/default-brand.component';
import { DefaultLayoutComponent } from '@app/shared/layout/themes/default/default-layout.component';
import { Theme2LayoutComponent } from '@app/shared/layout/themes/theme2/theme2-layout.component';
import { Theme3LayoutComponent } from '@app/shared/layout/themes/theme3/theme3-layout.component';
import { Theme4LayoutComponent } from '@app/shared/layout/themes/theme4/theme4-layout.component';
import { Theme5LayoutComponent } from '@app/shared/layout/themes/theme5/theme5-layout.component';
import { Theme6LayoutComponent } from '@app/shared/layout/themes/theme6/theme6-layout.component';
import { Theme7LayoutComponent } from '@app/shared/layout/themes/theme7/theme7-layout.component';
import { Theme8LayoutComponent } from '@app/shared/layout/themes/theme8/theme8-layout.component';
import { Theme9LayoutComponent } from '@app/shared/layout/themes/theme9/theme9-layout.component';
import { Theme10LayoutComponent } from '@app/shared/layout/themes/theme10/theme10-layout.component';
import { Theme11LayoutComponent } from '@app/shared/layout/themes/theme11/theme11-layout.component';
import { Theme12LayoutComponent } from '@app/shared/layout/themes/theme12/theme12-layout.component';
import { HeaderNotificationsComponent } from '@app/shared/layout/notifications/header-notifications.component';
import { TopBarMenuComponent } from '@app/shared/layout/nav/top-bar-menu.component';
import { MenuListComponent } from '@app/shared/layout/nav/menu-list/menu-list.component';
import { FooterComponent } from '@app/shared/layout/footer.component';
import { LoginAttemptsModalComponent } from '@app/shared/layout/login-attempts-modal.component';
import { LinkedAccountsModalComponent } from '@app/shared/layout/linked-accounts-modal.component';
import { LinkAccountModalComponent } from '@app/shared/layout/link-account-modal.component';
import { ChangePasswordModalComponent } from '@app/shared/layout/profile/change-password-modal.component';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';
import { MySettingsModalComponent } from '@app/shared/layout/profile/my-settings-modal.component';
import { SmsVerificationModalComponent } from '@app/shared/layout/profile/sms-verification-modal.component';
import { NotificationsComponent } from '@app/shared/layout/notifications/notifications.component';
import { ChatBarComponent } from '@app/shared/layout/chat/chat-bar.component';
import { ThemeSelectionPanelComponent } from '@app/shared/layout/theme-selection/theme-selection-panel.component';
import { ChatFriendListItemComponent } from '@app/shared/layout/chat/chat-friend-list-item.component';
import { NotificationSettingsModalComponent } from '@app/shared/layout/notifications/notification-settings-modal.component';
import { ChatMessageComponent } from '@app/shared/layout/chat/chat-message.component';
import { Theme2BrandComponent } from '@app/shared/layout/themes/theme2/theme2-brand.component';
import { Theme3BrandComponent } from '@app/shared/layout/themes/theme3/theme3-brand.component';
import { Theme4BrandComponent } from '@app/shared/layout/themes/theme4/theme4-brand.component';
import { Theme5BrandComponent } from '@app/shared/layout/themes/theme5/theme5-brand.component';
import { Theme6BrandComponent } from '@app/shared/layout/themes/theme6/theme6-brand.component';
import { Theme7BrandComponent } from '@app/shared/layout/themes/theme7/theme7-brand.component';
import { Theme8BrandComponent } from '@app/shared/layout/themes/theme8/theme8-brand.component';
import { Theme9BrandComponent } from '@app/shared/layout/themes/theme9/theme9-brand.component';
import { Theme10BrandComponent } from '@app/shared/layout/themes/theme10/theme10-brand.component';
import { Theme11BrandComponent } from '@app/shared/layout/themes/theme11/theme11-brand.component';
import { Theme12BrandComponent } from '@app/shared/layout/themes/theme12/theme12-brand.component';
import { ImpersonationService } from '@app/admin/zero-base/users/impersonation.service';
import { LinkedAccountService } from '@app/shared/layout/linked-account.service';
import { UserNotificationHelper } from '@app/shared/layout/notifications/UserNotificationHelper';
import { AttachFileServiceProxy } from '@shared/service-proxies/service-proxies';
import { ChatSignalrService } from '@app/shared/layout/chat/chat-signalr.service';
import { LayoutConfigService } from '@metronic/app/core/services/layout-config.service';
import { UtilsService } from 'abp-ng2-module/dist/src/utils/utils.service';
import { LayoutRefService } from '@metronic/app/core/services/layout/layout-ref.service';
import { FileSystemUploaderComponent } from '../controls/file-system-uploader/file-system-uploader.component';
import { UploadSystemFile } from '@app/admin/common/upload-system-file/upload-system-file.component';
import { RouterModule } from '@angular/router';
import { SelectMultiComponent } from '../controls/select-multi/select-multi.component';

//import { MwcollateralModalComponent } from '../controls/mw-collateral-modal/mw-collateral-modal.component';
import { NumberFormatPipe } from '../pipes/number-format.pipe';
import { ImageCarouselComponent } from '../controls/image-carousel/image-carousel.component';
import { ImageCarouselUploadModalComponent } from '../controls/image-carousel/image-carousel-upload-modal.component';
import { BarChartDashboardComponent } from "@app/admin/core/controls/bar-chart-dashboard/bar-chart-dashboard.component";
import { PieChartDashboardComponent } from "@app/admin/core/controls/pie-chart-dashboard/pie-chart-dashboard.component";
import { ChartsModule } from 'ng2-charts';
import { TotalNBVComponent } from '@app/admin/common/dashboard/chart_01/total-nbv.component';
import { ClassificationByNatureComponent } from '@app/admin/common/dashboard/chart_02/classification-by-nature.component';
import { FixedAssetsAndNBVComponent } from '@app/admin/common/dashboard/chart_03/fixed-assets-and-nbv.component';
import { NBVOfFaInPlanComponent } from '@app/admin/common/dashboard/chart_05/nbv-of-fa-plan.component';
import { NBVByCostCenterComponent } from '@app/admin/common/dashboard/chart_06/nbv-by-cost-center.component';
import { DetailOfFaComponent } from '@app/admin/common/dashboard/chart_04/detail-of-fa.component';
import { MoneyInputCustomComponent } from '../controls/money-input-custom/money-input-custom.component';
import { AuthStatus2InputPageComponent } from '../controls/auth-status-2-input-page/auth-status-2-input-page.component';
import { IsBlockInputPageComponent } from '../controls/is-block-input-page/is-block-input-page.component';
import { ReaModalComponent } from '../controls/rea-modal/rea-modal.component';
import { ProjectModalComponent } from '../controls/project-modal/project-modal.component';
import { LandAreaModalComponent } from '../controls/land-area-modal/land-area-modal.component';
import { SodoModalComponent } from '../controls/sodo-modal/sodo-modal.component';
import { AssetModalComponent } from '../controls/asset-modal/asset-modal.component';
import { RevokeModalComponent } from '../controls/revoke-modals/revoke-modal.component';
import { ProjectSodoChart } from '@app/admin/common/dashboard/project-sodo-chart/project-sodo-chart.component';
import { ExpiredContractChart } from '@app/admin/common/dashboard/expired-contract-chart/expired-contract-chart.component';
import { ExpiredMortgageChart } from '@app/admin/common/dashboard/expired-mortgage-chart/expired-mortgage-chart.component';
import { MortgageProgressChart } from '@app/admin/common/dashboard/mortgage-progress-chart/mortgage-progress-chart.component';
import { ProjectTypeChart } from '@app/admin/common/dashboard/project-type-chart/project-type-chart.component';
import { Top10Project } from '@app/admin/common/dashboard/top10-project/top10-project.component';
import { FileSelectorComponent } from '../controls/file-selector/file-selector.component';
import { InvestPropModalComponent } from '../controls/invest-prop-modal/invest-prop-modal.component';
import { RevenueChart } from '@app/admin/common/dashboard/revenue-chart/revenue-chart.component';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    // suppressScrollX: true
};

export const commonDeclarationDeclarations = [
    ToolbarComponent,
    Paginator2Component,
    Select2CustomComponent,
    SelectMultiComponent,
    AuthStatusComponent,
    ControlComponent,
   
    AllCodeSelectComponent,
    CoreTableComponent,
    TreeRadioSelectComponent,
    AppPermissionTreeComponent,
    PopupTableBaseComponent,
    CheckboxControlComponent,
    TreeCheckboxSelectComponent,
    AuthStatusInputPageComponent,
    AuthStatus2InputPageComponent,
    MoneyInputComponent,
    MoneyInputCustomComponent,
    EditableTableComponent,
    DateFormatPipe,
    DateTimeFormatPipe,
    TermFormatPipe,
    MoneyFormatPipe,
    NumberFormatPipe,
    PopupFrameComponent,
    CustomFlatpickrComponent,
    FilePickerComponent,
    PermissionSelectorComponent,
    ToolbarRejectExtComponent,
    RejectModalComponent,
    AutoCompleteComponent,
    SupplierModalComponent,
    RadioControlComponent,
    CkeditorControlComponent,
    BranchModalComponent,
    RoleComboComponent,
    UserModalComponent,
    DisplayComponent,
    GoodsRealModalComponent,
    ReportNoteModalComponent,
    ReportTemplateModalComponent,
    AppInfoDialogComponent,
    AppInfoComponent,
    CodeScannerComponent,
    FormatsDialogComponent,
    DisabledInputComponent,
    DepartmentModalComponent,
    DivisionModalComponent,
    EmployeeModalComponent,
    FileMultiComponent,
    FileUploaderMultiModalComponent,
    LocationControlComponent,
    BranchLevComponent,
    FileUploaderComponent,
    FileSystemUploaderComponent,
    UploadSystemFile,
    ImportExcelComponent,
    ImportExcelMultiComponent,
    //MwcollateralModalComponent,
    ImageCarouselComponent,
    ImageCarouselUploadModalComponent,
    BarChartDashboardComponent,
    PieChartDashboardComponent,

    //TienLee
    TotalNBVComponent,
    ClassificationByNatureComponent,
    FixedAssetsAndNBVComponent,
    NBVOfFaInPlanComponent,
    NBVByCostCenterComponent,
    DetailOfFaComponent,
    IsBlockInputPageComponent,

    // collateral
    ReaModalComponent,
    ProjectModalComponent,
    LandAreaModalComponent,
    SodoModalComponent,
    AssetModalComponent,
    RevokeModalComponent,
    FileSelectorComponent,
    InvestPropModalComponent,
    // dashboard chart
    ProjectSodoChart,
    ExpiredContractChart,
    ExpiredMortgageChart,
    MortgageProgressChart,
    ProjectTypeChart,
    Top10Project,
    RevenueChart,
];

@NgModule({
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        ModalModule.forRoot(),
        TreeModule,
        NgxCleaveDirectiveModule,
        UtilsModule,
        CKEditorModule,
        PaginatorModule,
        MatDialogModule,
        HttpModule,
        ZXingScannerModule,
        MatSelectModule,
        MatListModule,
        TableModule,
        RouterModule,
        WebcamModule,
        ChartsModule,
        NgxChartsModule
    ],
    declarations: [
        commonDeclarationDeclarations
    ],
    exports: [
        commonDeclarationDeclarations
    ],
    providers: [

    ]
})
export class CommonDeclarationDeclarationModule {

}

export const commonDeclarationImports = [
    ReactiveFormsModule,
    FileUploadModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AppCommonModule,

    // PrimeNgFileUploadModule,
    InputMaskModule,
    TextMaskModule,
    ImageCropperModule,
    TableModule,
    TreeModule,
    DragDropModule,
    ContextMenuModule,
    PaginatorModule,
    AutoCompleteModule,
    UtilsModule,
    EditorModule,
    FormsModule,
    HttpModule,
    NgxCleaveDirectiveModule,
    CKEditorModule,
    CommonDeclarationDeclarationModule,
    WebcamModule,
    ZXingScannerModule,
    MatSelectModule,
    MatListModule,
    NgxChartsModule,
];

@NgModule({
    imports: [
        ngCommon.CommonModule,
        FormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        FileUploadModule,
        AbpModule,
        AppRoutingModule,
        UtilsModule,
        AppCommonModule.forRoot(),
        ServiceProxyModule,
        TableModule,
        PaginatorModule,
        PrimeNgFileUploadModule,
        ProgressBarModule,
        PerfectScrollbarModule,
        CoreModule,
        NgxChartsModule,
        TextMaskModule,
        ImageCropperModule,
        CommonDeclarationDeclarationModule,
        LSelect2Module
    ],
    declarations: [
        HeaderNotificationsComponent,
        TopBarComponent,
        DefaultBrandComponent,
        SideBarMenuComponent
    ],
    exports: [
        HeaderNotificationsComponent,
        TopBarComponent,
        DefaultBrandComponent,
        SideBarMenuComponent,
    ],
    providers: [
        ImpersonationService,
        LinkedAccountService,
        UserNotificationHelper,
        AttachFileServiceProxy,
        ChatSignalrService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        LayoutConfigService,
        UtilsService,
        LayoutRefService
    ]
})
export class SideBarMenuModule {

}
