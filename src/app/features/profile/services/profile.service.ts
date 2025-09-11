import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Profile } from "../models/profile.model";
import { HttpService } from "../../../core/http/http.service";

@Injectable({ providedIn: "root" })
export class ProfileService {
  constructor(private readonly http: HttpService) {}

  get(username: string): Observable<Profile> {
    return this.http.get<{ profile: Profile }>("/profiles/" + username).pipe(
      map((data: { profile: Profile }) => data.profile),
      shareReplay(1),
    );
  }

  follow(username: string): Observable<Profile> {
    return this.http
      .post<{ profile: Profile }>("/profiles/" + username + "/follow", {})
      .pipe(map((data: { profile: Profile }) => data.profile));
  }

  unfollow(username: string): Observable<Profile> {
    return this.http
      .delete<{ profile: Profile }>("/profiles/" + username + "/follow")
      .pipe(map((data: { profile: Profile }) => data.profile));
  }
}
