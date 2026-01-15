import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // ! do publica pamietac o environment !
    if (!environment.apiEnabled) {
      return next.handle(req);
    }

    const isFile = req.headers.has('is-file');
    const isBlob = req.responseType === 'blob';

    if (req.url.includes('/oauth')) {
      req = req.clone({
        headers: req.headers.append('Content-Type', 'application/x-www-form-urlencoded'),
        url: environment.apiHost + req.url,
        withCredentials: environment.withCredentials
      });

    } else if (req.url.includes('assets')) {
      return next.handle(req);

    } else if (!isFile && !isBlob && !req.headers.has('Content-Type')) {
      req = req.clone({
        url: environment.apiHost + req.url,
        headers: req.headers.append('Content-Type', 'application/json'),
        withCredentials: environment.withCredentials
      });

    } else {
      req = req.clone({
        url: environment.apiHost + req.url,
        headers: new HttpHeaders(),
        withCredentials: environment.withCredentials
      });
    }

    return next.handle(req);
  }
}