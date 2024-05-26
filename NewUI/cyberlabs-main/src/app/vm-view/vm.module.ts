import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { VmViewComponent } from './vm-view.component';

@NgModule({
  declarations: [
    VmViewComponent
  ],
  imports: [
    CommonModule  // Include CommonModule here
  ]
})
export class VmViewer{};
