import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onEmpNavigate(){
    this.router.navigate(['login/emp']);

  }

  onAdminNavigate(){
    this.router.navigate(['login/admin']);
  }

  scroll(el: HTMLElement){
    el.scrollIntoView({behavior: 'smooth'});

  }

}
