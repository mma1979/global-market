import { Component, OnInit} from '@angular/core';
import {HelperService} from '../../../shared/services/helper.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {GlobalDataService} from '../../../shared/services/global-data.service';
import {SubCategoryModel} from '../../../models/Categories/sub-category.model';
import {ProductModel} from '../../../models/Products/product.model';
import {SubCategoryActions} from '../../../state-management/sub-category/sub-category.actions';
import FetchAllSubCategories = SubCategoryActions.FetchAllSubCategories;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  relatedProducts: ProductModel[] = [];

  constructor(public helperService: HelperService,
              public router: Router,
              public store: Store,
              public route: ActivatedRoute,
              public gdService: GlobalDataService) {
    this.helperService.showSpinner();
    this.route.paramMap.subscribe((params: ParamMap) => {
      const productId = +params.get('productId');
      const subCategoryId = +params.get('subCategoryId');
      if (!this.gdService.SubCategories) {
        this.store.dispatch(new FetchAllSubCategories()).subscribe(() => {
          this.setData(productId, subCategoryId);
        });
      } else {
        this.setData(productId, subCategoryId);
      }
    });
  }

  backToTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  setData(productId: number, subCategoryId: number) {
    const subCategory = this.gdService.SubCategories.find(sc => sc.id === subCategoryId);
    if (subCategory) {
      this.subCategory = subCategory;
      const product = subCategory.products.find(p => p.id === productId);
      if (product) {
        this.relatedProducts = [];
        this.product = product;
        this.selectedImage = product.images[0];
        for (let i = 0; i < product.references.length; i++) {
          const productModel = subCategory.products.find(p => p.id === product.references[i]);
          if (productModel) {
            this.relatedProducts = [...this.relatedProducts, productModel];
          }
        }
      }
    }
    this.helperService.hideSpinner();
  }

  selectedImage: string;

  setSelectedImage(image: string) {
    this.selectedImage = image;
  }

  subCategory: SubCategoryModel;
  product: ProductModel;

  ngOnInit(): void {
  }

}
