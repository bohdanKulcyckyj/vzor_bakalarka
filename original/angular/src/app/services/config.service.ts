import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    public readonly config = new BehaviorSubject({ animateTrail: false, enableShadow: false, enableSun: true });
}