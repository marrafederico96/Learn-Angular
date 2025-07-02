import { Component, inject, OnInit, Signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GroupDTO } from '../../dto/GroupDTO';
import { GroupService } from '../../service/group.service';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';

@Component({
  selector: 'app-left-panel',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './left-panel.html',
  styleUrl: './left-panel.scss'
})
export class LeftPanel implements OnInit {
  private formBuilder = inject(FormBuilder);
  private groupAuth = inject(GroupService);
  groupForm!: FormGroup;
  errorMessage: string | null = null;
  groupInfo: Signal<GroupDTO[] | null>;

  constructor() {
    this.groupInfo = this.groupAuth.groupInfo;
  }

  ngOnInit(): void {
    this.createForm();
    this.groupAuth.getGroup().subscribe({
      next: () => {
        this.groupAuth.initGroupInfo();
      }
    });

  }

  createForm() {
    this.groupForm = this.formBuilder.group({
      groupName: ['', Validators.required],
      groupDescription: [''],
    })
  }

  onSubmit() {
    this.createGroup();
  }

  createGroup() {
    this.groupAuth.createGroup(this.groupForm.value).subscribe({
      next: () => {
        this.groupForm.reset();
        this.groupAuth.initGroupInfo();
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      }
    })
  }
}
