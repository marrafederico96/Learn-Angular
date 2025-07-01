import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-auth-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss'
})
export class AuthFormComponent implements OnInit {

  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  errorMessage: string | null = null;

  private currentRoute: string = "login";
  authForm!: FormGroup;

  ngOnInit(): void {
    this.route.url
      .pipe(map(segments => segments[segments.length - 1]?.path)).subscribe(lastSegment => { this.currentRoute = lastSegment; this.generateForm(); });

  }

  isLogin() {
    return this.currentRoute === "login";
  }



  generateForm() {
    if (!this.isLogin()) {
      this.authForm = this.formBuilder.group({
        username: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      })
    } else {
      this.authForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      })
    }
  }


  onSubmit() {
    if (this.currentRoute === "login") {
      this.auth.login(this.authForm.value).subscribe({
        next: () => {
          this.authForm.reset();
        },
        error: (err) => {
          this.errorMessage = err.error.message;
        }
      });
    } else {
      this.auth.register(this.authForm.value).subscribe({
        next: () => {
          this.authForm.reset();
        },
        error: (err) => {
          this.errorMessage = err.error.message;
        }
      });
    }

  }

}
