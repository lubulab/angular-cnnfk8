import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockService {
  constructor(private http: HttpClient) {}

  livenessInit(sessionId: string, nmoves: string): Observable<any> {
    return of({
      esito: 'OK',
      errorCode: null,
      errorDescription: null,
      key: 'ADFTG453',
      moves: ['Right', 'Center', 'Left', 'Center', 'Right', 'Center'],
    });
  }

  faceMatch(deviceType: string, img: string, key: string, video: any) {
    const data = {
      title: img,
      body: video,
      userId: 1
    };

    return this.http.post('https://jsonplaceholder.typicode.com/posts', data);

    /*
    return of({
      esito: 'OK',
      errorCode: null,
      errorDescription: null,
      images: [
        {
          faceId: '2',
          isIdentical: 'false',
          confidence: 0.4860555501592239,
        },
        {
          faceId: '3',
          isIdentical: 'false',
          confidence: 0.4980744067454498,
        },
      ],
    });
    */
  }
}
