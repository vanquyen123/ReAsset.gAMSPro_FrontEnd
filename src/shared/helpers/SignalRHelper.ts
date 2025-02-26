import { UtilsService } from '@abp/utils/utils.service';
import { AppConsts } from '@shared/AppConsts';

export class SignalRHelper {
    static initSignalR(callback: () => void): void {

        let encryptedAuthToken = new UtilsService().getCookieValue(AppConsts.authorization.encrptedAuthTokenName);

        abp.signalr = {
            autoConnect: true,
            connect: undefined,
            hubs: undefined,
            qs: AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(encryptedAuthToken),
            remoteServiceBaseUrl: AppConsts.signalRRemoteServiceBaseUrl,
            startConnection: undefined,
            url: '/signalr'
        };

        let script = document.createElement('script');
        script.onload = () => {
            callback();
        };

        script.src = AppConsts.appBaseUrl + '/assets/abp/abp.signalr-client.js';
        document.head.appendChild(script);
    }
}
