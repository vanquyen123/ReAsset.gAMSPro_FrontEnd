import { Component, Input, OnInit, Injector, ViewEncapsulation, ViewChildren, Inject, Optional, ViewChild, ElementRef, QueryList, OnDestroy, Output, EventEmitter } from "@angular/core";
import { createCustomInputControlValueAccessor, ControlComponent } from "@app/admin/core/controls/control.component";
import { UltilityServiceProxy, API_BASE_URL, CM_IMAGE_ENTITY, AttachFileServiceProxy } from "@shared/service-proxies/service-proxies";
import { HttpClient, HttpRequest, HttpHeaders, HttpEventType, HttpResponse } from "@angular/common/http";
import { ImageCarouselUploadModalComponent } from "./image-carousel-upload-modal.component";
import { ConditionalExpr } from "@angular/compiler";
import { Console } from "console";
import { AppConsts } from "@shared/AppConsts";
import { DomSanitizer } from "@angular/platform-browser";
import { SafeUrl } from "@angular/platform-browser";
// import imageCompression from 'browser-image-compression'
declare const ProgressBar;
declare var $: JQueryStatic;


@Component({
    moduleId: module.id,
    selector: "image-carousel",
    templateUrl: "./image-carousel.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [createCustomInputControlValueAccessor(ImageCarouselComponent)]
})

export class ImageCarouselComponent extends ControlComponent implements OnInit, OnDestroy {

    imageSources: string[];
    imageList: CM_IMAGE_ENTITY[];
    idProgress: string;
    serverUrl: string;
    currentImgSrc: string;
    currentIndex: number = 0;
    opacity: number = 1;

    private injector: Injector;
    private ultilityService: UltilityServiceProxy;
    constructor(
        injector: Injector,
        private attachFileService: AttachFileServiceProxy,
        private sanitizer: DomSanitizer,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string,
    ) {
        super(injector);
        this.injector = injector;
        this.ultilityService = this.injector.get(UltilityServiceProxy);
        this.idProgress = 'f' + this.generateUUID();
        this.serverUrl = AppConsts.remoteImageBaseUrl;
        this.imageList = [];

        this.imageSources = [];
    }

    httpClient: HttpClient;
    @Input() title: string = this.l("ImageAttached");
    @Input() imageTitle: string;
    @Input() imageName: string;

    @Input() disabled: boolean;
    @Input() folderName: string;
    @Input() showButtonOnly: boolean = false;
    @Input() limit: number = parseInt(this.s("gAMSProCore.MaxImagePicker"));
    @Input() maxWidth: number = 700;
    @Input() maxHeight: number = 700;
    refId: string
    indexInGrid: number

    @ViewChild('fileControl') fileControl: ElementRef;
    @ViewChild('loading') loading: ElementRef;
    @ViewChild('imageUpload') imageUploadModal: ImageCarouselUploadModalComponent;
    @Output() onSelectImage: EventEmitter<any> = new EventEmitter<any>();

    loadingProgress: any;

    afterViewInit() {
        // this.updateView();
        setTimeout(() => {
            this.loadingProgress = new ProgressBar.Circle(this.loading.nativeElement, {
                strokeWidth: 6,
                easing: 'easeInOut',
                duration: 1400,
                color: '#639bb7',
                trailColor: '#eee',
                trailWidth: 1,
                svgStyle: null
            });
        }, 1000)

        this.updateView();
    }

    //Lấy hình ảnh từ db về (k hiện modal)
    getImage(refId) {
        this.refId = refId;
        this.attachFileService.cM_IMAGE_ByRefId(this.refId).subscribe(resp => {
            resp.forEach(x => {
                x.basE64 = 'data:image/jpeg;base64,' + x.basE64;
                // this.toDataURL(this.serverUrl + x.path, function(base64) {
                // })
            })
            this.imageList = resp;
            this.updateImageSource();
            this.currentIndex = 0;
            this.currentImgSrc = this.imageSources[this.currentIndex];
            this.updateView();
        })
    }

    //Lấy hình ảnh dựa vào mã tài sản
    getImageByAssetCode(assCode) {
        this.attachFileService.cM_IMAGE_ByAssCode(assCode).subscribe(resp => {
            resp.forEach(x => {
                x.basE64 = 'data:image/jpeg;base64,' + x.basE64;

                // this.toDataURL(this.serverUrl + x.path, function(base64) {
                //     x.basE64 = base64;
                // })
            })
            this.imageList = resp;
            this.updateImageSource();
        });
    }

