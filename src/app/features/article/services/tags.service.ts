import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpService } from "../../../core/http/http.service";

@Injectable({ providedIn: "root" })
export class TagsService {
  constructor(private readonly http: HttpService) {}

  getAll(): Observable<string[]> {
    return this.http
      .get<{ tags: string[] }>("/tags")
      .pipe(map((data) => data.tags));
  }
}
