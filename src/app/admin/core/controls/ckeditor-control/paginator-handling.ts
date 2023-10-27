import { Injectable, Injector, ElementRef } from "@angular/core";

declare var $: JQueryStatic;

export class PaginatorHandling {

    maxRowPerPage: number = 30

    currentPage: number = 0;
    totalPage: number;
    maxPageDisplay = 5;

    private tableRef: JQuery;
    private tableRef_all: JQuery;

    private paginatorElement: HTMLElement;

    totalRows: number;

    setTableRef(tableRef: JQuery) {
        this.tableRef = tableRef;
        this.paginatorElement = document.createElement('ul');
        $(this.paginatorElement).addClass('report-template-paginator');
        let div = document.createElement('div');
        $(div).addClass('paginator-parent');
        $(div).append(this.paginatorElement);
        $(div).insertBefore(tableRef);
        this.tableRef_all = tableRef.clone();
        this.totalRows = this.tableRef.find(this.childSelector).length;
        this.totalPage = Math.ceil(this.tableRef.find(this.childSelector).length / this.maxRowPerPage);
    }

    parentSelector: string;
    childSelector: string;

    getTotalRows() {
        return this.tableRef.find(this.childSelector).length;
    }

    getPreviousPage() {
        if (this.currentPage == 0) {
            return 0;
        }
        return this.currentPage - 1;
    }

    getNextPage() {
        if (this.currentPage >= this.totalPage - 1) {
            return this.totalPage - 1;
        }
        return this.currentPage + 1;
    }

    getFirstPage() {
        return 0;
    }

    getLastPage() {
        return this.totalPage - 1;
    }

    getArrayBetween(start, end) {
        let result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    }

    getPages() {
        if (this.totalPage <= this.maxPageDisplay) {
            return this.getArrayBetween(0, this.maxPageDisplay - 1);
        }
        let firstPage = Math.max(this.currentPage - 1, 0);
        let lastPage = firstPage + this.maxPageDisplay - 1;

        if (lastPage > this.getLastPage()) {
            return this.getArrayBetween(this.getLastPage() - this.maxPageDisplay + 1, this.getLastPage());
        }

        return this.getArrayBetween(firstPage, firstPage + this.maxPageDisplay - 1)
    }

    initDataInPage() {
        let parentChildElement = this.tableRef.find(this.childSelector).parent();
        parentChildElement.empty();
        let rowIndexBegin = this.currentPage * this.maxRowPerPage;
        let rowIndexEnd = rowIndexBegin + this.maxRowPerPage;
        let childs = this.tableRef_all.find(this.childSelector);
        for (let i = rowIndexBegin; i <= rowIndexEnd; i++) {
            parentChildElement.append($(childs[i]).clone());
        }
    }

    getRow() {
        this.totalPage = Math.ceil(this.tableRef.find(this.childSelector).length / this.maxRowPerPage)
    }

    changePage(page) {
        if (page < 0) {
            page = 0;
        }
        if (page >= this.totalPage) {
            page = this.totalPage - 1;
        }
        this.currentPage = page;
        let arrayPages = this.getPages();
        $(this.paginatorElement).empty();

        let li = document.createElement('li');
        $(li).text('<<');
        $(li).click(() => {
            this.changePage(0);
        })
        $(this.paginatorElement).append(li);


        li = document.createElement('li');
        $(li).text('<');
        $(li).click(() => {
            this.changePage(this.currentPage - 1);
        })
        $(this.paginatorElement).append(li);

        arrayPages.forEach(x => {
            li = document.createElement('li');
            if (x == this.currentPage) {
                $(li).addClass('current-page');
            }
            $(li).text(x + 1);
            $(li).click(() => {
                this.changePage(x);
            })
            $(this.paginatorElement).append(li);
        });


        li = document.createElement('li');
        $(li).text('>');
        $(li).click(() => {
            this.changePage(this.currentPage + 1);
        })
        $(this.paginatorElement).append(li);


        li = document.createElement('li');
        $(li).text('>>');
        $(li).click(() => {
            this.changePage(this.totalPage - 1);
        })
        $(this.paginatorElement).append(li);

        this.initDataInPage();
    }

}
