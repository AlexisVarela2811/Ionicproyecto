import { ComponentFixture, TestBed } from '@angular/core/testing';
import { perfilPage } from './perfil.page';

describe('perfilPage', () => {
  let component: perfilPage;
  let fixture: ComponentFixture<perfilPage>;

  beforeEach(async() => {
    fixture = TestBed.createComponent(perfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
