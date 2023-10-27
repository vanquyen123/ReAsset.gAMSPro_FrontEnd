import { Component, EventEmitter, Injector, Output, ViewChild, ElementRef } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CurrentUserProfileEditDto, SettingScopes,UserConfigurationServiceProxy, ProfileServiceProxy, UpdateGoogleAuthenticatorKeyOutput, CM_DEPARTMENT_ENTITY, CM_BRANCH_ENTITY, DepartmentServiceProxy, BranchServiceProxy, LanguageTextListDto, UserServiceProxy, CreateOrUpdateUserInput, UserEditDto } from '@shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { SmsVerificationModalComponent } from './sms-verification-modal.component';
import { finalize } from 'rxjs/operators';
import { WebConsts } from '@app/ultilities/enum/consts';
import { LoginMethod } from '@app/ultilities/enum/login-method';
import { NgForm } from '@angular/forms';
import { RecordStatusConsts } from '@app/admin/core/ultils/consts/RecordStatusConsts';
import { AuthStatusConsts } from '@app/admin/core/ultils/consts/AuthStatusConsts';
import { LanguageSwitchComponent } from '@account/language-switch.component';
import { XmlHttpRequestHelper } from '@shared/helpers/XmlHttpRequestHelper';

@Component({
    selector: 'mySettingsModal',
    templateUrl: './my-settings-modal.component.html'
})
export class MySettingsModalComponent extends AppComponentBase {

    @ViewChild('mySettingsModal') modal: ModalDirective;
    @ViewChild('smsVerificationModal') smsVerificationModal: SmsVerificationModalComponent;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    public active = false;
    public saving = false;
    public isGoogleAuthenticatorEnabled = false;
    public isPhoneNumberConfirmed: boolean;
    public isPhoneNumberEmpty = false;
    public smsEnabled: boolean;
    public user: CurrentUserProfileEditDto = new CurrentUserProfileEditDto();
    
    public showTimezoneSelection: boolean = abp.clock.provider.supportsMultipleTimezone;
    public canChangeUserName: boolean;
    public defaultTimezoneScope: SettingScopes = SettingScopes.User;
    private _initialTimezone: string = undefined;
    public roles: string;
    
    userDTO: UserEditDto = new UserEditDto();
    departments: CM_DEPARTMENT_ENTITY[];
    languages: any[];
    branchs: CM_BRANCH_ENTITY[];
    email:string

    isNormalLoginMethod = this.setting.get(WebConsts.LoginMethodConsts) == LoginMethod.normal;
    isLdapLoginMethod = this.setting.get(WebConsts.LoginMethodConsts) == LoginMethod.ldap;
    isAdfsLoginMethod = this.setting.get(WebConsts.LoginMethodConsts) == LoginMethod.adfs;

    @ViewChild('DepIdInput') debtSelect: ElementRef;
    @ViewChild('mySettingsModalForm') mySettingsModalForm: NgForm;

    public isShowError = false;
    checkClick: boolean = false;
    // isTwofactorLoginEnable = abp.setting.getBoolean('Abp.Zero.UserManagement.TwoFactorLogin.IsEnabled')
    isTwofactorLoginEnable = abp.setting.getBoolean('App.UserManagement.TwoFactorLogin.IsGoogleAuthenticatorEnabled')

    constructor(
        injector: Injector,
        private _departmentService: DepartmentServiceProxy,
        private _branchService: BranchServiceProxy,
        private _profileService: ProfileServiceProxy,
        private _userService: UserServiceProxy,
        private _userConfigugrationServiceProxy: UserConfigurationServiceProxy
    ) {
        super(injector);
    }
    getLanguage():void{
        this._userConfigugrationServiceProxy.getAllLanguages().subscribe((result)=>
        {
            this.languages=result.languages;
        });
        
    }
    show(): void {
        this.getLanguage();
        this.active = true;
        this.checkClick=true
        this._profileService.getCurrentUserProfileForEdit().subscribe((result) => {
            this.smsEnabled = this.setting.getBoolean('App.UserManagement.SmsVerificationEnabled');
            this.user = result;
            this.email=result.emailAddress;
            this._initialTimezone = result.timezone;
            this.canChangeUserName = this.user.userName !== AppConsts.userManagement.defaultAdminUserName;
            this.modal.show();
            this.isGoogleAuthenticatorEnabled = result.isGoogleAuthenticatorEnabled;
            this.isPhoneNumberConfirmed = result.isPhoneNumberConfirmed;
            this.isPhoneNumberEmpty = result.phoneNumber === '';
            this.roles = result.roles.map((x) => { return x.roleName }).join(',');
            this.onChangeBranch(this.user.subbrId);
            //this.userDTO.id=
            this.updateView();
        });

        var filterCombobox: any = {
            maxResultCount: -1,
            recorD_STATUS: RecordStatusConsts.Active,
            autH_STATUS: AuthStatusConsts.Approve
        };

        this._branchService.cM_BRANCH_Search(filterCombobox).subscribe(response => {
            this.branchs = response.items;
        })
    }

