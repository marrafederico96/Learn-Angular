import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal, Signal } from "@angular/core";
import { GroupDTO } from "../dto/GroupDTO";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GroupService {
    private http = inject(HttpClient);
    private url = "http://localhost:8080";

    getGroup(): Observable<GroupDTO[]> {
        return this.http.get<GroupDTO[]>(`${this.url}/group/get`);
    }

    createGroup(groupInfo: GroupDTO): Observable<void> {
        return this.http.post<void>(`${this.url}/group/create`, groupInfo);
    }

}

