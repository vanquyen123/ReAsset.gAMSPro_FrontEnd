import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { ListComponentBase } from '@app/ultilities/list-component-base';
import { IUiAction } from '@app/ultilities/ui-action';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  // selector: 'app-outside-shareholder',
  templateUrl: './outside-shareholder.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class OutsideShareholderComponent extends ListComponentBase<any> implements OnInit {

  constructor(injector: Injector) { 
    super(injector);
  }

  ngOnInit() {
    this.appToolbar.setEnableForListPage();
  }

}
