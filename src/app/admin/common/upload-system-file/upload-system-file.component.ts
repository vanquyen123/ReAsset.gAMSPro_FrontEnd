import { Injector, Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { ReportInfo, AsposeServiceProxy, CM_BRANCH_ENTITY, CM_DEPARTMENT_ENTITY, UPLOAD_W_T_RESULT } from "@shared/service-proxies/service-proxies";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { FileDownloadService } from "@shared/utils/file-download.service";
import { ReportTypeConsts } from "@app/admin/core/ultils/consts/ReportTypeConsts";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import * as moment from 'moment';
import { PreviewTemplateService } from "@app/admin/common/preview-template/preview-template.service";
import { ReportTemplateModalComponent } from "@app/admin/core/controls/report-template-modal/report-template-modal.component";
import { DateFormatPipe } from "@app/admin/core/pipes/date-format.pipe";
import { Select2CustomComponent } from "@app/admin/core/controls/custom-select2/select2-custom.component";
import { FileSystemUploaderComponent } from "@app/admin/core/controls/file-system-uploader/file-system-uploader.component";

@Component({
    templateUrl: './upload-system-file.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})

export class UploadSystemFile extends DefaultComponentBase implements OnInit, AfterViewInit {

    filterInput: any = {};
    @ViewChild('exportForm') exportForm: ElementRef;
    isShowError = false;

    @ViewChild('fileControl') fileControl: FileSystemUploaderComponent;


    ngAfterViewInit(): void {
        // COMMENT: this.stopAutoUpdateView();
        // this.setupValidationMessage();
    }

    constructor(injector: Injector) {
        super(injector);
        this.filterInput.URL = './';
    }

    ngOnInit(): void {
        console.log(this)
    }
    async uploadFile() {

        if ((this.exportForm as any).form.invalid) {
            this.isShowError = true;
            this.showErrorMessage(this.l('FormInvalid'));
            this.updateView();
            return;
        }
        this.fileControl.URL = this.filterInput.URL;
        await this.fileControl.fileUpload(undefined);


    }
}
