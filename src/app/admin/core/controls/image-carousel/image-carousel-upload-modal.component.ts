import { Component, ViewChild, ViewEncapsulation, Output, EventEmitter, OnInit, Input, Injector, Inject, Optional } from '@angular/core';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { UltilityServiceProxy, AttachFileServiceProxy, API_BASE_URL, CM_IMAGE_ENTITY } from '@shared/service-proxies/service-proxies';
import { ChangeDetectionComponent } from '../../ultils/change-detection.component';
import { PopupFrameComponent } from '../popup-frames/popup-frame.component';
import { ImageCarouselComponent } from './image-carousel.component';
import { AppConsts } from '@shared/AppConsts';

@Component({
    selector: "image-carousel-upload-modal",
    templateUrl: "./image-carousel-upload-modal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class ImageCarouselUploadModalComponent extends ChangeDetectionComponent implements OnInit {
    @ViewChild('popupFrame') modal: PopupFrameComponent;
    active = false;

    saving: boolean;
    @Input() disabled: boolean;
    @Input() title: string = this.l('ImageAttached');

    imageSources: string[];
    imageList: CM_IMAGE_ENTITY[];
    serverUrl: string;
    currentImgSrc: string;
    currentIndex: number = 0;
    opacity: number = 1;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    carousel: ImageCarouselComponent;

    constructor(
        injector: Injector,
        private ultilityService: UltilityServiceProxy,
        private attachFileService: AttachFileServiceProxy,
        private fileDownloadService: FileDownloadService,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(injector)
        this.serverUrl = AppConsts.remoteImageBaseUrl;
        this.imageSources = []
        this.imageList = []
    }
    selectedFiles() {
    }

    showSlide(index) {
        this.opacity = 0.25;
        this.currentImgSrc = this.imageSources[index];
        this.currentIndex = index;
        this.updateView();
        this.fadeIn();
    }

    prevSlide() {
        this.opacity = 0.25;
        this.currentIndex = this.currentIndex - 1;
        if (this.currentIndex < 0)
            this.currentIndex = this.imageSources.length - 1;
        if (this.currentIndex > this.imageSources.length - 1)
            this.currentIndex = 0;
        this.currentImgSrc = this.imageSources[this.currentIndex];
        this.updateView();
        this.fadeIn();
    }

    nextSlide() {
        this.opacity = 0.25;
        this.currentIndex = this.currentIndex + 1;
        if (this.currentIndex < 0)
            this.currentIndex = this.imageSources.length - 1;
        if (this.currentIndex > this.imageSources.length - 1)
            this.currentIndex = 0;
        this.currentImgSrc = this.imageSources[this.currentIndex];
        this.updateView();
        this.fadeIn();
    }

    fadeIn() {
        setTimeout(() => {
            this.opacity = 1;
            this.updateView();
        }, 100);
    }

    show(carousel: ImageCarouselComponent): void {
        this.carousel = carousel;

        this.imageList = [...carousel.imageList];
        this.imageSources = [...carousel.imageSources];

        this.currentIndex = 0;
        this.currentImgSrc = this.imageSources[this.currentIndex];

        this.modal.show();
        this.updateView();
    }
    ngOnInit(): void {

    }

    updateImageSource() {
        var list = [];
        this.imageList.forEach(img => {
            if (img.basE64 != null) {
                list.push(img.basE64);
            }
            else {
                if (img.path != null) {
                    list.push(this.serverUrl + img.path);
                }
            }
        })

        this.imageSources = list;

        this.currentIndex = 0;
        this.currentImgSrc = this.imageSources[this.currentIndex];

        this.updateView();
    }

    showFilePicker() {
        if (this.disabled) return;
        this.carousel.fileControl.nativeElement.value = ""
        this.updateView();

        $(this.carousel.fileControl.nativeElement).click();
    }


    uploadComplete(e, i) {
        this.updateView();
    }

    save() {
        this.saveImg();
        this.carousel.onSelectImage.emit({ imageList: this.carousel.imageList, indexInGrid: this.carousel.indexInGrid });
        this.close();
    }

    saveImg() {
        this.saving = true;

        this.carousel.imageList = [...this.imageList];
        this.carousel.imageSources = [...this.imageSources];
        this.carousel.updateImageSource();

        // this.carousel.imageList.forEach(file => {
        //     file.path = '/IMAGE_IMPORT/' + file.filE_NAME;
        // });

        // this.carousel.saveToDb(this.carousel.refId);
    }

    close() {
        this.active = false;
        this.saving = false;
        this.modal.close();
    }

    delete(index) {
        this.message.confirm(
            this.l('DeleteImageConfirm'),
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this.imageList.splice(index, 1);
                    this.updateImageSource();
                    this.updateView();
                }
            }
        );
    }

    download(index) {
        if (!this.imageList[index].path) {
            this.downloadFile(this.removeAccents(this.imageList[index].imagE_NAME), "jpeg", this.imageList[index].basE64)
        } else {
            var fileType = "." + this.imageList[index].path.split('.')[this.imageList[index].path.split(".").length - 1]
            this.attachFileService.getImage(this.serverUrl + this.imageList[index].path, this.removeAccents(this.imageList[index].imagE_NAME) + fileType).subscribe(x => {
                this.fileDownloadService.downloadTempFile(x);

            })
        }
    }

    downloadFile(fileName: string, fileFormat: string, data: any): void {
        const linkSource = data;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    removeAccents(str) {
        return str ? str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D') : "";
    }
}