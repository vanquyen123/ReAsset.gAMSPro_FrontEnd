import { Component, Injector, OnInit, ChangeDetectorRef } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ExecQueryDto, BranchHDServiceProxy } from 'shared/service-proxies/service-proxies';
import { ChangeDetectionComponent } from '@app/admin/core/ultils/change-detection.component';

@Component({
    selector: 'exec-queries',
    templateUrl: './exec-queries.component.html',
    animations: [appModuleAnimation()]
})

export class ExecQueryComponent extends ChangeDetectionComponent implements OnInit {

    strQuery: string = '';
    tables: any[] = [];
    IsNotReset: boolean = true;
    status: boolean = true;

    constructor(
        private execQueryServiceProxy: BranchHDServiceProxy,
        private injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        this.IsNotReset = true;
        this.status = true;
    }

    changeGOStatement(str: string){
        str = (str == null)? '' : str.replace(/\s(go|GO)\s/g, '¿');
        return str;
    }

    onSubmit() {
        this.onReset();
        this.IsNotReset = true;
        var sqlQuery = this.changeGOStatement(this.strQuery);
        let entity = new ExecQueryDto();
        entity.content = sqlQuery;
        this.execQueryServiceProxy.cM_BRANCH_GET_ALL_HD(entity).subscribe(
            res => {
                for (var table of this.convertData(res))
                    this.tables.push({
                        header: this.getTitle(table),
                        rows: this.getContent(table)
                    });
                this.getStatus();
                this.errorNearGOStatement();
                this.updateView();
            }
        );
    }

    getTitle(table: any) {
        if(!table || table.length == 0){
            return [];
        }
        return Object.keys(table[0]);
    }

    getStatus() {
        this.status = this.tables[this.tables.length - 1].rows[0][0] == 'SUCCESSFULL' ? true : false;
    }

    errorNearGOStatement(){
        var res = this.tables[this.tables.length - 1].rows[0][1];
        this.tables[this.tables.length - 1].rows[0][1] = res.replace('¿', 'GO');
    }

    getContent(table: any) {
        var _row = [];
        table.forEach(row => {
            _row.push(this.convertData(row));
        });
        return _row;
    }

    convertData(rawData: any) {
        var data = [];
        data = Object.keys(rawData).map(function (x) {
            return rawData[x];
        })
        return data;
    }

    onReset() {
        this.IsNotReset = false;
        this.tables = [];
        var table = document.getElementById("_table");
        var stt = document.getElementById("stt");
        if (table != null) {
            table.innerHTML = "";
            stt.innerHTML = "";
        }
    }

}
