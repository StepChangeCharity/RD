import {Injectable} from "angular2/core";
import {createStore} from "redux";
import {combineReducers} from 'redux';
import {List} from "immutable";

import {ReduxStore} from "./redux-store";
import {Mocks} from "./mocks";

import {products} from "../reducers/product-reducer";
import {uiState} from "../reducers/ui-state-reducer";
import {basket} from "../reducers/purchase-reducer";

import {Product} from "../models/product";
import {Purchase} from "../models/purchase";
import {UiState} from "../models/ui-state";

const storeReducers = combineReducers({
	uiState,
	products,
	basket
});

const store = createStore(storeReducers, {
	uiState: Mocks.initialUiState(),
	products: Mocks.initialProducts(),
	basket: Mocks.initialBasket()
});
		

@Injectable()
export class MyStore extends ReduxStore {
	constructor() {
		super(store); 
	}
	
	/**
	 * Converts the Immutable List<> into a typed Array.  This way our "shared"
	 * components have no dependency on Immutable.
	*/
	get products(): Array<Product> {
		let prods: List<Product> = (<List<Product>> super.getState().products);
		return prods.toArray();
	}
	
	/**
	 * Converts the Immutable List<> into a typed Array.  This way our "shared"
	 * components have no dependency on Immutable.
	*/
	get basket(): Array<Purchase> {
		let purses: List<Purchase> = (<List<Purchase>> super.getState().basket);
		return purses.toArray();
	}

	/**
	 * Gives typed version of UiState class. 
	*/	
	get uiState(): UiState {
		return <UiState> super.getState().uiState;
	} 
	
}