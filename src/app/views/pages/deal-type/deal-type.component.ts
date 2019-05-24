import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { PagesService } from '../pages.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import {
	FormBuilder,
	FormGroup,
	Validators,
	FormControl
} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
export interface DealElement{
  created_at: string;
  created_by: number;
  deleted_at: string;
  deleted_by: string;
  id: number;
  deal_type: string;
  updated_at: string
  updated_by: number
}


@Component({
  selector: 'kt-deal-type',
  templateUrl: './deal-type.component.html',
  styleUrls: ['./deal-type.component.scss']
})
export class DealTypeComponent implements OnInit {
  dealForm: FormGroup;
	submitted = false;
	deals: DealElement[];
	dealLoaded: Promise<boolean>;
	displayedColumns: string[] = ['select', 'position', 'deal', 'actions'];
	dataSource: any;
  selection = new SelectionModel<DealElement>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public pages: PagesService,
		private formBuilder: FormBuilder,
		public dialog: MatDialog) { }

  ngOnInit() {
    this.dealForm = new FormGroup({
			deal: new FormControl(null)
		});

		this.dealForm = this.formBuilder.group({
			deal: ['', Validators.required]
		});

		this.getDeals();
  }
  addDealType() {
		this.submitted = true;
		const controls = this.dealForm.controls;
		/** check form */
		if (this.dealForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		const dealData = {
			deal: controls['deal'].value
    };
    
		this.pages.addDealType(dealData.deal).subscribe(data => {
			if (data) {
				this.dealForm.reset();this.getDeals()
				console.log('yes');
			} else {
				console.log('no');
			}
		});
	}

	getDeals() {
		this.pages.getDealType().subscribe((response: any) => {
      console.log(response);
      this.deals = response.data.data;
      this.dataSource = new MatTableDataSource<DealElement>(
				this.deals
			);
			this.dataSource.paginator = this.paginator;

			this.dealLoaded = Promise.resolve(true);
		});
  }
  
  isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}


	masterToggle() {
		this.isAllSelected()
			? this.selection.clear()
			: this.dataSource.data.forEach(row => this.selection.select(row));
	}

	checkboxLabel(row?: DealElement): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${
			this.selection.isSelected(row) ? 'deselect' : 'select'
		} row ${row.id + 1}`;
  }


  openEditDialog(row?: DealElement): void {
    console.log(row);
		const dialogRef = this.dialog.open(EditDealDialog, {
			width: '500px',
			height: '250px',
			data: row
		});
	}
  openDeleteDialog(row?: DealElement): void {
		let data = row;
		const dialogRef = this.dialog.open(DeleteDealDialog, {
			width: '500px',
			height: '200px',
			data: row
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getDeals();

		});
	}

}

@Component({
	selector: 'edit-deal-dialog',
	templateUrl: 'edit-deal-dialog.html',
	styleUrls: ['../zipcode/zipcode.component.scss']
})
export class EditDealDialog {
	constructor(
		public dialogRef: MatDialogRef<EditDealDialog>,
		@Inject(MAT_DIALOG_DATA) public data: DealElement,
		public pages: PagesService
	) {}

	editDealType(data) {
		this.pages.editDealType(data).subscribe((response: any = {}) => {
			this.dialogRef.close();
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'delete-deal-dialog',
	templateUrl: 'delete-deal-dialog.html',
	styleUrls: ['../zipcode/zipcode.component.scss']
})
export class DeleteDealDialog {

	constructor(
		public dialogRef: MatDialogRef<DeleteDealDialog>,
		@Inject(MAT_DIALOG_DATA) public data: DealElement,
		public pages: PagesService
	) {}

	deleteDealType(data) {
		this.pages.deleteDealType(data).subscribe((response: any = {}) => {
			this.dialogRef.close();
		});
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

