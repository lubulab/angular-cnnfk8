import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { catchError, delay, mergeMap, retryWhen } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Platform } from '@angular/cdk/platform';
import { Router } from '@angular/router';
import { MockService } from '../app/mock.service';

const delayTime = (time) => new Promise((resolve) => setTimeout(resolve, time));
const getDimensions = () => {
  const { innerHeight, innerWidth } = window;
  return { width: Math.min(innerWidth, 480), height: innerHeight - 100 };
};

const isMimeTypeSupported = (type: string) =>
  MediaRecorder.isTypeSupported(type);
declare const MediaRecorder: any;

const modalConstants = {
  CENTER: {
    instruction: 'Gira il volto al centro',
  },
  LEFT: {
    instruction: 'Gira il volto a sinistra',
  },
  RIGHT: {
    instruction: 'Gira il volto a destra',
  },
};

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
  @ViewChild('video', { static: false }) videoElementRef!: ElementRef;
  counter: number = 0;
  showInstructionsModal: boolean;
  instruction: string;
  options: any;
  key: string;
  deviceType: string;
  videoElement!: HTMLVideoElement;
  stream!: MediaStream;
  recordVideoElement!: HTMLVideoElement;
  mediaRecorder: any;
  recordedBlobs: Blob[] = [];
  isRecording: boolean = false;
  count: number = 1;
  mimeType!: string;
  videoInstructions: any;

  constructor(
    private platform: Platform,
    private mockService: MockService,
    private router: Router
  ) {}

  private getDeviceType() {
    if (this.platform.IOS) {
      this.deviceType = 'IOS';
    } else if (this.platform.ANDROID) {
      this.deviceType = 'ANDROID';
    } else {
      this.deviceType = null;
    }
  }

  private initializeMediaRecorder() {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: { facingMode: 'user', frameRate: 30 },
      })
      .then(async (stream) => {
        this.videoElement = this.videoElementRef.nativeElement;
        this.videoElement.setAttribute('autoplay', '');
        this.videoElement.setAttribute('muted', '');
        this.videoElement.setAttribute('playsinline', '');
        this.videoElement.width = window.screen.availWidth;
        this.stream = stream;
        this.videoElement.srcObject = this.stream;
      });
  }

  async ngOnInit() {
    this.options = { ...getDimensions() };
    this.getDeviceType();
    this.initializeMediaRecorder();
  }

  showInstructions() {
    let nmoves = '3';
    let sessionId = 'EIRFORPAYBACK' + Math.floor(Math.random() * 5 + 0); 
    this.mockService.livenessInit(sessionId, nmoves).subscribe((res) => {
      if (res['esito'].toUpperCase() === 'OK') {
        this.videoInstructions = res['moves'];
        this.key = res['key'];
        this.startRecording();
      }
    });
  }

  startRecording = async () => {
    this.mimeType = 'video/webm';
    if (!isMimeTypeSupported(this.mimeType)) {
      this.mimeType = 'video/mp4; codecs="avc1.424028, mp4a.40.2"';
    }
    let options: any = { mimeType: this.mimeType };
    try {
      this.mediaRecorder = new MediaRecorder(this.stream, options);
    } catch (err) {
      console.log(err.message);
    }
    this.mediaRecorder.width = this.options.width;
    this.mediaRecorder.height = this.options.height;
    this.mediaRecorder.start();
    this.isRecording = true;
    this.startTimer();
    this.onDataAvailableEvent();
    this.onStopRecordingEvent();
  };

  saveVideo = (video: any) => {
    let count = 4;
    alert(video);
    this.mockService
      .faceMatch(this.deviceType, '', this.key, video.split(';base64,')[1])
      .pipe(
        retryWhen((errors) =>
          errors.pipe(
            mergeMap((err, i) => {
              if (err.status !== +'500') {
                return throwError(err);
              } else {
                return i >= count ? throwError(err) : of(err);
              }
            }),
            delay(5000)
          )
        ),
        catchError((error: any) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === +'500') {
              //this.matDialog.closeAll();
              //this.router.forward(null);
            }
          }
          return null;
        })
      )
      .subscribe((res) => {
        if (res && res['userId']) {
          console.log('INSIDE FACEMATCH SUBSCRIBE: 200 OK');
          // this.router.navigate(['thanks']);
        } else {
          console.log('INSIDE FACEMATCH SUBSCRIBE: 200 KO');
          //.open(PopUpErrorAccountComponent, dialogConfig)
          //.afterClosed()
          //.subscribe((result) => {
          //this.counter++;
          //console.log('this.counter', this.counter);
          //if (this.counter >= 3) {
          //console.log('from if');
          //const dialogConfig = new MatDialogConfig();
          //dialogConfig.disableClose = true;
          //dialogConfig.width = '100%';
          //dialogConfig.data = { name: 'uploadVideoFinalError' };
          //this.matDialog
          //.open(PopUpErrorAccountComponent, dialogConfig)
          //.afterClosed()
          //.subscribe((result) => {
          //this.router.forward(null, true);
          //});
          //} else {
          //this.showInstructionsModal = false;
          //}
          // });
        }
      });
  };

  blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  async startTimer() {
    this.showInstructionsModal = true;
    let delayInterval = (12 / this.videoInstructions.length) * 1000;
    for (let instruction of this.videoInstructions) {
      this.instruction = this.getInstruction(instruction.toUpperCase());
      await delayTime(delayInterval);
    }
    this.stopRecording();
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = !this.isRecording;
  }

  onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          this.recordedBlobs.push(event.data);
        }
      };
    } catch (error) {
      console.log(error);
    }
  }

  async onStopRecordingEvent() {
    const stopped = new Promise((resolve, reject) => {
      this.mediaRecorder.onstop = resolve;
      this.mediaRecorder.onerror = (event: any) => reject(event.name);
    });
    await stopped;
    const videoBuffer = new Blob(this.recordedBlobs, { type: this.mimeType });
    let base64data = await this.blobToBase64(videoBuffer);
    // console.log(base64data);
    this.saveVideo(base64data);
  }

  getInstruction(key: string): string {
    speechSynthesis.speak(
      new SpeechSynthesisUtterance(modalConstants[key].instruction)
    );
    return modalConstants[key].instruction;
  }

}