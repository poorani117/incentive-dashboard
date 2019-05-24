import { ZipcodeComponent } from './../../pages/zipcode/zipcode.component';
// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './base/base.component';
import { ErrorPageComponent } from './content/error-page/error-page.component';

// Auth
import { AuthGuard } from '../../../core/auth';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CountyComponent } from '../../pages/county/county.component';
import { CountryComponent } from '../../pages/country/country.component';
import { StateComponent } from '../../pages/state/state.component';
import { IncentivesComponent } from '../../pages/incentives/incentives.component';
import { DealTypeComponent } from '../../pages/deal-type/deal-type.component';
import { ValueTypeComponent } from '../../pages/value-type/value-type.component';

const routes: Routes = [
	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'dashboard',
				loadChildren: 'app/views/pages/dashboard/dashboard.module#DashboardModule'
			},
			{
				path: 'mail',
				loadChildren: 'app/views/pages/apps/mail/mail.module#MailModule'
			},
			{
				path: 'ecommerce',
				loadChildren: 'app/views/pages/apps/e-commerce/e-commerce.module#ECommerceModule',
				// canActivate: [NgxPermissionsGuard],
				// data: {
				// 	permissions: {
				// 		only: ['accessToECommerceModule'],
				// 		redirectTo: 'error/403'
				// 	}
				// }
			},
			{
				path: 'zipcode',
				component: ZipcodeComponent

			},
			{
				path: 'county',
				component: CountyComponent 
			},
			{
				path: 'country',
				component: CountryComponent
			},
			{
				path: 'state',
				component: StateComponent
			},
			{
				path: 'incentives',
				component: IncentivesComponent
			},
			{
				path: 'deal-type',
				component: DealTypeComponent
			},
			{
				path: 'value-type',
				component: ValueTypeComponent
			},
			{
				path: 'ngbootstrap',
				loadChildren: 'app/views/pages/ngbootstrap/ngbootstrap.module#NgbootstrapModule'
			},
			{
				path: 'material',
				loadChildren: 'app/views/pages/material/material.module#MaterialModule'
			},
			{
				path: 'user-management',
				loadChildren: 'app/views/pages/user-management/user-management.module#UserManagementModule'
			},
			{
				path: 'builder',
				loadChildren: 'app/views/themes/demo1/content/builder/builder.module#BuilderModule'
			},
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					'type': 'error-v6',
					'code': 403,
					'title': '403... Access forbidden',
					'desc': 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			{path: 'error/:type', component: ErrorPageComponent},
			{path: '', redirectTo: 'dashboard', pathMatch: 'full'},
			{path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PagesRoutingModule {
}
