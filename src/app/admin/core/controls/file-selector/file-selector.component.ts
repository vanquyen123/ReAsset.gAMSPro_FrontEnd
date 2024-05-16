import { ViewEncapsulation, Component, Output, EventEmitter, ViewChild, ElementRef, Input, Injector, OnInit} from "@angular/core";
import { REA_FILE_ENTITY } from "@shared/service-proxies/service-proxies";
import { ChangeDetectionComponent } from "../../ultils/change-detection.component";
import * as moment from "moment";


@Component({
    selector: "file-selector",
    templateUrl: "./file-selector.component.html",
    encapsulation: ViewEncapsulation.None
})
export class FileSelectorComponent extends ChangeDetectionComponent{
    constructor(
        injector: Injector,
    ) {
        super(injector);
    }
    @Input() disabled: boolean;
    @Input() uploadedFile:REA_FILE_ENTITY;
    @Output() uploadFileEvent: EventEmitter<any> =  new EventEmitter<REA_FILE_ENTITY>();
    @Output() removeFileEvent: EventEmitter<any> =  new EventEmitter<REA_FILE_ENTITY>();
    @ViewChild('attachFile') attachFile: ElementRef;

    onUploadImage(event){
        var oldFile = new REA_FILE_ENTITY(this.uploadedFile)
        var file = event.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if(this.uploadedFile.iS_CHANGED) {
                this.uploadedFile = new REA_FILE_ENTITY()
            }
            let content = reader.result.toString().split(',')
            this.uploadedFile.filE_NAME = event.target.files[0].name
            this.uploadedFile.filE_CONTENT = content[1]
            this.uploadedFile.iS_NEW = true
            this.uploadedFile.iS_CHANGED = false
            this.uploadedFile.filE_ATTACH_DT = moment()
            this.updateView()
        };
        this.uploadFileEvent.emit({
            oldFile: oldFile,
            newFile: this.uploadedFile
        })
    }

    selectFile(){
        this.attachFile.nativeElement.click()
    }

    removeFile() {
        var oldFile = new REA_FILE_ENTITY(this.uploadedFile)
        if(this.uploadedFile.iS_CHANGED) {
            this.uploadedFile = new REA_FILE_ENTITY()
        }
        this.uploadedFile.filE_NAME = ""
        this.uploadedFile.filE_CONTENT = ""
        this.attachFile.nativeElement.value = ""
        this.removeFileEvent.emit({
            oldFile: oldFile,
            newFile: this.uploadedFile
        })
        this.updateView()
    }
    
}
