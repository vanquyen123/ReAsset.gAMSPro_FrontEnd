import { Component, Input, OnInit, AfterViewInit, Output, ViewChild, EventEmitter, ElementRef, Injector, AfterViewChecked } from "@angular/core";
import { createCustomInputControlValueAccessor, ControlComponent } from "@app/admin/core/controls/control.component";
import { AsposeServiceProxy as ReportServiceProxy, ReportTemplateServiceProxy, ReportTable } from "@shared/service-proxies/service-proxies";
import { PreviewTemplateService } from "@app/admin/common/preview-template/preview-template.service";
import { PaginatorHandling } from "./paginator-handling";

declare var $: JQueryStatic;

@Component({
    selector: 'ckeditor-control',
    templateUrl: './ckeditor-control.component.html',
    styleUrls: ['./ckeditor-control.css'],
    providers: [createCustomInputControlValueAccessor(CkeditorControlComponent)]
})
export class CkeditorControlComponent extends ControlComponent implements OnInit, AfterViewInit {
    @ViewChild('ckeditor') ckeditor: any;
    constructor(
        injector: Injector,
        private _reportService: ReportServiceProxy,
        private _templateService: PreviewTemplateService
    ) {
        super(injector);
        this._disabled = false;
    }
    ngAfterViewInit(): void {

    }
    root: JQuery;
    @ViewChild("control") inputRef: ElementRef;

    @Input() showEditDocument: boolean = true;
    templateConfig: any;
    _disabled: boolean;
    reportContent: string;
    allowChangeSelect2: boolean;
    data: ReportTable[];
    template_Page: string[] = [];

    @Input() set disabled(value: boolean) {
        this._disabled = value;
    }

    _ngModel: any;
    @Input() public set ngModel(value) {
        var flag = false;
        if (this._ngModel = value) {
            flag = true;
        }
        if (value) {
            this._ngModel = value;
        }
        else {
            this._ngModel = "";
        }
        if (this._ngModel && this.data && !flag) {
            this.refreshTemplate();

        }
    }
    @Input() public set storeData(value) {
        this.data = value;
        if (this._ngModel && this.data) {
            this.refreshTemplate();

        }
    }

    parentSelector = 'table';
    childSelector = 'tbody>tr';

    refreshTemplate() {
        // this.sendValueOut(this._ngModel);
        let maxRowGenPaging = 50;
        var props = this;
        this._templateService.ReloadDataFromStoreToPreview(this._ngModel, this.data).then(result => {
            this.reportContent = result;
            if (this.reportContent) {
                let elementReport = $('<div>' + result + '</div');

                elementReport.find(this.parentSelector).each(function () {
                    if ($(this).find(props.childSelector).length > maxRowGenPaging) {
                        let paginator = new PaginatorHandling();
                        paginator.parentSelector = props.parentSelector;
                        paginator.childSelector = props.childSelector;
                        paginator.setTableRef($(this));
                        paginator.changePage(0);
                    }
                })
                $(this.ref.nativeElement).find(".previewContent").empty();
                $(this.ref.nativeElement).find(".previewContent").append(elementReport);
                // document.getElementsByClassName("previewContent")[0].innerHTML = this.reportContent;
            } else {
                // document.getElementsByClassName("previewContent")[0].innerHTML = "";
                props.root = $("*").find(".previewContent").append("");
            }
        });

        this.updateView();

        // this.reportContent = this._templateService.ReloadDataFromStoreToPreview(this._ngModel, this.data);
        // if (this.reportContent) {
        //     document.getElementsByClassName("previewContent")[0].innerHTML = this.reportContent;
        // } else {
        //     document.getElementsByClassName("previewContent")[0].innerHTML = "";
        // }




    }



    ngOnInit(): void {
        let editor = window['CKEDITOR'];
        this.templateConfig = {
            entities: false,
            resize_enabled: false,
            allowedContent: true,
            forcePasteAsPlainText: false,
            font_names: 'Arial;Times New Roman;Verdana',
            toolbarGroups: [
                { name: 'document', groups: ['mode', 'document', 'doctools'] },
                { name: 'clipboard', groups: ['clipboard', 'undo'] },
                { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
                { name: 'forms', groups: ['forms'] },
                '/',
                { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
                { name: 'links', groups: ['links'] },
                { name: 'insert', groups: ['insert'] },
                '/',
                { name: 'styles', groups: ['styles'] },
                { name: 'colors', groups: ['colors'] },
                { name: 'tools', groups: ['tools'] },
                { name: 'others', groups: ['others'] },
                { name: 'about', groups: ['about'] }
            ],
            //removeButtons: 'BGColor,Save,Preview,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,HiddenField,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,CreateDiv,Blockquote,BidiLtr,BidiRtl,Language,Unlink,Anchor,Flash,HorizontalRule,Iframe,ShowBlocks,About',
            bodyClass: 'document-editor',
            extraPlugins: 'leaderdots',
            // basicEntities: false,

            // forceSimpleAmpersand: true,
        };


        // editor.ui.addButton( 'LeaderDots', {
        //     label: 'Insert LeaderDots',
        //     command: 'insertLeaderDots',
        //     toolbar: 'LeaderDots'
        // });
    }

    InsertTableToEditor(htmlInsert: string) {
        let editor = window['CKEDITOR'];
        // editor.instances["editor1"].insertHtml(htmlInsert);
        editor.instances[Object.keys(editor.instances)[0]].insertHtml(htmlInsert);
    }
    onChangeEditor(event) {
        this.sendValueOut(this._ngModel);
    }
}
