import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  imageVisible = false;

  ngOnInit(): void {
    // Show image with fade-in after a brief delay
    setTimeout(() => {
      this.imageVisible = true;
    }, 50);

    // Redirect to /productos after 1 second from image being visible
    setTimeout(() => {
      this.router.navigate(['/productos']);
    }, 1050);
  }
}

