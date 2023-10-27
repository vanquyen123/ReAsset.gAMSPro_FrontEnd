import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { DefaultComponentBase } from '@app/ultilities/default-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditPageState } from '@app/ultilities/enum/edit-page-state';

@Component({
  // selector: 'app-outside-shareholder-edit',
  templateUrl: './outside-shareholder-edit.component.html',
  animations: [appModuleAnimation()],
  encapsulation: ViewEncapsulation.None,
})
export class OutsideShareholderEditComponent extends DefaultComponentBase implements OnInit {

  constructor(injector: Injector) { 
    super(injector);
    this.editPageState = this.getRouteData('editPageState');
  }
  
  EditPageState = EditPageState;
  editPageState: EditPageState;

  get disableInput(): boolean {
    return this.editPageState == EditPageState.viewDetail;
}

  ngOnInit() {
    switch (this.editPageState) {
      case EditPageState.add:
          this.appToolbar.setRole('Department', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          break;
      case EditPageState.edit:
          this.appToolbar.setRole('Department', false, false, true, false, false, false, false, false);
          this.appToolbar.setEnableForEditPage();
          break;
      case EditPageState.viewDetail:
          this.appToolbar.setRole('Department', false, false, false, false, false, false, true, false);
          this.appToolbar.setEnableForViewDetailPage();
          break;
  }

  }

}
