import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  IonContent,
  IonButtons,
  IonBackButton,
  IonText,
  NavController,
} from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { google } from 'google-maps';
import { MatDividerModule } from '@angular/material/divider';
import * as NodeGeocoder from 'node-geocoder';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingService } from 'src/app/services/loading-service/loading.service';
import { AppConfigService } from 'src/app/services/app-config/app-config.service';
import { ApiConfigService } from 'src/app/services/api-config/api-config.service';
import { CommonModule } from '@angular/common';
import { inOutAnimation } from 'src/app/core/shared/fade-in-out-animation';
import { UnsubscriberService } from 'src/app/services/unsubscriber/unsubscriber.service';
import { FTimeTableForm as StudentDetailsForm } from 'src/app/core/forms/f-time-table-form';
import { GetSDetailStudents } from 'src/app/core/interfaces/GetSDetails';
import { finalize, Observable, of, switchMap, tap } from 'rxjs';
import { RouteDetail, VehicleDetail } from 'src/app/core/interfaces/transports';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-maps-page',
  templateUrl: './maps-page.component.html',
  styleUrls: ['./maps-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButtons,
    IonBackButton,
    IonText,
    MatToolbarModule,
    MatDividerModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [inOutAnimation],
})
export class MapsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('capacitorGoogleMap') capacitorGoogleMap!: ElementRef;
  @ViewChild('swipeDiv') swipeDiv!: ElementRef<HTMLDivElement>;
  @ViewChild('swipeContainer') swipeContainer!: ElementRef<HTMLDivElement>;
  vehicleDetails$!: Observable<VehicleDetail[]>;
  routeDetail$!: Observable<RouteDetail[]>;
  newMap!: GoogleMap;
  selectedStudent: GetSDetailStudents = JSON.parse(
    localStorage.getItem('selectedStudent')!
  );
  constructor(
    private loadingService: LoadingService,
    private _appConfig: AppConfigService,
    private apiService: ApiConfigService,
    private unsubscribe: UnsubscriberService,
    private navCtrl: NavController
  ) {
    this.registerIcons();
    this.backButtonHandler();
  }
  private registerIcons() {
    let icons = ['telephone-fill'];
    this._appConfig.addIcons(icons, '/assets/bootstrap-icons');
  }
  private backButtonHandler() {
    const backToHome = () => this.navCtrl.navigateRoot('/tabs/tab-1/dashboard');
    this._appConfig.backButtonEventHandler(backToHome);
  }
  private async getCurrentPosition(): Promise<{ lat: number; long: number }> {
    const coordinates = await Geolocation.getCurrentPosition();
    return new Promise((resolve, reject) => {
      return resolve({
        lat: coordinates.coords.latitude,
        long: coordinates.coords.longitude,
      });
    });
  }
  private async initGoogleMap() {
    let mapsContainer = this.capacitorGoogleMap.nativeElement;
    const coordinates = await this.getCurrentPosition();
    this.newMap = await GoogleMap.create({
      id: 'google-map',
      element: mapsContainer,
      apiKey: environment.googleMapApiKey,
      config: {
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoom: 18,
        center: {
          lat: coordinates.lat,
          lng: coordinates.long,
        },
      },
    });
    //const biz = { lat: -6.804507, lng: 39.276025 };
    const cameraId = await this.newMap.setCamera({
      coordinate: {
        lat: coordinates.lat,
        lng: coordinates.long,
      },
    });
    const markerId = await this.newMap.addMarker({
      coordinate: {
        lat: coordinates.lat,
        lng: coordinates.long,
      },
    });
  }
  private createSlideUpAnimation() {
    let swipeDiv = this.swipeDiv.nativeElement;
    let initialClass = 'h-20';
    let targetClass = 'h-[340px]';
    const exists = (classList: DOMTokenList) => {
      if (classList.contains(initialClass)) {
        classList.remove(initialClass);
        classList.add(targetClass);
      } else if (classList.contains(targetClass)) {
        classList.remove(targetClass);
        classList.add(initialClass);
      } else {
      }
    };
    swipeDiv.addEventListener('click', (e) => {
      exists(this.swipeContainer.nativeElement.classList);
    });
  }
  private requestGetRoute() {
    const createVehicleDetails = (vehicles: VehicleDetail[]) => {
      this.vehicleDetails$ = new Observable((subscriber) => {
        subscriber.next(vehicles);
        subscriber.complete();
      });
    };
    const createRouteDetails = (routes: RouteDetail[]) => {
      this.routeDetail$ = new Observable((subscriber) => {
        subscriber.next(routes);
        subscriber.complete();
      });
    };
    let body: StudentDetailsForm = {
      Facility_Reg_Sno: this.selectedStudent.Facility_Reg_Sno.toString(),
      Admission_No: this.selectedStudent.Admission_No,
      From_Date: undefined,
      To_Date: undefined,
    };
    this.loadingService.startLoading().then((loading) => {
      this.apiService
        .getRoute(body)
        .pipe(
          tap((res) => createVehicleDetails(res)),
          switchMap((res) =>
            this.apiService.getRouteDetails({
              Facility_Reg_Sno:
                this.selectedStudent.Facility_Reg_Sno.toString(),
              Route_ID: res[0].Route_ID,
            })
          ),
          tap((res) => createRouteDetails(res)),
          finalize(() => this.loadingService.dismiss())
        )
        .subscribe();
    });
  }
  ngOnInit() {}
  ngAfterViewInit(): void {
    this.initGoogleMap();
    this.createSlideUpAnimation();
    this.requestGetRoute();
  }
  ngOnDestroy(): void {
    this.newMap.destroy();
  }
  openTelephone(phoneNumber: string) {
    let prefix = '+255';
    window.open(`tel:${prefix}${phoneNumber}`);
  }
}
