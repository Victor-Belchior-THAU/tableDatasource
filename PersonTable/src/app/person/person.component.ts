import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { PersonService } from '../person.service';
//import { PersonDataSource } from './person.datasource';
import { PersonModel } from './person.model';
import { PersonItem } from './personItem';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

//const persons: PersonModel[] = [];

@Component({
  selector: 'app-person',

  template: `
    <div>
      <div fxLayout fxLayoutAlign="center center">
        <mat-form-field fxFlex="40%">
          <input
            matInput
            type="text"
            (keyup)="doFilter($event.target.value)"
            placeholder="Filter"
          />
        </mat-form-field>
      </div>
      <table mat-table [dataSource]="dataSource" matSort>
        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef mat-sort-header>
            Name
          </mat-header-cell>
          <mat-cell *matCellDef="let person"> {{ person.name }} </mat-cell>
        </ng-container>
        <ng-container matColumnDef="age">
          <mat-header-cell *matHeaderCellDef mat-sort-header>
            Age
          </mat-header-cell>
          <mat-cell *matCellDef="let person"> {{ person.age }} </mat-cell>
        </ng-container>
        <ng-container matColumnDef="gender">
          <mat-header-cell *matHeaderCellDef mat-sort-header>
            Gender
          </mat-header-cell>
          <mat-cell *matCellDef="let person"> {{ person.gender }} </mat-cell>
        </ng-container>
        <ng-container matColumnDef="email">
          <mat-header-cell *matHeaderCellDef mat-sort-header>
            Email
          </mat-header-cell>
          <mat-cell *matCellDef="let person"> {{ person.email }} </mat-cell>
        </ng-container>
        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
      </table>
      <mat-paginator [pageSize]="2" [pageSizeOptions]="[2, 4, 6, 10, 20]">
      </mat-paginator>
    </div>
  `,

  styles: [
    `
      table {
        width: 100%;
      }

      th.mat-sort-header-sorted {
        color: black;
      }
    `,
  ],

  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class PersonComponent implements OnInit, AfterViewInit {
  //public dataSource: PersonDataSource | null;

  public displayedColumns = ['name', 'age', 'gender', 'email'];

  public expandedElement: PersonModel;

  public mytest: PersonModel[];

  public name: any;

  public PERSONS: Array<PersonModel>;

  public person: PersonModel;

  public test: any;

  private subject: BehaviorSubject<Array<PersonModel>> = new BehaviorSubject<
    Array<PersonModel>
  >([]);

  obs: Observable<any>;
  dataSource = new MatTableDataSource<PersonModel>(this.mytest);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public personService: PersonService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.personService
      .retrieve()
      .then((response: Array<PersonModel>) => {
        this.mytest = response;
        this.PERSONS = response;
        this.dataSource.data = response;
      })
      .catch((error: any) => {
        console.error(error);
        this.showError('Falha ao recuperar nomes.');
      });

    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  showError(arg0: string) {
    throw new Error('Method not implemented.');
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  /* public getPersons(): void {
     this.personService
       .retrieve()
       .then((response: Array<PersonModel>) => {
         this.PERSONS = response;
         console.log(this.PERSONS);
       })
       .catch((error: any) => {
         console.error(error);
         this.showError('Falha ao recuperar nomes.');
       });
   }*/
}
