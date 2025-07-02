import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GroupDTO } from '../../dto/GroupDTO';
import { GroupService } from '../../service/group.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-left-panel',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './left-panel.html',
  styleUrl: './left-panel.scss'
})
export class LeftPanel implements OnInit {
  private formBuilder = inject(FormBuilder);
  private groupAuth = inject(GroupService);
  groupList: GroupDTO[] | null = null;
  groupForm!: FormGroup;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.createForm();
    this.groupAuth.getGroup().subscribe({
      next: (data) => {
        this.groupList = data;
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
    this.createGroup()
  }

  createGroup() {
    this.groupAuth.createGroup(this.groupForm.value).subscribe({
      next: () => {
        this.groupForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      }
    })
  }
}
