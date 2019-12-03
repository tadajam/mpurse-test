declare global {
  interface Window { mpurse: any; }
}

import { Injectable } from '@angular/core';
import { Subject, fromEvent, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MpurseService {
  private unlockSubject = new Subject<boolean>();
  unlockState = this.unlockSubject.asObservable();

  private selectedAddressSubject = new Subject<string>();
  selectedAddressState = this.selectedAddressSubject.asObservable();

  constructor() {
    if (window.mpurse) {
      fromEvent(window.mpurse.updateEmitter, 'stateChanged')
        .subscribe((isUnlocked: boolean) => this.unlockSubject.next(isUnlocked));
  
      fromEvent(window.mpurse.updateEmitter, 'addressChanged')
        .subscribe((address: string) => this.selectedAddressSubject.next(address));
    }
  }

  getAddress(): Observable<string> {
    return from(window.mpurse.getAddress()) as Observable<string>;
  }

  sendAsset(to: string, asset: string, amount: number, memoType: string, memoValue: string): Observable<string> {
    return from(window.mpurse.sendAsset(to, asset, amount, memoType, memoValue)) as Observable<string>;
  }

  signMessage(message: string): Observable<string>{
    return from(window.mpurse.signMessage(message)) as Observable<string>;
  }

  signRawTransaction(rawTx: string): Observable<string> {
    return from(window.mpurse.signRawTransaction(rawTx)) as Observable<string>;
  }

  sendRawTransaction(rawTx: string) {
    return from(window.mpurse.sendRawTransaction(rawTx)) as Observable<string>;
  }

  getBalances(address: string): Observable<any> {
    const mpchainParams = {address: address};
    return from(window.mpurse.mpchain('balances', mpchainParams));
  }

  getAssetsInfo(assets: string[]): Observable<any> {
    const cbParams = {assetsList: assets};
    return from(window.mpurse.counterBlock('get_assets_info', cbParams));
  }

  createSend(address: string): Observable<any> {
    const cpParams = {
      source: address,
      destination: 'MJhdBDsJKnJEYcQapW1PdMvV269vd3mVX9',
      asset: 'XMP',
      quantity: 1000000,
      fee_per_kb: 1
    };
    return from(window.mpurse.counterParty('create_send', cpParams));
  }

  hide(): void {
    if (window.mpurse.hide) {
      window.mpurse.hide();
    }
  }
}
