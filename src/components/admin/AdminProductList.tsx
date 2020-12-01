import React, { useEffect, useState } from 'react';
import DataTable, { IDataTableColumn } from 'react-data-table-component';
import { getColour, getSize, getSubCategory, getCoupon, getProducts, getShippers, getAllUser, AppState } from 'reducers';
import { useDispatch, useSelector } from 'react-redux';
import { ProductColor, ProductSize, ProductCoupon, ProductSubCategory, Order, OrderShipper, User, ProductItem } from 'types';
import { SubProducts } from 'appConstants';
import { getAdminOrders } from 'reducers/Order';
import { countHighlightProducts } from 'services';

interface Props {
  productType: number;
  productColumns: IDataTableColumn[];
  ExpandableComponent?: React.FunctionComponent<any>;
  stateData: ProductColor[] | ProductSize[] | ProductCoupon[] | ProductSubCategory[] | Order[] | OrderShipper[] | User[];
  searchPlaceholder: string;
  expandableRows: boolean;
  sortByColumn?: string;
  defaultSortAsc?: boolean;
}

const AdminProductList: React.FunctionComponent<Props> = (props: Props) => {

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [tabName, setTabName] = useState('');
  const productList = useSelector<AppState, ProductItem[]>(state => state.product.data || []);
  const [tableData, setTableData] = useState<
    ProductColor[] | ProductSize[] | ProductCoupon[] | ProductSubCategory[] | Order[] | OrderShipper[] | User[]
  >([]);

  let stateData: ProductColor[] | ProductSize[] | ProductCoupon[] | ProductSubCategory[] | Order[] | OrderShipper[] | User[] = [];
  const columns = props.productColumns;

  if (props.productType === SubProducts.COLOUR ||
    props.productType === SubProducts.SIZE ||
    props.productType === SubProducts.SUB_PRODUCT ||
    props.productType === SubProducts.COUPONS ||
    props.productType === SubProducts.PRODUCT ||
    props.productType === SubProducts.ORDERS ||
    props.productType === SubProducts.SHIPPER ||
    props.productType === SubProducts.USERS) {
    stateData = props.stateData
  } else {
    stateData = []
  }

  useEffect(() => {
    if (props.productType === SubProducts.COLOUR) {
      dispatch(getColour());
      setTabName('Colour');
    } else if (props.productType === SubProducts.SIZE) {
      dispatch(getSize());
      setTabName('Size');
    } else if (props.productType === SubProducts.SUB_PRODUCT) {
      dispatch(getSubCategory());
      setTabName('SubCategories');
    } else if (props.productType === SubProducts.COUPONS) {
      dispatch(getCoupon());
      setTabName('Coupons');
    } else if (props.productType === SubProducts.PRODUCT) {
      dispatch(getProducts());
      setTabName('Products');
    } else if (props.productType === SubProducts.ORDERS) {
      dispatch(getAdminOrders());
      setTabName('Orders');
    } else if (props.productType === SubProducts.SHIPPER) {
      dispatch(getShippers());
      setTabName('Shippers');
    } else if (props.productType === SubProducts.USERS) {
      dispatch(getAllUser());
      setTabName('Users');
    }
  }, []);

  useEffect(() => {
    setTableData(stateData || [])
  }, [stateData]);

  useEffect(() => {
    if (stateData && stateData.length > 0) {
      const data = (stateData as any[]).filter(({
        value, code,
        name, productCategoryName,
        orderNumber, shipperName,
        emailAddress, mobile, paymentMode }) => {
        return (value && value.toLowerCase().includes(searchTerm.toLowerCase()))
          || (code && code.toLowerCase().includes(searchTerm.toLowerCase()))
          || (name && name.toLowerCase().includes(searchTerm.toLowerCase()))
          || (productCategoryName && productCategoryName.toLowerCase().includes(searchTerm.toLowerCase()))
          || (orderNumber && orderNumber.toLowerCase().includes(searchTerm.toLowerCase()))
          || (shipperName && shipperName.toLowerCase().includes(searchTerm.toLowerCase()))
          || (emailAddress && emailAddress.toLowerCase().includes(searchTerm.toLowerCase()))
          || (mobile && mobile.toLowerCase().includes(searchTerm.toLowerCase()))
          || (paymentMode && paymentMode.toLowerCase().includes(searchTerm.toLowerCase()));
      })
      setTableData(data)
    }
  }, [searchTerm]);


  return (
    <div className="uk-width-1-1 uk-width-expand@m">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container">

        <div className="uk-card-body">
          <div className="uk-form-stacked">

            <div className="asd">
              <DataTable
                title={tabName}
                columns={columns}
                data={tableData}
                defaultSortField={props.sortByColumn || "code"}
                defaultSortAsc={props.defaultSortAsc !== undefined ? props.defaultSortAsc : true}
                selectableRows={false}
                selectableRowsNoSelectAll={false}
                selectableRowsHighlight={true}
                selectableRowsVisibleOnly={false}
                expandableRows={props.expandableRows}
                expandOnRowClicked={false}
                expandableRowsComponent={props.ExpandableComponent && <props.ExpandableComponent />}
                pagination={true}
                highlightOnHover={true}
                striped={true}
                pointerOnHover={false}
                dense={false}
                noTableHead={false}
                persistTableHead={true}
                progressPending={false}
                noHeader={false}
                subHeader={true}
                subHeaderComponent={
                  (
                    <div className="uk-grid-medium uk-child-width-1-1 uk-width-1-1" uk-grid="true">
                      <div className={`${props.productType === SubProducts.ORDERS ? 'uk-grid-small uk-child-width-1-1 uk-child-width-1-3@s' : 'uk-grid-small uk-child-width-1-1 uk-child-width-1-2@s'}`} uk-grid="true">
                        {
                          props.productType === SubProducts.ORDERS &&
                          <>
                            <div>
                              <label>
                                <span className="uk-form-label"><span style={{ color: "green" }} uk-icon="icon: cart;" /> : Shipped</span>
                                <span className="uk-form-label"><span style={{ color: "green" }} uk-icon="icon: check;" /> : Delivered</span>
                                <span className="uk-form-label"><span style={{ color: "green" }} uk-icon="icon: plus-circle;" /> : Return Accepted</span>
                                <span className="uk-form-label"><span style={{ color: "green" }} uk-icon="icon: lifesaver;" /> : Payment Returned</span>

                              </label>
                            </div>
                            <div>
                              <label>
                                <span className="uk-form-label"><span style={{ color: "orange" }} uk-icon="icon: history;" /> : Return In Progress</span>
                                <span className="uk-form-label"><span style={{ color: "red" }} uk-icon="icon: minus-circle;" /> : Return Declined</span>
                                <span className="uk-form-label"><span style={{ color: "red" }} uk-icon="icon: warning;" /> : Payment Declined</span>
                              </label>
                            </div>
                          </>
                        }

                        {
                          props.expandableRows &&
                          <div>
                            <label>
                              <div className="uk-form-label"><span><span uk-icon="chevron-right"></span>: Click in table for quick actions</span></div>
                              {
                                props.productType === SubProducts.PRODUCT &&
                                <>
                                  <span className="uk-form-label"><span style={{ color: "green" }} uk-icon="icon: bolt;" /> : Trending ({countHighlightProducts(productList,true)})</span>
                                  <span className="uk-form-label"><span style={{ color: "orange" }} uk-icon="icon: star;" /> : Latest ({countHighlightProducts(productList,false)})</span>
                                </>
                              }
                            </label>
                          </div>
                        }
                        {
                          (!props.expandableRows && props.productType !== SubProducts.ORDERS) &&
                          <div></div>
                        }
                        <div>
                          <input className="uk-input uk-form-width-medium uk-form-small uk-float-right" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} type="text" placeholder={props.searchPlaceholder} />
                        </div>
                      </div>
                    </div>

                    // <div className="admin-search-header">
                    //   {
                    //     props.expandableRows &&
                    //     <div className="">
                    //       <div className="">
                    //         <span>Click <span uk-icon="chevron-right"></span> in table for quick actions</span>
                    //       </div>
                    //     </div>
                    //   }
                    //   <div className="uk-float-right">
                    //     <input className="uk-input uk-form-width-medium uk-form-small" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} type="text" placeholder={props.searchPlaceholder} />
                    //   </div>
                    //   <div>
                    //     <div className=""><span style={{ color: "green" }} uk-icon="icon: bolt;" /> : Trending</div>


                    //   </div>

                    //   <div className="">

                    //     <span style={{ color: "orange" }} uk-icon="icon: star;" /> : Latest
                    //           </div>
                    // </div>
                  )
                }
                fixedHeader={true}
                fixedHeaderScrollHeight="800px"
                direction={"ltr"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export {
  AdminProductList
}