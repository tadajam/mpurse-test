import { Component, NgZone } from '@angular/core';
import { MpurseService } from '../services/mpurse.service';
import { Subscription } from 'rxjs';
import { map, filter, flatMap, first, tap, take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private subscriptions: Subscription;

  isUnlocked = false;
  address = '';

  constructor(
    private mpurseService: MpurseService,
    private zone: NgZone
  ) {}

  ionViewDidEnter(): void {
    this.subscriptions = new Subscription();

    this.subscriptions.add(
      this.mpurseService.unlockState
        .subscribe(isUnlocked => this.zone.run(() => this.isUnlocked = isUnlocked))
    );

    this.getAddress();
    this.subscriptions.add(
      this.mpurseService.selectedAddressState
        .subscribe(address => this.zone.run(() => this.address = address))
    );
  }

  ionViewWillLeave(): void {
    this.subscriptions.unsubscribe();
  }

  getAddress() {
    this.mpurseService.getAddress().subscribe({
      next: address => this.address = address
    });
  }

  sendAssetTxHash = '';
  sendAsset(to: string, asset: string, amount: number, memoType: string, memoValue: string): void {
    this.mpurseService.sendAsset(to, asset, amount, memoType, memoValue)
      .subscribe({
        next: txHash => this.sendAssetTxHash = txHash,
        error: error => console.log(error)
      });
  }

  signature = '';
  signMessage(): void {
    this.mpurseService.signMessage('test message')
      .subscribe({
        next: signature => this.signature = signature,
        error: error => console.log(error)
      });
  }

  signedTx = '';
  signRawTransaction(): void {
    this.mpurseService.createSend(this.address)
      .pipe(flatMap(tx => this.mpurseService.signRawTransaction(tx)))
      .subscribe({
        next: signedTx => this.signedTx = signedTx,
        error: error => console.log(error)
      });
  }

  sendTxHash = '';
  sendRawTransaction(): void {
    this.mpurseService.createSend(this.address)
      .pipe(flatMap(tx => this.mpurseService.sendRawTransaction(tx)))
      .subscribe({
        next: sendTxHash => this.sendTxHash = sendTxHash,
        error: error => console.log(error)
      });
  }

  balances: any;
  getBalances(): void {
    this.mpurseService.getBalances(this.address)
      .subscribe({
        next: balances => this.balances = JSON.stringify(balances),
        error: error => console.log(error)
      });
  }

  assetsInfo: any;
  getAssetsInfo(): void {
    this.mpurseService.getAssetsInfo(['XMP', 'MPCHAIN'])
      .subscribe({
        next: assetsInfo => this.assetsInfo = JSON.stringify(assetsInfo),
        error: error => console.log(error)
      });
  }

  createdTx: string;
  createSend() {
    this.mpurseService.createSend(this.address)
      .subscribe({
        next: tx => this.createdTx = tx,
        error: error => console.log(error)
      });
  }

  hide(): void {
    this.mpurseService.hide();
  }

}
