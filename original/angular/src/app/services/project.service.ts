import { Injectable } from "@angular/core";
import { BaseHttpService } from "./base-http.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class ProjectService extends BaseHttpService {

    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    public get(id: number) {
        return this.httpClient.get<any>('/api/project/detail/' + id);
    }

    public setBBox(id: number, bbox: any) {
        return this.httpClient.put<any>('/api/project/bbox/' + id, bbox);
    }
}