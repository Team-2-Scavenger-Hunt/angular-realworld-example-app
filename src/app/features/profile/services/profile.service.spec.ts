import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ProfileService } from "./profile.service";
import { Profile } from "../models/profile.model";

describe("ProfileService", () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService],
    });
    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should get profile by username", () => {
    const mockProfile: Profile = {
      username: "testuser",
      bio: "Test bio",
      image: "test-image.jpg",
      following: false,
    };

    service.get("testuser").subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });

    const req = httpMock.expectOne("/profiles/testuser");
    expect(req.request.method).toBe("GET");
    req.flush({ profile: mockProfile });
  });

  it("should follow user", () => {
    const mockProfile: Profile = {
      username: "testuser",
      bio: "Test bio",
      image: "test-image.jpg",
      following: true,
    };

    service.follow("testuser").subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });

    const req = httpMock.expectOne("/profiles/testuser/follow");
    expect(req.request.method).toBe("POST");
    req.flush({ profile: mockProfile });
  });

  it("should unfollow user", () => {
    const mockProfile: Profile = {
      username: "testuser",
      bio: "Test bio",
      image: "test-image.jpg",
      following: false,
    };

    service.unfollow("testuser").subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });

    const req = httpMock.expectOne("/profiles/testuser/follow");
    expect(req.request.method).toBe("DELETE");
    req.flush({ profile: mockProfile });
  });
});
