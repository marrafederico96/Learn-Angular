import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeftPanel } from "../../component/left-panel/left-panel";


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, LeftPanel],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
}
