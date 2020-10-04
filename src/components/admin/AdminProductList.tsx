import React, { useEffect, useState } from 'react';
import DataTable, { IDataTableColumn } from 'react-data-table-component';
import { getColour, getSize, getSubCategory, getCoupon, getProducts } from 'reducers';
import { useDispatch } from 'react-redux';
import { ProductColor, ProductSize, ProductCoupon, ProductSubCategory } from 'types';
import { SubProducts } from 'appConstants';

interface Props {
  productType: number;
  productColumns: IDataTableColumn[];
  ExpandableComponent: React.FunctionComponent<any>;
  stateData: ProductColor[] | ProductSize[] | ProductCoupon[] | ProductSubCategory[];
  searchPlaceholder: string;
  expandableRows : boolean
}

const AdminProductList: React.FunctionComponent<Props> = (props: Props) => {

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState<ProductColor[] | ProductSize[] | ProductCoupon[] | ProductSubCategory[]>([]);

  let stateData: ProductColor[] | ProductSize[] | ProductCoupon[] | ProductSubCategory[] = [];
  const columns = props.productColumns;

  if(props.productType === SubProducts.COLOUR || 
    props.productType === SubProducts.SIZE || 
    props.productType === SubProducts.SUB_PRODUCT ||
    props.productType === SubProducts.COUPONS ||
    props.productType === SubProducts.PRODUCT){
    stateData = props.stateData
  } else {
    stateData = []
  }

  useEffect(() => {
    if(props.productType === SubProducts.COLOUR){
        dispatch(getColour());
    } else if(props.productType === SubProducts.SIZE) {
        dispatch(getSize());
    } else if(props.productType === SubProducts.SUB_PRODUCT) {
        dispatch(getSubCategory());
    } else if(props.productType === SubProducts.COUPONS) {
        dispatch(getCoupon())
    }  else if(props.productType === SubProducts.PRODUCT) {
        dispatch(getProducts())
    }
  }, []);

  useEffect(() => {
    setTableData(stateData || [])
  }, [stateData]);

  useEffect(() => {
    if(stateData && stateData.length > 0){
      const data = (stateData as any[]).filter(({value,code, name}) => {
        return (value && value.toLowerCase().includes(searchTerm.toLowerCase()))
        || (code && code.toLowerCase().includes(searchTerm.toLowerCase()))
        || (name && name.toLowerCase().includes(searchTerm.toLowerCase()));
      })
      setTableData(data)
    }
  },[searchTerm]);


  return (
    <div className="uk-width-1-1 uk-width-expand@m">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container">

        <div className="uk-card-body">
          <div className="uk-form-stacked">

            <div className="asd">
              <DataTable
                title="Users"
                columns={columns}
                data={tableData}
                defaultSortField="code"
                selectableRows={false}
                selectableRowsNoSelectAll={false}
                selectableRowsHighlight={true}
                selectableRowsVisibleOnly={false}
                expandableRows={props.expandableRows}
                expandOnRowClicked={false}
                expandableRowsComponent={<props.ExpandableComponent/>}
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
                    <div className="admin-search-header">
                      {
                        props.expandableRows &&
                          <div className="uk-float-left">
                            <div className="uk-float-left">
                             <span>Click <span uk-icon="chevron-right"></span> in table for quick actions</span>
                            </div>
                          </div>
                      }
                      <div className="uk-float-right">
                        <input className="uk-input uk-form-width-medium uk-form-small" value={searchTerm} onChange={event=> setSearchTerm(event.target.value)} type="text" placeholder={props.searchPlaceholder} />
                      </div>
                    </div>
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