    //Lấy hình ảnh gần nhất của tài sản
    getImageByAssetNear(assId, date, isShow = false) {
        this.attachFileService.cM_IMAGE_GetNearAsset(assId, date || "").subscribe(resp => {
            resp.forEach(x => {
                x.basE64 = 'data:image/jpeg;base64,' + x.basE64;
                // this.toDataURL(this.serverUrl + x.path, function(base64) {
                //     x.basE64 = base64;
                // })
            })
            this.imageList = resp;
            this.updateImageSource();
            if (isShow) {
                this.showUpLoadModal();
            }
        });
    }

    //Lấy hình ảnh đầu tiên của tài sản
    getImageByAssetFirst(assId, isShow = false) {
        this.attachFileService.cM_IMAGE_GetFirstAsset(assId, undefined).subscribe(resp => {
            resp.forEach(x => {
                x.basE64 = 'data:image/jpeg;base64,' + x.basE64;
                // this.toDataURL(this.serverUrl + x.path, function(base64) {
                //     x.basE64 = base64;
                // })
            })
            this.imageList = resp;
            this.updateImageSource();
            if (isShow) {
                this.showUpLoadModal();
            }
        });
    }


    ngOnInit(): void {
        console.log("ngOnInit");
    }

    showSlide(index) {
        this.opacity = 0.25;
        this.currentImgSrc = this.imageSources[index];
        this.currentIndex = index;
        this.updateView();
        this.fadeIn();
    }

    fadeIn() {
        setTimeout(() => {
            this.opacity = 1;
            this.updateView();
        }, 200);
    }

    async uploadFile(fileInput) {
        // console.log(fileInput);
        const options = {
            maxSizeMB: 4,
        }
        try {
            var fileAppcepted = this.validateFile(fileInput.target.files);

            if (fileAppcepted.length + this.imageUploadModal.imageSources.length > this.limit) {
                alert(this.l('UpLoadLimit{0}File', this.limit));
            }

            var _length = this.limit - this.imageUploadModal.imageSources.length;


            for (let i = 0; i < _length; i++) {

                let reader = new FileReader();
                reader.readAsDataURL(fileAppcepted[i]);
                reader.onload = async () => {
                    var f = new CM_IMAGE_ENTITY();

                    this.resizeImage(reader.result.toString(), this.maxWidth, this.maxHeight).then(compressed => {
                        if (this.imageTitle) {

                            this.addTextToImage(compressed, this.imageTitle, (param) => {
                                f.basE64 = param as string;
                                f.imagE_NAME = this.imageName;
                                this.imageUploadModal.imageList.push(f);
                                this.imageUploadModal.updateImageSource();
                            });
                        }
                        else {
                            f.basE64 = compressed as string;
                            f.imagE_NAME = this.imageName;
                            this.imageUploadModal.imageList.push(f);
                            this.imageUploadModal.updateImageSource();

                        }
                    })
                    f.filE_NAME = this.generateUUID() + '.' + fileAppcepted[i].name.split('.').pop();
                    f.path = null;
                };
            }
        }
        catch (e) {
            console.log(e);
        }
    }


    
    validateFile(files){
        const allowedExtensions =  ['jpg','jpeg','png','gif'];
        var filesResult = []
        for(var i = 0;i < files.length; i++){
            const { name:fileName, size:fileSize } = files[i];
            const fileExtension = fileName.split(".").pop();
            if(allowedExtensions.includes(fileExtension)){
                filesResult.push(files[i]);
            }
        }
        return filesResult;
    }

    urltoFile(url, filename, mimeType) {
        return (fetch(url)
            .then(function (res) {
                return res.arrayBuffer();
            })
            .then(function (buf) {
                return new File([buf], filename, { type: mimeType });
            })
        );
    }
    async resizeImage(src, maxWidth, maxHeight) {
        var targetFileSizeKb = 4000;
        var maxDeviation = 1;
        let originalFile = await this.urltoFile(src, 'test.png', 'image/png');
        if (originalFile.size / 1000 < targetFileSizeKb)
            return src; // File is already smaller

        let low = 0.0;
        let middle = 0.5;
        let high = 1.0;

        let result = src;

        let file = originalFile;

        while ((file.size / 1000 - targetFileSizeKb) > maxDeviation) {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            const img = document.createElement('img');

            const promise = new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = reject;
            });

            img.src = result;

            await promise;

            canvas.width = Math.round(img.width * middle);
            canvas.height = Math.round(img.height * middle);
            context.scale(canvas.width / img.width, canvas.height / img.height);
            context.drawImage(img, 0, 0);
            file = await this.urltoFile(canvas.toDataURL(), 'test.png', 'image/png');