    onChangeBranch(brancH_ID) {
        var filterCombobox: any = {
            maxResultCount: -1,
            recorD_STATUS: RecordStatusConsts.Active,
            autH_STATUS: AuthStatusConsts.Approve,
            brancH_ID: brancH_ID ? brancH_ID : '-'
        };

        this._departmentService.cM_DEPARTMENT_Search(filterCombobox).subscribe(response => {
            this.departments = response.items;
            this.updateView();
        });
    }

    updateQrCodeSetupImageUrl(): void {
        this._profileService.updateGoogleAuthenticatorKey().subscribe((result: UpdateGoogleAuthenticatorKeyOutput) => {
            this.user.qrCodeSetupImageUrl = result.qrCodeSetupImageUrl;
            this.isGoogleAuthenticatorEnabled = true;
        });
    }

    smsVerify(): void {
        this._profileService.sendVerificationSms()
            .subscribe(() => {
                this.smsVerificationModal.show();
            });
    }

    changePhoneNumberToVerified(): void {
        this.isPhoneNumberConfirmed = true;
    }

    onShown(): void {
        //document.getElementById('Name').focus();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    save(): void {
        if ((this.mySettingsModalForm as any).form.invalid) {
            this.isShowError = true;
            this.message.error(this.l('FormInvalid'), this.l('ErrorTitle'));
            return;
        }

        this.saving = true;
        this._profileService.updateCurrentUserProfile(this.user)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.appSession.user.name = this.user.name;
                this.appSession.user.surname = this.user.surname;
                this.appSession.user.userName = this.user.userName;
                this.appSession.user.emailAddress = this.user.emailAddress;

                this.close();
                this.modalSave.emit(null);

                setTimeout(() => {
                    this.showSuccessMessage(this.l('SavedSuccessfully'));
                    window.location.reload(); 
                }, 500);

                if (abp.clock.provider.supportsMultipleTimezone && this._initialTimezone !== this.user.timezone) {
                    this.message.info(this.l('TimeZoneSettingChangedRefreshPageNotification')).then(() => {
                        window.location.reload();
                    });
                }
                
            });
        
    }
    emailChange() {
        if (this.email==this.user.emailAddress &&this.user.emailAddress ==''){
            this.checkClick = true;
            this.updateView();
        }
        else {
            this.checkClick = false;
            this.updateView();
        }
       
    }
    sendConfirmEmail(){

        //this.userDTO.markerId = this.appSession.user.userName;
        //this.userDTO.userName=this.user.userName.trim();

        /*input.user = this.userDTO;
        input.user.isActive = false;
        input.sendActivationEmail = true;
        input.user.isEmailConfirmed = false;*/
        this.user.type='UPDATEMAIL'
        this._profileService.updateCurrentUserProfile(this.user)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.modalSave.emit(null);
                this.message.success(this.l('ActivationMailSentMessage'), this.l('MailSent')).then(() => {
                this.checkClick = true;
                this.updateView();
            });
            });

        // this._sendMailConfirm.sendEmailActivationLink(this.user)
        //     .pipe(finalize(() => { }))
        //     .subscribe(() => {
        //         this.message.success(this.l('ActivationMailSentMessage'), this.l('MailSent')).then(() => {
        //             this.checkClick = true;
        //             this.updateView();
        //         });
        //     });
    }
}
