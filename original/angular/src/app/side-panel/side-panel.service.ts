import { Injectable, TemplateRef } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SidePanelService {

    public $content = new BehaviorSubject<TemplateRef<any>>(null);

}