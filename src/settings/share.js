import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import Context from '../app/context';

@inject(Context, DialogController)
export class Share {
  constructor(ctx, dialogController) {
    this.context = ctx;
    this.dialogController = dialogController;
  }

  activate(data) {

  }
}
