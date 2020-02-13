import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    ClipboardModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      preventDuplicates: true,
      positionClass: 'toast-top-center',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
