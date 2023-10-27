import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { Injectable, Optional, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { Data, Route } from '@node_modules/@angular/router/src/config';
import { Observable } from '@node_modules/rxjs/internal/Observable';
import { LoginMethod } from '@app/ultilities/enum/login-method';
import { AuthenticateResultModel, ImpersonateOutput, API_BASE_URL } from '@shared/service-proxies/service-proxies';
import { LoginService } from '@account/login/login.service';

@Injectable()
export class AppRouteGuard implements CanActivate, CanActivateChild, CanLoad {

	constructor(
		private _permissionChecker: PermissionCheckerService,
		private _router: Router,
		private activeRoute: ActivatedRoute,
		public loginService: LoginService,
		private _sessionService: AppSessionService,
		@Optional() @Inject(API_BASE_URL) baseUrl?: string
	) {

		this.adfsRemoteUrl = (baseUrl ? baseUrl : "") + '/api/TokenAuth/LoginAdfs';
	}

	adfsRemoteUrl: string;
	getRouteParam(key: string): any {
		return (this.activeRoute.params as any).value[key];
	}

	canActivateInternal(data: Data, state: RouterStateSnapshot): boolean {
		if (UrlHelper.isInstallUrl(location.href)) {
			return true;
		}

		// if (!this._sessionService.user) {
		//     this._router.navigate(['/account/login']);
		//     return false;
		// }

		if (!this._sessionService.user) {
			if (abp.setting.get('gAMSProCore.LoginMethod') == LoginMethod.adfs) {
				let method = this.getRouteParam('method');
				let token = this.getRouteParam('token');
				let userId = this.getRouteParam('userId');
				let tenantId = this.getRouteParam('TenantId');
				let status = this.getRouteParam('status');

				let authenticateResultModel = new AuthenticateResultModel();
				authenticateResultModel.impersonateOutput = new ImpersonateOutput();

				if (method == 'adfs') {

					if (status == 'success') {
						authenticateResultModel.impersonateOutput.impersonationToken = token;
						authenticateResultModel.impersonateOutput.userId = userId;
						authenticateResultModel.impersonateOutput.tenancyId = tenantId;
						authenticateResultModel.isLoginNoPassword = true;
						this.loginService.processAuthenticateResult(authenticateResultModel);
					}
				}
				else {
					if (!token) {
						window.location.href = this.adfsRemoteUrl;
					}
				}
			}
			else {
				this._router.navigate(['/account/login']);
			}
			return false;
		}

		if (!data || !data['permission']) {
			return true;
		}

		if (this._permissionChecker.isGranted(data['permission'])) {
			return true;
		}

		this._router.navigate([this.selectBestRoute()]);
		return false;
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this.canActivateInternal(route.data, state);
	}

	canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		return this.canActivate(route, state);
	}

	canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
		return this.canActivateInternal(route.data, null);
	}

	selectBestRoute(): string {

		if (!this._sessionService.user) {
			return '/account/login';
		}

		return '/app/admin/dashboard';

		if (this._permissionChecker.isGranted('Pages.Administration.Host.Dashboard')) {
			return '/app/admin/hostDashboard';
		}

		if (this._permissionChecker.isGranted('Pages.Tenant.Dashboard')) {
			return '/app/main/dashboard';
		}

		if (this._permissionChecker.isGranted('Pages.Tenants')) {
			return '/app/admin/tenants';
		}

		if (this._permissionChecker.isGranted('Pages.Administration.Users')) {
			return '/app/admin/users';
		}

		return '/app/notifications';
	}
}
