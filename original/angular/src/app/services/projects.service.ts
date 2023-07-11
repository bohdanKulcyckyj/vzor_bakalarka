import { Injectable } from "@angular/core";
import { BaseHttpService } from "./base-http.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class ProjectsService extends BaseHttpService {

    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    public list() {
        return this.httpClient.get<any>('/api/projects/list');
    }
}