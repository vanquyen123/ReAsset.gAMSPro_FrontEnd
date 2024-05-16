import { ViewChild, AfterViewInit, Injector, Output, EventEmitter, Input, ElementRef, AfterViewChecked, AfterContentInit, AfterContentChecked } from "@angular/core";
import { PopupFrameComponent } from "../controls/popup-frames/popup-frame.component";
import { ListComponentBase } from "@app/ultilities/list-component-base";
import { Observable, Observer } from "rxjs";
import { ListComponentBase2 } from "@app/ultilities/list-component-base2";

export class PopupBaseComponent2<T, T2> extends ListComponentBase2<T, T2> implements AfterViewInit, AfterViewChecked, AfterContentChecked {
    ngAfterContentChecked(): void {

    }
    ngAfterViewChecked(): void {

    }

    ngAfterContentInit() {
        super.ngAfterContentInit();
        if (!this.hideColumns)
            return;
        let scope = this;
        this.hideColumns.split(',').forEach(function (e) {
            let th = $(scope.dataTable.tableRef.nativeElement).find('thead>tr>th[sortField="' + e + '"]');
            th.hide();
        });
    }

    @ViewChild('popupFrame') popupFrame: PopupFrameComponent;
    allDataClient = [];

    isDataLoaded = false;

    currentItem: T;
    selectedItems: T[] = [];
    keyMember: string;
    checkAll: boolean;
    filterInput: T2;

    ref: ElementRef;

    @Input() multiple: boolean;
    @Input() disableFields: string;
    @Input() hideFields: string;
    @Input() hideColumns: string;
    @Output() onSelect: EventEmitter<any> = new EventEmitter<any>();
    @Input() removeAllCheckOnShow: boolean = true;

    @Input() initOnShow: boolean = false;

    constructor(
        injector: Injector,
    ) {
        super(injector);
        this.multiple = true;
        this.idCheckbox = this.generateUUID();
        this.ref = injector.get(ElementRef);
    }

    initComboFromApi(){

    }

    idCheckbox: string;

    ngAfterViewInit(): void {
        // COMMENT: this.stopAutoUpdateView();

        // nhan phim enter de search
        var scope = this;
        $(this.ref.nativeElement).find('>popup-frame .filter-form').on('submit', e => {
            e.preventDefault();
        })
        $(this.ref.nativeElement).find('>popup-frame .filter-form').find('input,textarea,select').on('keypress', function (e) {
            if (e.which == 13) {
                e.preventDefault();
                scope.buttonSearch();
            }
        });

        //
        if (this.disableFields) {
            this.disableFields.split(',').forEach(x => {
                $(this.ref.nativeElement).find('form.filter-form').find(`input[name=${x}],button[name=${x}],select[name=${x}],textarea[name=${x}],*[name=${x}]>input,*[name=${x}]>select`).prop('disabled', true);
            })
        }

        if (this.hideFields) {
            if (this.hideFields) {
                this.hideFields.split(',').forEach(x => {
                    $(this.ref.nativeElement).find('>popup-frame').find(`input[name=${x}],select[name=${x}],textarea[name=${x}],*[name=${x}]>input,*[name=${x}]>select`).closest('.form-group').parent().css('display', 'none');
                    $(this.ref.nativeElement).find('>popup-frame').find(`*[name=${x}]`).hide();
                })
            }
        }

        setTimeout(() => {
            this.updateView();
        });

        // TODO cheat
        this.initOnShow=false;

        if(!this.initOnShow) {
            this.initComboFromApi();
        }
    }

    accept() {
        if (!this.multiple) {
            this.onSelect.emit(this.currentItem);
            this.updateParentView();
            this.close();
        }
        else {
            this.onSelect.emit(this.selectedItems);
            this.updateParentView();
            this.close();
        }
    }

    async buttonSearch() {
        // Paging Client Start



        // Paging Client End
        if (this.dataTable) {
            this.dataTable.paginator.paginator.first = 0;
        }
        await this.search(true);
    }