            // if (file.size / 1000 < (targetFileSizeKb - maxDeviation)) {
            //     low = middle;
            // }
            // else if (file.size / 1000 > targetFileSizeKb) {
            //     high = middle;
            // }

            middle = (low + high) / 2;
            result = canvas.toDataURL();
        }
        return result;

        // return new Promise((res, rej) => {
        //     const img = new Image();
        //     img.src = src;
        //     img.onload = () => {

        //         //Tỉ lệ hình gốc
        //         var ratio = img.height / img.width;
        //         let middle = 0.8;
        //         //Kích thước mới sau khi giảm
        //         var newHeight = img.height * middle;
        //         var newWidth = img.width * middle;

        //         //Giảm chiều cao
        //         // if(img.height >= maxHeight){
        //         //     newHeight = maxHeight;
        //         //     newWidth = img.height / ratio;
        //         // }
        //         //Giảm chiều rộng
        //         // if(newWidth >= maxWidth){
        //         //     newWidth = maxWidth;
        //         //     newHeight = newWidth * ratio;
        //         // }

        //         const elem = document.createElement('canvas');
        //         elem.width = newWidth;
        //         elem.height = newHeight;
        //         const ctx = elem.getContext('2d');
        //         ctx.drawImage(img, 0, 0, newWidth, newHeight);
        //         const data = ctx.canvas.toDataURL();
        //         res(data);
        //     }
        //     img.onerror = error => rej(error);
        // })
    }

    toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
    sanitizeImageUrl(imageUrl: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
    //Lấy ảnh từ imageList rồi hiện lên view
    updateImageSource() {
        var list = [];
        this.imageList.forEach(img => {
            if (img.basE64 != null) {
                list.push(img.basE64);
            }
            else {
                if (img.path != null) {
                    list.push(this.sanitizeImageUrl(this.serverUrl + img.path));
                }
            }
        })

        this.imageSources = list;

        this.currentIndex = 0;
        this.currentImgSrc = this.imageSources[this.currentIndex];

        this.updateView();
    }

    showLoading() {
        $(this.loading.nativeElement).show();
    }

    hideLoading() {
        this.loadingProgress.set(0);
        // $(this.loading.nativeElement).hide();
    }

    // getMultiFile(event) {
    //     var $scope = this;
    //     $scope.onChangeCallback(event);
    //     $scope.ngModel = event;
    //     $scope.updateParentView();
    // }

    // protected onChange() {
    // }

    //Lưu hình xuống db
    saveToDb(refId: string, folderName: string) {
        this.refId = refId;
        this.folderName = folderName;

        //Cập nhật lại folder name
        // this.imageList.forEach(img=>{
        //     img.path = "/IMAGE_IMPORT/" + folderName + "/" + img.path.split('/').pop(); 
        // })

        if (refId != undefined &&
            refId != null &&
            refId != '') {
            this.attachFileService.uploadImageFiles( this.refId, folderName,this.imageList).subscribe(resp => {
                console.log(resp);
            });
        } else {
            console.error("RefId trống");
        }
    }

    //Lưu hình (hình truyền từ bên ngoài) xuống db 
    saveImageModelToDb(refId: string, images: CM_IMAGE_ENTITY[], folderName: string) {
        this.folderName = folderName;
        this.attachFileService.uploadImageFiles( refId, folderName,images).subscribe(resp => {
            console.log(resp);
        });
    }

    showUpLoadModal() {
        this.imageUploadModal.show(this);
    }

    //Lấy hình ảnh tử db và hiện upload modal lên
    getImageThenShowUpLoadModel(refId: string) {
        this.refId = refId;
        this.attachFileService.cM_IMAGE_ByRefId(this.refId).subscribe(resp => {
            resp.forEach(x => {
                x.basE64 = 'data:image/jpeg;base64,' + x.basE64;

                // this.toDataURL(this.serverUrl + x.path, function(dataUrl) {
                //     x.basE64 = dataUrl;
                // })
            })
            this.imageList = resp;
            this.updateImageSource();
            this.imageUploadModal.show(this);
        })
        // console.log(this);
    }

    //Nạp trực tiếp ảnh vào upload modal và hiện lên
    pushImageThenShowUpLoadModel(images: CM_IMAGE_ENTITY[]) {

        if (images == null || images == undefined) {
            images = [];
        }

        this.imageList = images;
        this.updateImageSource();
        this.imageUploadModal.show(this);
    }

    ngOnDestroy(): void {
        console.log('ngOnDestroy');
    }
}