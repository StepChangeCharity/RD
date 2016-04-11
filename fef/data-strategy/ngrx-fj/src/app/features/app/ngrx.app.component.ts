import { Component, ChangeDetectionStrategy } from 'angular2/core';
import { STRATEGY } from "../../infrastructure/models/config";

// NGRX
import { Store } from "@ngrx/store";
import { MyRxStore } from "../../infrastructure/stores/my-rx-store";
import { Observable } from 'rxjs/Observable';

// REDUX
// import { MyReduxStore } from "../../infrastructure/stores/my-redux-store";

import { addProduct, updateCategoryChain, removeProduct } from "../../infrastructure/actions/product-actions";
import { addPurchase, removePurchase } from "../../infrastructure/actions/purchase-actions";
import { toggleVat } from "../../infrastructure/actions/ui-state-actions";

import { ProductLine } from "../../shared/components/product-line";
import { Basket } from "../../shared/components/basket";
import { Product } from "../../infrastructure/models/product";
import { Purchase } from "../../infrastructure/models/purchase";
import { UiState } from "../../infrastructure/models/ui-state";
import { Copyright } from "../../shared/components/copyright";
import { ProductDetail } from "../../shared/components/product-detail";
import { Modal } from "../../shared/components/modal";

@Component({
	selector: 'app',
	changeDetection: STRATEGY,
	directives: [ProductLine, Basket, Copyright, ProductDetail, Modal],
	styles: [`
		.title {
			float: left;
		}
	`],	
	template: `
		<h2 class="title">My Ngrx Flux Shop</h2>
	
		<basket 
			[items]="_basket | async" 
			[includeVat]="_uiState.showVAT"
			(includeTax)="vatChange($event)">
		</basket>
		<div class="clear"></div>
		
		<ul>
			<li *ngFor="#prod of _products | async">
				<product-line 
					[product]="prod"
					[includeTax]="_uiState.showVAT"
					(onBuy)="onBuy($event)"
					(onEdit)="onEdit($event)"
					(onDelete)="onDelete($event)">
				</product-line>
				
			</li>
		</ul>
		<div class="clear"></div>
		<button (click)="onAddNew()">Add Product</button>
		
		<copyright>StepChange Debt Charity</copyright>
	`
})
export class NgrxApp {
	private title: string;
	_myStore: Store<MyRxStore> = null;
	_products: Observable<Array<Product>> = null;
	_basket: Observable<Array<Purchase>> = null;
	_uiState: Observable<UiState> = null;
	
	constructor(myStore: Store<MyRxStore>) {
		this._myStore = myStore;
		this._products = this._myStore.select("products");
		this._basket = this._myStore.select("basket");
		this._uiState = this._myStore.select("uiState");		
		// OK, this is a _bit_ icky
		
	}

	vatChange(isChecked: boolean) {
		this._myStore.dispatch(toggleVat());
	}
	
	onBuy(product: Product) {
		this._myStore.dispatch(addPurchase(product.sku, 1, product.price));
	}
	
	onAddNew() {
		let p: Product = Product.MockProduct();
		
		this._myStore.dispatch(addProduct(
			p.sku, p.name, p.imageUrl, p.categoryChain, p.price
		));
		
	}
	
	onEdit(p: Product): void {
		// Just mimic and edit by flipping the category chain elements around
		let arrChain: Array<string> = p.categoryChain.split(",");
		
		let rev = "";
		let tmp: Array<string> = new Array<string>();
		p.categoryChain.split(",")
		for (let i: number = arrChain.length-1; i >= 0; i--) {
			tmp.push(arrChain[i]);			
		}
		rev = tmp.join(",");
		
		this._myStore.dispatch(updateCategoryChain(p.sku, rev));
	}
	
	onDelete(prod: Product): void {
		this._myStore.dispatch(removeProduct(prod.sku));
	}	

}