    changePage(currentPage: number) {

        super.changePage(currentPage);


        // this.dataTable.getData();

        // let maxResultCount = this.dataTable.paginator.paginator.paginatorState.rows;
        // let skipCount = currentPage * maxResultCount;

        // this.shouldReloadPaging = false;

        // if (skipCount + maxResultCount > this.dataCached.length) {
        //     this.shouldReloadPaging = true;
        // }

        // if (this.shouldReloadPaging) {
        //     this.dataTable.getData();
        // }
        // else {
        //     this.dataTable.records = this.dataCached.slice(skipCount, skipCount + maxResultCount);
        //     this.filterInputSearch['skipCount'] = skipCount;
        //     this.filterInputSearch['maxResultCount'] = skipCount;
        //     this.updateView();
        // }
    }

    async search(copyFilterInput = false) {
        this.showTableLoading();
        this.popupFrame.waiting = true;

        if (copyFilterInput || !this.filterInputSearch) {
            this.copyFilterInput();
        }

        setTimeout(async () => {

            // this.showTableLoading();

            // clientPaging


            await this.getResult();

            // this.hideTableLoading()
            this.popupFrame.waiting = false;
            // this.dataTable = null when page is edit-table
            if (this.dataTable) {
                this.dataTable.records.forEach(x => {
                    x['isChecked'] = this.isChecked(x);
                });
            }


            this.hideTableLoading();
            this.updateView();
            if(this.dataTable && this.dataTable.tableRef){
                let trs = $(this.dataTable.tableRef.nativeElement).find('tbody>tr');
                if (trs.length > 0) {
                    this.selectRow({ currentTarget: trs[0] }, this.dataTable.records[0]);
                }
            }
        })
    }

    async getResult(checkAll: boolean = false): Promise<any> {

    }

    onDoubleClick(item: any): void {
        if (!this.multiple) {
            this.currentItem = item;
            this.onSelect.emit(this.currentItem);
            this.updateParentView();
            this.popupFrame.close();
        }
    }

    onSelectRow(item: any) {
        this.currentItem = item;
    }

    close() {
        this.popupFrame.close();
    }

    show() {
        if (this.dataTable && this.removeAllCheckOnShow) {
            this.checkAll = undefined;
            this.dataTable.records.forEach(x => {
                x['isChecked'] = false;
            })

            this.selectedItems = [];
        }

        if(this.initOnShow) {
            this.initComboFromApi();
        }

        setTimeout(()=>{
            $(this.dataTable.tableRef.nativeElement).find('input[type=checkbox]').prop('checked', false);
        })

        this.popupFrame.show();
        if (this.dataTable && this.dataTable['reloadPageOnInit']) {
            this.changePage(0);
        }
        this.updateView();
        // this.updateParentView();
    }

    isChecked(record): boolean {
        return this.selectedItems.filter(x => x[this.keyMember] == record[this.keyMember]).length > 0;
    }

    setChecked(checked, record: T) {
        (record as any).isChecked = checked;
        this.checkAll = false;
        if (checked && !this.isChecked(record)) {
            this.selectedItems.push(record);
            return;
        }
        this.selectedItems = this.selectedItems.filter(x => x[this.keyMember] != record[this.keyMember])
    }

    async onCheckAll(element) {
        this.checkAll = element.checked;
        setTimeout(()=>{
            $(element).closest('table').find('input[type="checkbox"').prop('checked', this.checkAll);
        })

        if (this.pagingClient) {
            let items = this.clientData || this.dataTable.records;
            items.forEach(x => {
                x['isChecked'] = this.checkAll;
            })
        }
        else{
            this.dataTable.records.forEach(x => {
                x['isChecked'] = this.checkAll;
            })
        }
        if (element.checked) {

            this.popupFrame.waiting = true;
            if (!this.filterInputSearch) {
                return;
            }
            this.showTableLoading();

            let response = [];


            // Paging Client Start
            if (this.pagingClient) {
                response = this.clientData || this.dataTable.records;
                this.selectedItems = response;
            }
            // Paging Client End
            else {
                if (this.dataTable.records.length < this.dataTable.defaultRecordsCountPerPage) {
                    response = this.dataTable.records;
                    this.selectedItems = response;
                }
                else {
                    response = await this.getResult(true);
                }
            }

            this.hideTableLoading();
            this.popupFrame.waiting = false;

            this.dataTable.records.forEach(x => {
                x['isChecked'] = true;
            });
        }
        else {
            this.selectedItems = [];
        }

        this.updateView();
    }
}
