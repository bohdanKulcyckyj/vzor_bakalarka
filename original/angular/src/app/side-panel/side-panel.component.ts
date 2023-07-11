import { Component } from '@angular/core';
import { SidePanelService } from './side-panel.service';

@Component({
  selector: 'app-side-panel',
  template: `
    <ng-container *ngTemplateOutlet="sidePanelService.$content | async"></ng-container>
  `,
  styleUrls: ['./side-panel.component.less']
})
export class SidePanelComponent {
  constructor(public sidePanelService: SidePanelService) {
  }
}
