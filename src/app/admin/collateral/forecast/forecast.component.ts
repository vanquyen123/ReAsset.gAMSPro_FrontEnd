import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReportTypeConsts } from '@app/admin/core/ultils/consts/ReportTypeConsts';
import { base64ToBlob, saveFile } from '@app/ultilities/blob-exec';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { ListComponentBase } from '@app/ultilities/list-component-base';
import { IUiAction } from '@app/ultilities/ui-action';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AsposeServiceProxy, AuthorizedPersonServiceProxy, PredictRequestDto, PredictionServiceProxy, REA_AUTHORIZED_PERSON_ENTITY, REA_VALUATION_RESPONSE_ENTITY, ReportInfo } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  // selector: 'app-authorized-person',
  templateUrl: './forecast.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class ForecastComponent extends DefaultComponentBase implements OnInit, AfterViewInit {

    

    constructor(
        injector: Injector,
        private predictionService: PredictionServiceProxy,
        private fileDownloadService: FileDownloadService,
        private asposeService: AsposeServiceProxy,
    ) {
        super(injector);
        this.getInputField()
        this.initFilter();
    }
    @ViewChild('editForm') editForm: ElementRef;
    filterInput: PredictRequestDto =new PredictRequestDto();
    filterInput2: REA_VALUATION_RESPONSE_ENTITY = new REA_VALUATION_RESPONSE_ENTITY()
    records = [
        {
            recorD_STATUS: '0',
            recordName: "Không hoạt động"
        },
        {
            recorD_STATUS: '1',
            recordName: "Hoạt động"
        }
    ];
    auths = [
        {
            autH_STATUS: 'U',
            autH_STATUS_NAME: "Chờ duyệt"
        },
        {
            autH_STATUS: 'A',
            autH_STATUS_NAME: "Đã duyệt"
        }
    ]

    predictTypes = [
        {
            name: "Linear"
        },
        {
            name: "MLP"
        }
    ]
    
    districtList;
    wardList;
    locationList;

    selectedDate;
    predictionResult = 0;
    saiSo = 0;
    numberOfBedrooms = '0';
    area = '0';

    selectedPredictType = 'Linear';

    isShowError = false;

    initDefaultFilter() {
        // this.filterInput.top = 200;
    }

    ngOnInit() {
        this.filterInput2.actualPrice = 0;
    }

    ngAfterViewInit(): void {
        // COMMENT: this.stopAutoUpdateView();
    }

    exportToExcel() {
        this.predictionService.getExcel().subscribe(response=>{
            let base64String = response.fileContent;
            let blob = base64ToBlob(base64String, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            saveFile(blob, response.fileName)
        });
      }

    getInputField(){
        this.predictionService.getComboBoxData().subscribe(response=>{
            var rawDistrict = []
            var rawWard = []
            var rawLocation = []
            response.districts.forEach(e => {
                rawDistrict.push({value: e})
            });
            response.wards.forEach(e => {
                rawWard.push({value: e})
            });
            response.locationTypes.forEach(e => {
                rawLocation.push({value: e})
            });

            this.districtList = rawDistrict.reduce((acc, curr, index) => {
                acc[index] = curr;
                return acc;
            }, []);
            this.wardList = rawWard.reduce((acc, curr, index) => {
                acc[index] = curr;
                return acc;
            }, []);
            this.locationList = rawLocation.reduce((acc, curr, index) => {
                acc[index] = curr;
                return acc;
            }, []);

            this.updateView()
        })
    }

    onPredict() {
        if ((this.editForm as any).form.invalid) {
            this.isShowError = true;
            this.showErrorMessage(this.l('FormInvalid'));
            this.updateView();
            return;
        }
        this.filterInput.date = this.selectedDate.format('MM/DD/YYYY').toString()
        this.filterInput.numberOfBedrooms = Number.parseFloat(this.numberOfBedrooms)
        this.filterInput.area = Number.parseFloat(this.area)
        if(this.selectedPredictType == 'Linear') {
            this.predictionService.getPredictValuationByLinear(this.filterInput).subscribe(response=>{
                this.predictionResult = response
            this.updateView()
            })
        }
        else {
            this.predictionService.getPredictValuationByMLP(this.filterInput).subscribe(response=>{
                this.predictionResult = response
                this.updateView()
            })
        }
    }

    onValuationResponse() {
        this.filterInput2.address = this.filterInput.address
        this.filterInput2.area = this.filterInput.area
        this.filterInput2.date = this.selectedDate.format('MM/DD/YYYY').toString()
        this.filterInput2.district = this.filterInput.district
        this.filterInput2.locationType = this.filterInput.locationType
        this.filterInput2.numberOfBedrooms = this.filterInput.numberOfBedrooms
        this.filterInput2.ward = this.filterInput.ward
        this.filterInput2.predictedPrice = this.predictionResult
        if(this.predictionResult!=0) {
            this.predictionService.getValuationResponse(this.filterInput2).pipe(
                catchError(e=>{
                this.showErrorMessage("Lỗi");
                return throwError("Lỗi")
                }),
                finalize(() => { this.saving = false; })
            ).subscribe(response=>{
                this.showSuccessMessage("Gửi phản hồi thành công");
            })
        }
    }

    onChangeActualPrice() {
        this.saiSo = Math.abs(this.filterInput2.actualPrice - this.predictionResult);
        this.updateView()
    }

    onSelectRecord(record: REA_AUTHORIZED_PERSON_ENTITY) {
        // this.appToolbar.search();
    }
}
