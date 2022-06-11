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

  faceMatch(deviceType: string, img: string, key: string, video: any, scenario) {
    let dataBase64 = {
      title: img,
      body: video,
      userId: 1
    };

    let data200KO = {
      title: img,
      body: key,
      userId: 50
    };

    let dataString = {
      title: img,
      body: key,
      userId: 1
    };

    let data = {};

    let endpointOK = 'https://jsonplaceholder.typicode.com/posts';
    let endpointKO = 'https://jsonplaceholder.typicode.com/postszz';
    let endpoint = '';

    switch (scenario) {
      case 1:
        console.log('Base64 to API 200 OK');
        data = dataBase64;
        endpoint = endpointOK;
        break;
      case 2:
        console.log('String to API 200 OK');
        data = dataString;
        endpoint = endpointOK;
        break;
      case 3:
        console.log('Base64 to API 200 KO');
        data = data200KO;
        endpoint = endpointOK;
        break;
      case 4:
        console.log('String to API 200 KO');
        data = data200KO;
        endpoint = endpointOK;
        break;
      case 5:
        console.log('Base64 to API 500 KO');
        data = dataBase64;
        endpoint = endpointKO;
        break;
      case 6:
        console.log('String to API 500 KO');
        data = dataString;
        endpoint = endpointKO;
        break;            
    }

    return this.http.post(endpoint, JSON.stringify(data));

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
